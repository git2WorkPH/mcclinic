import {tmpdir} from 'node:os';
import {join} from 'node:path';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { readFileSync, readdirSync, mkdtempSync } from 'node:fs';
import { spawn, type ChildProcess } from 'node:child_process';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createDatabase } from '../apps/api/src/infrastructure/prisma/database.js';
import { seedDemo } from '../apps/api/src/infrastructure/prisma/seed.js';
import { installMvpGraphql } from '../apps/api/src/adapters/mvp-graphql.js';
import { createApp } from '../apps/api/src/app.js';
process.env.EHR_LOCAL_STATE_DIR=mkdtempSync(join(tmpdir(),'mcclinic-browser-'));
const container=await new PostgreSqlContainer('postgres:17.6-alpine').start();
const db=createDatabase(container.getConnectionUri());let server:Server|undefined,vite:ChildProcess|undefined;
try{
 const sql=new Client({connectionString:container.getConnectionUri()});await sql.connect();try{await sql.query(readdirSync('apps/api/prisma/migrations').filter(n=>/^\d/.test(n)).sort().map(n=>readFileSync(`apps/api/prisma/migrations/${n}/migration.sql`,'utf8')).join('\n'));}finally{await sql.end();}
 await seedDemo(container.getConnectionUri(),'Synthetic-browser-2026');
 const app=createApp();installMvpGraphql(app,db);server=await new Promise<Server>((resolve,reject)=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));s.once('error',reject);});
 vite=spawn('pnpm',['--filter','@ehr/clinical-app','exec','vite','--host','127.0.0.1','--port','5174','--strictPort'],{stdio:'inherit',env:{...process.env,EHR_API_TARGET:`http://127.0.0.1:${(server.address() as AddressInfo).port}`}});
 for(let attempt=0;attempt<60;attempt++){try{if((await fetch('http://127.0.0.1:5174')).ok)break;}catch{}if(attempt===59)throw new Error('Vite startup timed out');await new Promise(r=>setTimeout(r,250));}
 const result=await new Promise<number>((resolve,reject)=>{const child=spawn('pnpm',['exec','playwright','test','--config','playwright.mvp.config.ts'],{stdio:'inherit',env:process.env});child.once('error',reject);child.once('exit',code=>resolve(code??1));});
 process.exitCode=result;
}finally{
 vite?.kill('SIGTERM');if(server)await new Promise<void>(resolve=>server!.close(()=>resolve()));await db.$disconnect();await container.stop();
}
