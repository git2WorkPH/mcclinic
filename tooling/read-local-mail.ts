import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {localStateDirectory} from '../apps/api/src/modules/onboarding/infrastructure/local-state.js';
const dir=resolve(localStateDirectory(),'mailbox');
if(!existsSync(dir))console.log('No local messages yet.');else for(const file of readdirSync(dir).filter(n=>n.endsWith('.json')))console.log(readFileSync(resolve(dir,file),'utf8'));
