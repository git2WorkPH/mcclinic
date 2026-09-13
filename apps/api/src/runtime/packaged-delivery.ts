import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import type {Delivery} from '../modules/onboarding/infrastructure/mailbox.js';
export function packagedDelivery(state:string,origin:string):Delivery {
  return async message=>{
    const dir=join(state,'mailbox');mkdirSync(dir,{recursive:true,mode:0o700});
    writeFileSync(join(dir,randomUUID()+'.json'),JSON.stringify({...message,link:`${origin}/clinic#${message.kind.toLowerCase()}=${message.token}`},null,2),{flag:'wx',mode:0o600});
  };
}
