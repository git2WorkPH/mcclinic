import { spawn } from 'node:child_process';
import { packagedConfig } from './runtime/packaged-config.js';
import { seedDemo } from './infrastructure/prisma/seed.js';
import { readFileSync } from 'node:fs';
const config = packagedConfig(process.env);
const command = process.argv[2];
if (command === 'migrate') {
  const child = spawn('pnpm', ['db:migrate'], {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: config.databaseUrl },
  });
  child.on('error', () => {
    console.error('Migration process unavailable.');
    process.exitCode = 1;
  });
  child.on('exit', (code) => {
    process.exitCode = code ?? 1;
  });
} else if (command === 'seed') {
  if (!process.env.DEMO_PASSWORD_FILE)
    throw new Error('DEMO_PASSWORD_FILE required.');
  await seedDemo(
    config.databaseUrl,
    readFileSync(process.env.DEMO_PASSWORD_FILE, 'utf8').trim(),
  );
} else throw new Error('Only explicit migrate or seed is supported.');
