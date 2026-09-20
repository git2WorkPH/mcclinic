import { createRequire } from 'node:module';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { createHash } from 'node:crypto';

// Copy the frozen installed dependency closure; never resolve/download a new version.
const output = resolve('migration-runtime');
if (existsSync(output))
  throw new Error(
    'Choose a fresh build directory; existing artifacts are preserved.',
  );
mkdirSync(resolve(output, 'node_modules/.store'), { recursive: true });
const copied = new Map();
const components = [];
function locate(name, from) {
  const require = createRequire(resolve(from, 'package.json'));
  for (const directory of require.resolve.paths(name) ?? []) {
    const file = resolve(directory, name, 'package.json');
    if (existsSync(file)) return dirname(realpathSync(file));
  }
  throw new Error('Cannot identify migration dependency: ' + name);
}
function copy(name, from, parent) {
  const source = locate(name, from);
  const pkg = JSON.parse(readFileSync(resolve(source, 'package.json'), 'utf8'));
  let target = copied.get(source);
  const first = !target;
  if (!target) {
    const hash = createHash('sha256')
      .update(relative(process.cwd(), source))
      .digest('hex')
      .slice(0, 12);
    target = resolve(
      output,
      'node_modules/.store',
      `${pkg.name.replaceAll('/', '+')}@${pkg.version}-${hash}`,
    );
    copied.set(source, target);
    cpSync(source, target, {
      recursive: true,
      filter: (file) => relative(source, file).split('/')[0] !== 'node_modules',
    });
    components.push({
      type: 'library',
      name: pkg.name,
      version: pkg.version,
      'bom-ref': hash,
      purl: `pkg:npm/${pkg.name.replace('@', '%40')}@${pkg.version}`,
    });
  }
  const link = resolve(parent, 'node_modules', name);
  mkdirSync(dirname(link), { recursive: true });
  if (!existsSync(link)) symlinkSync(relative(dirname(link), target), link);
  if (!first) return;
  for (const dependency of Object.keys(pkg.dependencies ?? {}))
    copy(dependency, source, target);
  for (const dependency of Object.keys(pkg.optionalDependencies ?? {})) {
    // Platform-specific packages absent from the frozen installation are not required on this platform.
    try {
      locate(dependency, source);
    } catch {
      continue;
    }
    copy(dependency, source, target);
  }
}
copy('prisma', process.cwd(), output);
const engines = locate('@prisma/engines', locate('prisma', process.cwd()));
const binaries = readdirSync(engines).filter((name) =>
  /^schema-engine-(debian|linux-arm64)-openssl-3\.0\.x$/.test(name),
);
if (binaries.length !== 1)
  throw new Error('One Linux OpenSSL 3 schema engine is required.');
cpSync(resolve(engines, binaries[0]), resolve(output, 'schema-engine'));

writeFileSync(
  resolve(output, 'sbom.cdx.json'),
  JSON.stringify(
    {
      bomFormat: 'CycloneDX',
      specVersion: '1.5',
      version: 1,
      metadata: {
        component: {
          type: 'application',
          name: 'mcclinic-migration-cli',
          version: process.env.SOURCE_REVISION ?? 'working',
        },
      },
      components,
    },
    null,
    2,
  ),
);
console.info(`Prepared frozen Prisma closure: ${components.length} packages.`);
