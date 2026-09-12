import {randomUUID} from 'node:crypto';
import type {Database} from '../../../infrastructure/prisma/database.js';
import type {Tx} from '../../practice/infrastructure/scope.js';
import {AppError} from '../../../application/context.js';
import {decrypt,digest,matchedStep} from './crypto.js';
export const identityPractice='00000000-0000-4000-8000-000000000002';
export const denied=()=>new AppError('UNAUTHENTICATED','Invalid credentials or expired link.');
export async function lock(tx:Tx,key:string){await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${key}, 0))::text`;}
export async function audit(tx:Tx,action:string,userId:string|null,practiceId=identityPractice){await tx.auditEvent.create({data:{practiceId,actorId:userId,action,subjectId:userId??'identity',outcome:'SUCCESS',correlationId:randomUUID()}});}
export async function rate(db:Database,key:string){const bucket=digest(key+':'+Math.floor(Date.now()/900000));const count=await db.accountRate.upsert({where:{key:bucket},create:{key:bucket},update:{count:{increment:1}}});if(count.count>10)throw new AppError('UNAUTHENTICATED','Too many attempts. Try again in 15 minutes.');}
export async function factor(tx:Tx,userId:string,code:string){const f=await tx.securityFactor.findUnique({where:{userId}});if(!f?.enabled)return;
 const step=matchedStep(decrypt(f.secretCipher!),code,f.lastStep);
 if(step!==null){await tx.securityFactor.update({where:{userId},data:{lastStep:step}});await audit(tx,'account.mfa.challenge',userId);return;}
 const hash=digest(code);if(!code||!f.recoveryHashes.includes(hash))throw denied();
 await tx.securityFactor.update({where:{userId},data:{recoveryHashes:f.recoveryHashes.filter(h=>h!==hash)}});await audit(tx,'account.recovery-code.used',userId);
}
export async function verifyFactor(db:Database,userId:string,code:string){await rate(db,'factor:'+userId);await db.$transaction(async tx=>{await lock(tx,'onboarding-user:'+userId);await factor(tx,userId,code);});}
export async function revoke(tx:Tx,userId:string){await tx.user.update({where:{id:userId},data:{credentialVersion:{increment:1}}});await tx.session.updateMany({where:{userId,revokedAt:null},data:{revokedAt:new Date()}});}
