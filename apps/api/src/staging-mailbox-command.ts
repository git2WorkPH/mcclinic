import { sealedSyntheticMessage } from './runtime/staging-mailbox.js';
try {
  if (
    process.env.APP_ENV !== 'synthetic-staging' ||
    process.env.MVP_SYNTHETIC_ONLY !== 'true' ||
    process.env.STAGING_OPERATOR_JOB !== 'explicit-synthetic-job'
  )
    throw new Error();
  console.info(
    JSON.stringify(
      sealedSyntheticMessage(
        process.env.EHR_LOCAL_STATE_DIR ?? '',
        process.env.MESSAGE_ID ?? '',
        process.env.OPERATOR_PUBLIC_KEY ?? '',
      ),
    ),
  );
} catch {
  console.error('Synthetic mailbox retrieval failed; no plaintext output.');
  process.exitCode = 1;
}
