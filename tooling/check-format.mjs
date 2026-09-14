import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import * as prettier from 'prettier';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const head = git('rev-parse', '--verify', 'HEAD^{commit}');
let base = process.env.FORMAT_BASE;
if (!base || /^0+$/.test(base)) {
  const fallback = process.env.FORMAT_DEFAULT_REF;
  if (fallback) {
    base = git('merge-base', head, fallback);
  }
  if (!base || base === head) {
    base = git('rev-parse', '--verify', 'HEAD^');
  }
}
if (!/^[a-f0-9]{40}$/.test(base))
  throw new Error('FORMAT_BASE must resolve to a full Git commit SHA.');
git('cat-file', '-e', `${base}^{commit}`);
const ancestor = git('merge-base', base, head);
const files = execFileSync(
  'git',
  ['diff', '--name-only', '-z', '--diff-filter=ACMR', ancestor, head],
  { encoding: 'utf8' },
)
  .split('\0')
  .filter(Boolean);
let checked = 0;
for (const file of files) {
  const info = await prettier.getFileInfo(file, {
    ignorePath: ['.gitignore', '.prettierignore'],
  });
  if (info.ignored || !info.inferredParser) continue;
  const options = await prettier.resolveConfig(file);
  const source = await readFile(file, 'utf8');
  checked++;
  if (!(await prettier.check(source, { ...options, filepath: file }))) {
    console.error(`Formatting required: ${file}`);
    process.exitCode = 1;
  }
}
console.info(
  `Checked formatting of ${checked} changed supported files against ${ancestor}.`,
);
if (process.exitCode)
  console.error(
    'Run pnpm format <file...>, then commit the formatting changes.',
  );
