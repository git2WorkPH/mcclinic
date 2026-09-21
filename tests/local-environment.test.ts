import { describe, expect, it, vi } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  loadLocalEnvironment,
  workspaceRoot,
} from '../apps/api/src/runtime/local-environment.js';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'mcclinic-dotenv-'));
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: 'clinic-ehr' }),
  );
  return root;
}

describe('local development environment boundary', () => {
  it('loads quoted/commented values quietly and preserves explicit environment including empty strings', () => {
    const root = fixture();
    writeFileSync(
      join(root, '.env'),
      'PORT=4999\nDATABASE_URL="postgresql://synthetic:local@localhost/mcclinic" # comment\nEMPTY=file\n',
    );
    const env = {
      PORT: '4001',
      EMPTY: '',
      DOTENV_CONFIG_OVERRIDE: 'true',
      DOTENV_CONFIG_DEBUG: 'true',
    } as NodeJS.ProcessEnv;
    const log = vi.spyOn(console, 'log');
    try {
      loadLocalEnvironment(env, root);
      expect(env.PORT).toBe('4001');
      expect(env.EMPTY).toBe('');
      expect(env.DATABASE_URL).toBe(
        'postgresql://synthetic:local@localhost/mcclinic',
      );
      expect(log).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
  it('resolves the same root from source and compiled entry points independently of cwd', () => {
    const root = fixture();
    for (const folder of [
      'apps/api/src/runtime',
      'apps/api/dist/apps/api/src/runtime',
    ]) {
      mkdirSync(join(root, folder), { recursive: true });
      expect(
        workspaceRoot(
          pathToFileURL(join(root, folder, 'local-environment.js')).href,
        ),
      ).toBe(root);
    }
  });
  it('allows a missing file but rejects unreadable configuration without values', () => {
    const root = fixture();
    expect(() => loadLocalEnvironment({}, root)).not.toThrow();
    mkdirSync(join(root, '.env'));
    expect(() => loadLocalEnvironment({}, root)).toThrow(
      'Cannot read local environment configuration.',
    );
  });
  it.each([
    { NODE_ENV: 'production' },
    { NODE_ENV: 'test' },
    { CI: 'true' },
    { APP_ENV: 'synthetic-staging' },
    { APP_ENV: 'packaged' },
    { APP_ENV: 'production' },
  ])('does not read developer files in injected context %j', (context) => {
    const root = fixture();
    mkdirSync(join(root, '.env')); // Reading this would fail, proving the boundary is checked first.
    const env: NodeJS.ProcessEnv = { ...context };
    expect(() => loadLocalEnvironment(env, root)).not.toThrow();
    expect(env.DATABASE_URL).toBeUndefined();
  });
});
