import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

const checker = resolve('tooling/check-format.mjs');
function fixture() {
  const cwd = mkdtempSync(resolve(tmpdir(), 'mcclinic-format-'));
  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  git('init', '-q');
  writeFileSync(resolve(cwd, '.prettierrc.json'), '{}\n');
  writeFileSync(resolve(cwd, '.prettierignore'), 'generated.js\n');
  writeFileSync(resolve(cwd, 'legacy.js'), 'const old=1;');
  const commit = () => {
    git('add', '.');
    git(
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.test',
      'commit',
      '-qm',
      'fixture',
    );
  };
  commit();
  const base = git('rev-parse', 'HEAD');
  const check = (ref = base, fallback = '') =>
    spawnSync(process.execPath, [checker], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, FORMAT_BASE: ref, FORMAT_DEFAULT_REF: fallback },
    });
  return { cwd, commit, check, git, base };
}

test('changed-file formatter passes formatted additions and ignores unchanged legacy and generated files', () => {
  const f = fixture();
  writeFileSync(resolve(f.cwd, 'with spaces.js'), 'const value = 1;\n');
  writeFileSync(resolve(f.cwd, 'generated.js'), 'const generated=1;');
  writeFileSync(resolve(f.cwd, 'unknown.bin'), 'unsupported');
  f.commit();
  const result = f.check();
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('1 changed supported files');
});

test('changed-file formatter rejects bad formatting without rewriting it', () => {
  const f = fixture();
  writeFileSync(resolve(f.cwd, 'bad.js'), 'const value=1;');
  f.commit();
  const result = f.check();
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Formatting required: bad.js');
  expect(
    execFileSync('git', ['status', '--porcelain'], {
      cwd: f.cwd,
      encoding: 'utf8',
    }),
  ).toBe('');
});

test('changed-file formatter fails on unavailable base history', () => {
  const f = fixture();
  const result = f.check('1'.repeat(40));
  expect(result.status).not.toBe(0);
});

test('new branch push checks all changes from default-branch merge base', () => {
  const f = fixture();
  writeFileSync(resolve(f.cwd, 'first.js'), 'const bad=1;');
  f.commit();
  writeFileSync(resolve(f.cwd, 'second.js'), 'const good = 2;\n');
  f.commit();
  const result = f.check('0'.repeat(40), f.base);
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Formatting required: first.js');
  expect(result.stdout).toContain('2 changed supported files');
});

test('deleted fixture files are not passed to the formatter', () => {
  const f = fixture();
  f.git('rm', 'legacy.js');
  f.commit();
  const result = f.check();
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('0 changed supported files');
});
