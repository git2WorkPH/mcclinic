import { randomBytes, scrypt, timingSafeEqual, createHash, randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import type { Database } from '../../../infrastructure/prisma/database.js';
import type { IdentityPorts } from '../application/identity.js';
import type { Role } from '../../../application/context.js';
const derive=promisify(scrypt);
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
export async function hashPassword(password:string) {const salt=randomBytes(16).toString('hex');const key=await derive(password,salt,64) as Buffer;return `${salt}:${key.toString('hex')}`;}
export function localIdentity(db:Database): IdentityPorts {
  return {
    async account(username){const u=await db.user.findFirst({where:{username,active:true}});return u?{id:u.id,name:u.name,role:u.role as Role,passwordHash:u.passwordHash}:null;},
    async verify(password,hash){const [salt,hex]=hash.split(':');const expected=Buffer.from(hex??'00'.repeat(64),'hex');const actual=await derive(password,salt??'missing-account-salt',64) as Buffer;return expected.length===actual.length && timingSafeEqual(expected,actual) && Boolean(hash);},
    async openSession(actor){const token=randomBytes(32).toString('base64url');await db.$transaction(async tx=>{await tx.session.create({data:{userId:actor.id,tokenHash:digest(token),expiresAt:new Date(Date.now()+8*60*60*1000)}});await tx.auditEvent.create({data:{actorId:actor.id,action:'session.login',subjectId:actor.id,outcome:'SUCCESS',correlationId:randomUUID()}});});return token;},
    async resolve(token){if(!token)return null;const session=await db.session.findUnique({where:{tokenHash:digest(token)},include:{user:true}});if(!session || session.revokedAt || session.expiresAt<=new Date() || !session.user.active)return null;return {id:session.user.id,name:session.user.name,role:session.user.role as Role};},
    async revoke(token){if(!token)return;await db.$transaction(async tx=>{const session=await tx.session.findUnique({where:{tokenHash:digest(token)}});if(!session)return;await tx.session.updateMany({where:{id:session.id,revokedAt:null},data:{revokedAt:new Date()}});await tx.auditEvent.create({data:{actorId:session.userId,action:'session.logout',subjectId:session.userId,outcome:'SUCCESS',correlationId:randomUUID()}});});},
    async failed(){await db.auditEvent.create({data:{action:'session.login',subjectId:'identity',outcome:'DENIED',correlationId:randomUUID()}});},
  };
}
