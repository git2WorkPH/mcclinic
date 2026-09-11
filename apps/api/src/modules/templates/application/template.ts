import { AppError } from '../../../application/context.js';
export interface TemplateDefinition {heading:string;body:string;footer:string;layout:'STANDARD'|'COMPACT';includeAddress:boolean}
export const tokens=['patient.fullName','patient.birthDate','patient.ageAtIssue','patient.address','clinic.name','clinic.address','clinic.phone','clinic.email','doctor.fullName','document.issueDate'];
export const defaultTemplate:TemplateDefinition={heading:'{{clinic.name}}',body:'',footer:'',layout:'STANDARD',includeAddress:false};
export function validateTemplate(value:TemplateDefinition) {
 if(!['STANDARD','COMPACT'].includes(value.layout)||typeof value.includeAddress!=='boolean')throw new AppError('VALIDATION','Invalid template layout.');
 for(const field of [value.heading,value.body,value.footer]){
  if(typeof field!=='string'||field.length>4000||/[<>]/.test(field))throw new AppError('VALIDATION','Use plain template text, up to 4000 characters per section.');
  const residue=field.replace(/\{\{([^{}]+)\}\}/g,(_all,key:string)=>{if(!tokens.includes(key.trim()))throw new AppError('VALIDATION','Unknown template placeholder.');return '';});
  if(/[{}]/.test(residue))throw new AppError('VALIDATION','Malformed placeholder.');
 }
 return value;
}
export const escapeHtml=(value:unknown)=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function ageAtIssue(birthDate:string,issueDate:string) {const [by,bm,bd]=birthDate.split('-').map(Number),[iy,im,id]=issueDate.split('-').map(Number);return iy!-by!-(im!<bm!||(im===bm&&id!<bd!)?1:0);}
export function populate(text:string,values:Record<string,string>) {return text.replace(/\{\{([^{}]+)\}\}/g,(_all,key:string)=>{const value=values[key.trim()];if(!value?.trim())throw new AppError('VALIDATION',`Missing template value: ${key.trim()}`);return escapeHtml(value);});}
