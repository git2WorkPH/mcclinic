import { AppError } from '../../../application/context.js';
export const plans={SOLO:1,TEAM:5} as const;
export function effectiveState(subscription:{state:string;until:Date|null},now=new Date()) {return ['TRIAL','PAST_DUE'].includes(subscription.state)&&subscription.until&&subscription.until<=now?'RESTRICTED':subscription.state;}
export function simulatedSubscription(plan:string,state:string) {
 if(!(plan in plans)||!['TRIAL','ACTIVE','PAST_DUE','RESTRICTED'].includes(state))throw new AppError('VALIDATION','Choose a supported simulated plan and state.');
 return {plan,state,until:state==='TRIAL'?new Date(Date.now()+14*86400000):state==='PAST_DUE'?new Date(Date.now()+7*86400000):null};
}
