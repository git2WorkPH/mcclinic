import { loadLocalEnvironment } from '../apps/api/src/runtime/local-environment.js';
loadLocalEnvironment();
import { seedDemo } from '../apps/api/src/infrastructure/prisma/seed.js';
if (
  process.env.MVP_SYNTHETIC_ONLY !== 'true' ||
  !process.env.DATABASE_URL ||
  !process.env.DEMO_PASSWORD
)
  throw new Error(
    'Set MVP_SYNTHETIC_ONLY=true, DATABASE_URL and DEMO_PASSWORD.',
  );
await seedDemo(process.env.DATABASE_URL, process.env.DEMO_PASSWORD);
console.info(
  'Synthetic accounts ready: clinician, reception, admin. Existing accounts preserved.',
);
