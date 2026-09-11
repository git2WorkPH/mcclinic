import type { Tx } from '../../practice/infrastructure/scope.js';
import { defaultTemplate, type TemplateDefinition, populate, ageAtIssue, escapeHtml } from '../application/template.js';
import { htmlRenderer } from '../../../clinical-document/infrastructure/html-renderer.js';
import type { DocumentKind, DocumentRevision } from '../../../clinical-document/domain/document.js';
export async function captureTemplate(tx:Tx,practiceId:string,kind:DocumentKind,revision:DocumentRevision) {
 const practice=await tx.practice.findUniqueOrThrow({where:{id:practiceId}});
 const patient=await tx.patient.findFirstOrThrow({where:{id:revision.patientSnapshot.id,practiceId}});
 const template=await tx.documentTemplate.findUnique({where:{practiceId_kind:{practiceId,kind}}});
 const published=template?.publishedVersion?await tx.templateRevision.findUnique({where:{templateId_version:{templateId:template.id,version:template.publishedVersion},practiceId}}):null;
 const definition=published?.definition as unknown as TemplateDefinition??defaultTemplate;
 const brand=practice.branding as Record<string,string>;
 const date=revision.recordedAt.slice(0,10);
 const values={'patient.fullName':revision.patientSnapshot.name,'patient.birthDate':patient.birthDate,'patient.ageAtIssue':String(ageAtIssue(patient.birthDate,date)),'patient.address':patient.address,'clinic.name':brand.systemName||practice.name,'clinic.address':brand.address||'','clinic.phone':brand.phone||'','clinic.email':brand.email||'','doctor.fullName':revision.issuerSnapshot.name,'document.issueDate':date};
 const templateVersion=published?`${published.templateId}:v${published.version}`:'saas-default-v1';
 const html=renderConfigured(kind,{...revision,templateVersion},definition,brand,values);
 return {renderedHtml:html,issueSnapshot:JSON.parse(JSON.stringify({definition,branding:brand,values,templateVersion})),templateVersion};
}
export function renderConfigured(kind:DocumentKind,revision:DocumentRevision,definition:TemplateDefinition,brand:Record<string,string>,values:Record<string,string>) {
 const sections=[definition.heading,definition.body,definition.footer].map(s=>populate(s,values));
 const address=definition.includeAddress?populate('{{patient.address}}',values):'';
 let html=htmlRenderer.render(kind,revision).replace('Single Clinic · Development',escapeHtml(values['clinic.name']));
 html=html.replace('<header>',`<header>${brand.logo?`<img alt="Clinic logo" style="max-width:140px;max-height:80px" src="${escapeHtml(brand.logo)}">`:''}<h2>${sections[0]}</h2><p style="white-space:pre-wrap">${sections[1]}</p>${address?`<p>${address}</p>`:''}`).replace('<footer>',`<footer><p style="white-space:pre-wrap">${sections[2]}</p>`);
 if(definition.layout==='COMPACT')html=html.replace('font:12pt/1.5','font:11pt/1.3');
 return html;
}
