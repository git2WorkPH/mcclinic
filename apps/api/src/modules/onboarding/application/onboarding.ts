import {AppError,type Actor} from '../../../application/context.js';
export interface Registration {email:string;name:string;password:string;practiceName:string}
export interface OnboardingStore {
 register(input:Registration):Promise<void>;resend(email:string):Promise<void>;verify(token:string):Promise<void>;
 resetRequest(email:string):Promise<void>;reset(token:string,password:string,code:string):Promise<void>;
 invite(actor:Actor,email:string,role:string):Promise<void>;accept(token:string,password:string,code:string):Promise<void>;
 startMfa(actor:Actor,password:string):Promise<{secret:string;uri:string}>;confirmMfa(actor:Actor,code:string):Promise<string[]>;disableMfa(actor:Actor,password:string,code:string):Promise<void>;status(actor:Actor):Promise<boolean>;
}
const authenticated=(a:Actor|null)=>{if(!a)throw new AppError('UNAUTHENTICATED','Sign in first.');return a;};
export function onboardingUseCases(store:OnboardingStore){return {...store,invite:(a:Actor|null,email:string,role:string)=>{const actor=authenticated(a);if(actor.role!=='ADMINISTRATOR'&&!actor.canManage)throw new AppError('FORBIDDEN','Practice management permission required.');return store.invite(actor,email,role);},startMfa:(a:Actor|null,p:string)=>store.startMfa(authenticated(a),p),confirmMfa:(a:Actor|null,c:string)=>store.confirmMfa(authenticated(a),c),disableMfa:(a:Actor|null,p:string,c:string)=>store.disableMfa(authenticated(a),p,c),status:(a:Actor|null)=>store.status(authenticated(a))};}
