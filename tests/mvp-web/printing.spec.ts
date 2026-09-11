import { expect, test } from '@playwright/test';
import { htmlRenderer } from '../../apps/api/src/clinical-document/infrastructure/html-renderer';
import type { DocumentRevision } from '../../apps/api/src/clinical-document/domain/document';

test('long demo documents retain final content and print across A4 pages', async ({page}) => {
  const revision: DocumentRevision = {
    id:'revision', documentId:'synthetic-document',version:2,state:'ISSUED',
    content:{title:'Synthetic certificate',startsOn:'2026-09-11',endsOn:'2026-09-12',statement:Array.from({length:160},(_,i)=>`Synthetic line ${i+1}: demo content only.`).join('\n')+'\nFINAL-SYNTHETIC-MARKER'},
    patientSnapshot:{id:'synthetic-patient',name:'Demo Patient',birthDate:'1990-01-01'},issuerSnapshot:{id:'demo-clinician',name:'Dr Demo'},templateVersion:'demo-v1',authorId:'demo-clinician',reason:'',previousVersion:1,recordedAt:'2026-09-11T00:00:00Z'
  };
  await page.setContent(htmlRenderer.render('CERTIFICATE',revision));
  await page.emulateMedia({media:'print'});
  await expect(page.getByText(/FINAL-SYNTHETIC-MARKER/)).toBeVisible();
  expect(await page.locator('body').evaluate(e=>e.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  const pdf=await page.pdf({path:'test-results/mvp/long-certificate.pdf',preferCSSPageSize:true});
  expect(pdf.subarray(0,5).toString()).toBe('%PDF-');
  // Chromium writes page dictionaries separately, allowing a dependency-free pagination assertion.
  expect((pdf.toString('latin1').match(/\/Type \/Page\b/g)??[]).length).toBeGreaterThan(2);
  await expect(page.getByText('DEMO — NOT FOR CLINICAL USE',{exact:true})).toBeVisible();
});
