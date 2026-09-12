import {existsSync,readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
export function localStateDirectory(){if(process.env.EHR_LOCAL_STATE_DIR)return resolve(process.env.EHR_LOCAL_STATE_DIR);let dir=process.cwd();for(;;){const path=resolve(dir,'package.json');if(existsSync(path)&&JSON.parse(readFileSync(path,'utf8')).name==='clinic-ehr')return resolve(dir,'.local');const parent=dirname(dir);if(parent===dir)throw new Error('Run from the project or set EHR_LOCAL_STATE_DIR.');dir=parent;}}
