import type { Prisma } from '../../../infrastructure/prisma/generated/client.js';
import { AppError, type Actor } from '../../../application/context.js';
export const DEFAULT_PRACTICE='00000000-0000-4000-8000-000000000001';
export type Tx=Prisma.TransactionClient;
export async function verifyMembership(tx:Tx,actor:Actor) {
 const practiceId=actor.practiceId??DEFAULT_PRACTICE;
 const m=await tx.membership.findFirst({where:{practiceId,userId:actor.id,active:true,user:{active:true}}});
 if(!m || m.role!==actor.role || Boolean(m.canManage)!==Boolean(actor.canManage))throw new AppError('FORBIDDEN','Active practice membership is required.');
 return practiceId;
}
const owned=new Set(['patient','consultation','noteRevision','clinicalDocument','documentRevision','appointment','appointmentChange','auditEvent','commandReceipt','documentTemplate','templateRevision']);
// Closed adapter allowlist: all clinical repository operations are scoped, including unique reads and writes.
export function scoped(tx:Tx,practiceId:string):Tx {
 return new Proxy(tx,{get(target,property){
  const model=String(property);const delegate=Reflect.get(target,property);
  if(!owned.has(model))return typeof delegate==='function'?delegate.bind(target):delegate;
  return new Proxy(delegate,{get(d,operation){
   const op=String(operation);
   return async (input:Record<string,any>={})=>{
    const args={...input};
    if(['findUnique','findUniqueOrThrow','findFirst','findFirstOrThrow','findMany','count','update','updateMany'].includes(op))args.where={...args.where,practiceId};
    else if(op!=='create')throw new AppError('FORBIDDEN','Unsupported scoped repository operation.');
    if(args.data){args.data={...args.data,practiceId};if(model==='patient'&&args.data.identityKey&&practiceId!==DEFAULT_PRACTICE)args.data.identityKey=practiceId+':'+args.data.identityKey;}
    return Reflect.get(d,operation).call(d,args);
   };
  }});
 }});
}
export async function clinicianDirectory(tx:Tx,practiceId:string,id?:string) {
 const rows=await tx.membership.findMany({where:{practiceId,active:true,role:'CLINICIAN',...(id?{userId:id}:{}),user:{active:true}},include:{user:true},orderBy:{user:{name:'asc'}}});
 return rows.map(m=>({id:m.userId,name:m.user.name,role:'CLINICIAN' as const,practiceId}));
}
