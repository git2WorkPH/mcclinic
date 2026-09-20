import { build } from 'esbuild';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { builtinModules } from 'node:module';

const root = process.cwd();
mkdirSync('serving', { recursive: true });
for (const [name, entry] of Object.entries({
  api: 'packaged-main',
  web: 'packaged-web-main',
  staging: 'staging-main',
  mailbox: 'staging-mailbox-command',
  'migration-command': 'staging-command',
})) {
  const result = await build({
    entryPoints: [`apps/api/dist/apps/api/src/${entry}.js`],
    outfile: `serving/${name}.mjs`,
    bundle: true,
    platform: 'node',
    target: 'node24',
    format: 'esm',
    metafile: true,
    external: ['pg-native'],
    banner: {
      js: 'import { createRequire as servingRequire } from "node:module"; const require = servingRequire(import.meta.url);',
    },
    plugins: [
      {
        name: 'preserve-local-asset-paths',
        setup(api) {
          api.onLoad({ filter: /\/apps\/api\/dist\/.*\.js$/ }, (args) => {
            const virtual =
              'file:///workspace/' +
              relative(root, args.path).split('\\').join('/');
            return {
              contents: readFileSync(args.path, 'utf8').replaceAll(
                'import.meta.url',
                JSON.stringify(virtual),
              ),
              loader: 'js',
            };
          });
        },
      },
    ],
  });
  const allowed = new Set([
    ...builtinModules,
    ...builtinModules.map((m) => 'node:' + m),
    'pg-native',
  ]);
  for (const output of Object.values(result.metafile.outputs))
    for (const dep of output.imports) {
      if (dep.external && !allowed.has(dep.path))
        throw new Error('Unreviewed runtime dependency: ' + dep.path);
    }
  const components = new Map();
  for (const file of Object.keys(result.metafile.inputs)) {
    if (!file.includes('node_modules/')) continue;
    let parent = dirname(resolve(file));
    while (parent !== dirname(parent)) {
      const manifest = resolve(parent, 'package.json');
      if (existsSync(manifest)) {
        const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
        if (pkg.name && pkg.version) {
          components.set(pkg.name + '@' + pkg.version, {
            type: 'library',
            name: pkg.name,
            version: pkg.version,
            'bom-ref': pkg.name + '@' + pkg.version,
            purl: `pkg:npm/${pkg.name.replace('@', '%40')}@${pkg.version}`,
          });
          break;
        }
      }
      parent = dirname(parent);
    }
  }
  const metadata = {
    component: {
      type: 'application',
      name: 'mcclinic-' + name,
      version: process.env.SOURCE_REVISION ?? 'working',
    },
  };
  writeFileSync(
    `serving/${name}.sbom.cdx.json`,
    JSON.stringify(
      {
        bomFormat: 'CycloneDX',
        specVersion: '1.5',
        version: 1,
        metadata,
        components: [...components.values()],
      },
      null,
      2,
    ),
  );
  writeFileSync(
    `serving/${name}.build.json`,
    JSON.stringify(
      {
        node: process.version,
        revision: metadata.component.version,
        sha256: createHash('sha256')
          .update(readFileSync(`serving/${name}.mjs`))
          .digest('hex'),
        inputs: result.metafile.inputs,
        outputs: result.metafile.outputs,
      },
      null,
      2,
    ),
  );
}
