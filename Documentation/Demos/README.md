# MCClinic client walkthrough

Client-facing, captioned recording of the actual local development app. Synthetic accounts and patient data only. No real email delivery, billing, patient data or deployment is demonstrated.

Final video: `MCClinic-Client-Demo.mp4` (H.264 MP4; captions are visible in the picture; no voiceover).
Verified export: 1 minute 44.52 seconds, 1600×1000, 25 fps, approximately 3.5 MB. Complete decode check passed; prescription, certificate and history frames visually inspected. Final recording completed successfully.

## Walkthrough
1. Doctor registration with a new practice name.
2. Account verification using the local development mailbox, then sign-in.
3. Practice branding and guided certificate-template preview/publishing.
4. Patient registration.
5. Appointment booking, identity confirmation and check-in.
6. Consultation notes, finalization, amendments and version history.
7. Prescription creation, issue and printable preview.
8. Medical-certificate creation, issue and preview.
9. Patient history.

The Print / Save PDF capability is shown through its document preview and visible action; an operating-system print dialog is not recorded. The visit is performed by a clinician with practice-management permissions. Other staff roles and practice switching are not demonstrated in this recording.

## Production context
This is a development preview, not a released clinical service. All previews remain marked DEMO — NOT FOR CLINICAL USE. Jurisdiction-specific clinical, privacy, signature and regulatory findings remain open; billing is simulated. Do not describe this video as proof of production readiness or legal compliance.

## Recording provenance
Prepared 2026-09-13 from the local TASK-032 working tree. Playwright drove actual UI actions against a fresh disposable PostgreSQL instance; no existing database was modified. A presentation frame supplies chapter titles and explanatory captions without changing application files. Recording scripts and raw footage are retained in ignored `.local/client-demo-v2/`.

An initial take in `.local/client-demo/` stopped at the certificate's required-address validation; it is not the client deliverable. The final take supplies a synthetic patient address. Existing unrelated appointment/consultation edits remain untouched. Generated media is left uncommitted for review.

Integration update: on 2026-09-13 the owner requested merging all changes. The final MP4 and this README are now committed on local master; raw takes remain ignored. Nothing was published or sent.
