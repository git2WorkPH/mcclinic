import {localStateDirectory} from './local-state.js';
import {createHmac,createHash,randomBytes,createCipheriv,createDecipheriv,timingSafeEqual} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32(bytes:Buffer){let bits=0,value=0,result='';for(const b of bytes){value=(value<<8)|b;bits+=8;while(bits>=5){result+=alphabet[(value>>>(bits-5))&31];bits-=5;}}if(bits)result+=alphabet[(value<<(5-bits))&31];return result;}
function decode(s:string){let bits=0,value=0;const result:number[]=[];for(const c of s){value=(value<<5)|alphabet.indexOf(c);bits+=5;if(bits>=8){result.push((value>>>(bits-8))&255);bits-=8;}}return Buffer.from(result);}
export function totp(secret:string,step:number,digits=6){const b=Buffer.alloc(8);b.writeBigUInt64BE(BigInt(step));const h=createHmac('sha1',decode(secret)).update(b).digest();const offset=h[h.length-1]!&15;return String((h.readUInt32BE(offset)&0x7fffffff)%10**digits).padStart(digits,'0');}
export function matchedStep(secret:string,code:string,lastStep:number,now=Date.now()){if(!/^\d{6}$/.test(code))return null;const current=Math.floor(now/30000);for(const step of [current,current-1,current+1])if(step>lastStep&&timingSafeEqual(Buffer.from(totp(secret,step)),Buffer.from(code)))return step;return null;}
export function localKey(){const dir=localStateDirectory();mkdirSync(dir,{recursive:true,mode:0o700});const path=resolve(dir,'onboarding-key');try{writeFileSync(path,randomBytes(32),{flag:'wx',mode:0o600});}catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e;}const key=readFileSync(path);if(key.length!==32)throw new Error('Invalid onboarding encryption key.');return key;}
export function encrypt(value:string){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',localKey(),iv);const result=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return [iv.toString('base64'),cipher.getAuthTag().toString('base64'),result.toString('base64')].join('.');}
export function decrypt(value:string){const [iv,tag,data]=value.split('.');const decipher=createDecipheriv('aes-256-gcm',localKey(),Buffer.from(iv!,'base64'));decipher.setAuthTag(Buffer.from(tag!,'base64'));return Buffer.concat([decipher.update(Buffer.from(data!,'base64')),decipher.final()]).toString('utf8');}
