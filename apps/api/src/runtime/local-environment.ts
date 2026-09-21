import { readFileSync } from 'node:fs';
import { dirname, join, parse as parsePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'dotenv';

export function workspaceRoot(start = import.meta.url): string {
  let directory = dirname(fileURLToPath(start));
  while (true) {
    try {
      const manifest = JSON.parse(
        readFileSync(join(directory, 'package.json'), 'utf8'),
      );
      if (manifest.name === 'clinic-ehr') return directory;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT')
        throw new Error('Cannot locate local workspace configuration.');
    }
    if (directory === parsePath(directory).root)
      throw new Error('Cannot locate local workspace configuration.');
    directory = dirname(directory);
  }
}

/** Local entry points only. Injected environment is authoritative; never log secrets. */
export function loadLocalEnvironment(
  environment: NodeJS.ProcessEnv = process.env,
  root?: string,
): void {
  if (
    ['production', 'test'].includes(environment.NODE_ENV ?? '') ||
    (environment.CI && environment.CI !== 'false') ||
    (environment.APP_ENV && environment.APP_ENV !== 'development')
  )
    return;
  let source: string;
  try {
    source = readFileSync(join(root ?? workspaceRoot(), '.env'), 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw new Error('Cannot read local environment configuration.');
  }
  // Parsing instead of global config keeps DOTENV_CONFIG_* flags from changing precedence/logging.
  const values = parse(source);
  for (const [name, value] of Object.entries(values)) {
    if (environment[name] === undefined) environment[name] = value;
  }
}
