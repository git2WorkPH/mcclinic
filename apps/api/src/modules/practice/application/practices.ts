import { AppError, type Actor } from '../../../application/context.js';
import { branding, type Branding } from './settings.js';
export interface TemplateDefinition {heading:string;body:string;footer:string;layout:'STANDARD'|'COMPACT';includeAddress:boolean}
export interface PracticePolicies {validateTemplate(value:TemplateDefinition):TemplateDefinition; simulatedSubscription(plan:string,state:string):unknown}
export interface PracticeStore {
 actor(actor:Actor|null,requested:string|null):Promise<Actor|null>;
 list(actor:Actor|null):Promise<unknown>;
 create(actor:Actor|null,name:string):Promise<unknown>;
 settings(actor:Actor|null):Promise<unknown>;
 member(actor:Actor|null,input:{username:string;role:string;active:boolean;expected:number}):Promise<unknown>;
 brand(actor:Actor|null,expected:number,value:Branding):Promise<unknown>;
 templates(actor:Actor|null):Promise<unknown>;
 saveTemplate(actor:Actor|null,kind:string,expected:number,value:TemplateDefinition,publish:boolean):Promise<unknown>;
 previewTemplate(actor:Actor|null,value:TemplateDefinition,kind?:string):Promise<string>;
 subscription(actor:Actor|null,expected:number,plan:string,state:string):Promise<unknown>;
 export(actor:Actor|null):Promise<unknown>;
}
function actor(value:Actor|null,administrator=false):Actor {if(!value)throw new AppError('UNAUTHENTICATED','Sign in first.');if(administrator&&value.role!=='ADMINISTRATOR'&&!value.canManage)throw new AppError('FORBIDDEN','Practice administrator permission required.');return value;}
// Persistence must revalidate membership inside its transaction; these use cases enforce action permissions.
export function practiceUseCases(store:PracticeStore, policies:PracticePolicies) {
 const {validateTemplate,simulatedSubscription}=policies;
 return {
 actor:(a:Actor|null,id:string|null)=>store.actor(a,id),
 list:(a:Actor|null)=>store.list(actor(a)),
 create:(a:Actor|null,name:string)=>{actor(a);if(!name.trim()||name.length>100)throw new AppError('VALIDATION','Practice name is required.');return store.create(a,name.trim());},
 settings:(a:Actor|null)=>store.settings(actor(a)),
 member:(a:Actor|null,input:Parameters<PracticeStore['member']>[1])=>store.member(actor(a,true),input),
 brand:(a:Actor|null,expected:number,value:Branding)=>store.brand(actor(a,true),expected,branding(value)),
 templates:(a:Actor|null)=>store.templates(actor(a,true)),
 saveTemplate:(a:Actor|null,kind:string,expected:number,value:TemplateDefinition,publish:boolean)=>store.saveTemplate(actor(a,true),kind,expected,validateTemplate(value),publish),
 previewTemplate:(a:Actor|null,value:TemplateDefinition,kind?:string)=>store.previewTemplate(actor(a,true),validateTemplate(value),kind),
 subscription:(a:Actor|null,expected:number,plan:string,state:string)=>{actor(a,true);simulatedSubscription(plan,state);return store.subscription(a,expected,plan,state);},
 export:(a:Actor|null)=>store.export(actor(a)),
 };
}
