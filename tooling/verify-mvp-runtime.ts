import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { spawn } from 'node:child_process';
const container=await new PostgreSqlContainer('postgres:17.6-alpine').start();
const environment={...process.env,DATABASE_URL:container.getConnectionUri(),MVP_SYNTHETIC_ONLY:'true',HOST:'127.0.0.1',PORT:'4187'};
let api:ReturnType<typeof spawn>|undefined;
try {
  for(let run=0;run<2;run++) await new Promise<void>((resolve,reject)=>{
    const child=spawn('pnpm',['db:migrate'],{env:environment,stdio:'inherit'});
    child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(new Error('Migration failed')));
  });
  api=spawn('node',['apps/api/dist/apps/api/src/mvp-main.js'],{env:environment,stdio:'inherit'});
  let ready=false;
  for(let attempt=0;attempt<40;attempt++) {
    if(api.exitCode!==null) throw new Error('Compiled MVP API exited before readiness');
    try { if((await fetch('http://127.0.0.1:4187/health/ready')).ok){ready=true;break;} }catch{}
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!ready)throw new Error('Compiled MVP API readiness timed out');
  console.log('Fresh and repeated migrate deploy plus compiled MVP readiness passed.');
} finally {if(api && api.exitCode===null){api.kill('SIGTERM');await new Promise(resolve=>api!.once('exit',resolve));}await container.stop();}
