import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import * as G from '../packages/graphql-contract/src/operations.generated';
import { createDatabase, type Database } from '../apps/api/src/infrastructure/prisma/database';
import { seedDemo } from '../apps/api/src/infrastructure/prisma/seed';
import { createApp } from '../apps/api/src/app';
import { installMvpGraphql } from '../apps/api/src/adapters/mvp-graphql';
import { composeMvp } from '../apps/api/src/mvp-composition';
let container:StartedPostgreSqlContainer,db:Database,server:Server,url:string;
let clinician:string,reception:string,admin:string,providerId:string;
const password='Synthetic-only-test-2026';
const patientInput=(name='Example'):G.PatientInput=>({givenName:name,familyName:'Synthetic',birthDate:'1990-01-02',phone:'0400000000',email:'',address:''});
async function request<T,V>(document:TypedDocumentNode<T,V>,variables:V,token='') {
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({query:print(document),variables})});
  return await response.json() as {data?:T;errors?:{message:string;extensions:{code:string}}[]};
}
async function ok<T,V>(document:TypedDocumentNode<T,V>,variables:V,token=''):Promise<T>{const result=await request(document,variables,token);expect(result.errors).toBeUndefined();expect(result.data).toBeDefined();return result.data!;}
async function newPatient(name:string=randomUUID()){return (await ok(G.RegisterPatientDocument,{key:randomUUID(),input:patientInput(name)},reception)).registerPatient;}
beforeAll(async()=>{
  container=await new PostgreSqlContainer('postgres:17.6-alpine').start();
  const client=new Client({connectionString:container.getConnectionUri()});await client.connect();
  try{await client.query(readFileSync('apps/api/prisma/migrations/202609110001_mvp/migration.sql','utf8'));}finally{await client.end();}
  await seedDemo(container.getConnectionUri(),password);db=createDatabase(container.getConnectionUri());
  const app=createApp();installMvpGraphql(app,db);server=await new Promise<Server>(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});url=`http://127.0.0.1:${(server.address() as AddressInfo).port}/mvp/graphql`;
  const c=await ok(G.SignInDocument,{username:'clinician',password});clinician=c.login.token;providerId=c.login.actor.id;
  reception=(await ok(G.SignInDocument,{username:'reception',password})).login.token;
  admin=(await ok(G.SignInDocument,{username:'admin',password})).login.token;
},120000);
afterAll(async()=>{if(server)await new Promise<void>(resolve=>server.close(()=>resolve()));if(db)await db.$disconnect();if(container)await container.stop();});
describe('persistent local EHR MVP',()=>{
  it('enforces authentication and role denials at API and use-case boundaries',async()=>{
    const denied=await request(G.PatientSearchDocument,{query:'',offset:0,limit:20});expect(denied.errors?.[0]?.extensions.code).toBe('UNAUTHENTICATED');
    for(const token of [reception,admin]){const r=await request(G.ClinicalRecordsDocument,{patientId:randomUUID()},token);expect(r.errors?.[0]?.extensions.code).toBe('FORBIDDEN');}
    const audit=await request(G.AuditTrailDocument,{offset:0,limit:20},clinician);expect(audit.errors?.[0]?.extensions.code).toBe('FORBIDDEN');
    await expect(async () => composeMvp(db).patients.get(null,randomUUID())).rejects.toMatchObject({code:'UNAUTHENTICATED'});
    const a=await ok(G.AuditTrailDocument,{offset:0,limit:100},admin);expect(a.auditEvents.some(e=>e.outcome==='DENIED')).toBe(true);
  });
  it('registers/searches/updates with duplicate and stale-write protection, surviving reconnect',async()=>{
    const p=await newPatient('Unique patient');
    const found=await ok(G.PatientSearchDocument,{query:'Unique patient Synthetic',offset:0,limit:20},reception);expect(found.patients.items.map(x=>x.id)).toContain(p.id);
    const duplicate=await request(G.RegisterPatientDocument,{key:randomUUID(),input:patientInput('unique patient')},reception);expect(duplicate.errors?.[0]?.extensions.code).toBe('CONFLICT');
    const input={...patientInput('Unique patient'),phone:'0411111111'};
    const writes=await Promise.all([request(G.UpdateProfileDocument,{key:randomUUID(),id:p.id,expected:1,input},reception),request(G.UpdateProfileDocument,{key:randomUUID(),id:p.id,expected:1,input:{...input,phone:'0422222222'}},reception)]);
    expect(writes.filter(x=>!x.errors)).toHaveLength(1);expect(writes.filter(x=>x.errors?.[0]?.extensions.code==='CONFLICT')).toHaveLength(1);
    const reopened=createDatabase(container.getConnectionUri());try{expect((await reopened.patient.findUniqueOrThrow({where:{id:p.id}})).version).toBe(2);}finally{await reopened.$disconnect();}
    const bad=await request(G.RegisterPatientDocument,{key:randomUUID(),input:{...patientInput('Future'),birthDate:'2999-01-01'}},reception);expect(bad.errors?.[0]?.extensions.code).toBe('VALIDATION');
  });
  it('makes command retries idempotent and rejects changed key reuse',async()=>{
    const key=randomUUID(),input=patientInput('Idempotent');
    const results=await Promise.all([ok(G.RegisterPatientDocument,{key,input},reception),ok(G.RegisterPatientDocument,{key,input},reception)]);
    expect(results[0]!.registerPatient.id).toBe(results[1]!.registerPatient.id);
    expect(await db.auditEvent.count({where:{correlationId:key,outcome:'SUCCESS'}})).toBe(1);
    const changed=await request(G.RegisterPatientDocument,{key,input:{...input,givenName:'Changed'}},reception);expect(changed.errors?.[0]?.extensions.code).toBe('CONFLICT');
  });
  it('retains draft/finalized/amended notes and rejects other authors',async()=>{
    const p=await newPatient();let e=(await ok(G.StartEncounterDocument,{key:randomUUID(),patientId:p.id,occurredAt:new Date().toISOString()},clinician)).startConsultation;
    e=(await ok(G.SaveClinicalNoteDocument,{key:randomUUID(),id:e.id,expected:0,text:'Original clinical note',finalize:true,reason:''},clinician)).saveNote;
    const invalid=await request(G.SaveClinicalNoteDocument,{key:randomUUID(),id:e.id,expected:1,text:'Silent replacement',finalize:true,reason:''},clinician);expect(invalid.errors?.[0]?.extensions.code).toBe('VALIDATION');
    e=(await ok(G.SaveClinicalNoteDocument,{key:randomUUID(),id:e.id,expected:1,text:'Corrected note',finalize:true,reason:'Synthetic correction'},clinician)).saveNote;
    const revisions=await ok(G.NoteVersionsDocument,{id:e.id},clinician);expect(revisions.noteRevisions.map(x=>x.text)).toEqual(['Corrected note','Original clinical note']);expect(revisions.noteRevisions[0]?.previousVersion).toBe(1);
    const original=await db.user.findUniqueOrThrow({where:{id:providerId}});const another=await db.user.create({data:{username:randomUUID(),name:'Second synthetic clinician',role:'CLINICIAN',passwordHash:original.passwordHash}});
    await expect(composeMvp(db).consultations.saveNote({id:another.id,name:another.name,role:'CLINICIAN'},randomUUID(),e.id,2,'Other author',true,'Reason')).rejects.toMatchObject({code:'FORBIDDEN'});
    const closed=await ok(G.CloseEncounterDocument,{key:randomUUID(),id:e.id,expected:e.version},clinician);expect(closed.closeConsultation.state).toBe('CLOSED');
    const timeline=await ok(G.PatientTimelineDocument,{patientId:p.id,offset:0,limit:20},clinician);expect(timeline.history.items.some(x=>x.summary==='Original clinical note')).toBe(true);
  });
  it('issues and amends both document types, preserving selected printable snapshots',async()=>{
    const p=await newPatient('Print <script>alert(1)</script>');
    const content:G.PrescriptionInput={items:[{medication:'Synthetic medication',strength:'10 mg',dose:'One tablet',route:'Oral',frequency:'Daily',duration:'5 days',quantity:'5',repeats:0}],directions:'Synthetic directions only <script>alert(2)</script>'};
    let d=(await ok(G.NewPrescriptionDocument,{key:randomUUID(),patientId:p.id,content},clinician)).createPrescription;
    const draft=await request(G.PreviewClinicalDocumentDocument,{id:d.id,version:1},clinician);expect(draft.errors?.[0]?.extensions.code).toBe('VALIDATION');
    const issueKey=randomUUID();d=(await ok(G.RevisePrescriptionDocument,{key:issueKey,id:d.id,expected:1,content,issue:true,reason:''},clinician)).revisePrescription;
    const original=(await ok(G.PreviewClinicalDocumentDocument,{id:d.id,version:2},clinician)).previewDocument;expect(original).toContain('DEMO — NOT FOR CLINICAL USE');expect(original).toContain('&lt;script&gt;');expect(original).not.toContain('<script>');
    const changed={...content,directions:'Amended directions'};await ok(G.RevisePrescriptionDocument,{key:randomUUID(),id:d.id,expected:2,content:changed,issue:true,reason:'Correction'},clinician);
    expect((await ok(G.PreviewClinicalDocumentDocument,{id:d.id,version:2},clinician)).previewDocument).toBe(original);
    const certificate:G.CertificateInput={title:'Demo certificate',statement:'Synthetic statement',startsOn:'2026-09-11',endsOn:'2026-09-12'};
    let c=(await ok(G.NewCertificateDocument,{key:randomUUID(),patientId:p.id,content:certificate},clinician)).createCertificate;
    c=(await ok(G.ReviseCertificateDocument,{key:randomUUID(),id:c.id,expected:1,content:certificate,issue:true,reason:''},clinician)).reviseCertificate;
    expect((await ok(G.PreviewClinicalDocumentDocument,{id:c.id,version:2},clinician)).previewDocument).toContain('Synthetic statement');
    const certificateOriginal=(await ok(G.PreviewClinicalDocumentDocument,{id:c.id,version:2},clinician)).previewDocument;
    await ok(G.ReviseCertificateDocument,{key:randomUUID(),id:c.id,expected:2,content:{...certificate,statement:'Amended synthetic statement'},issue:true,reason:'Corrected statement'},clinician);
    expect((await ok(G.PreviewClinicalDocumentDocument,{id:c.id,version:2},clinician)).previewDocument).toBe(certificateOriginal);
    expect((await ok(G.DocumentVersionsDocument,{id:c.id},clinician)).documentRevisions).toHaveLength(3);
    const wrongType=await request(G.ReviseCertificateDocument,{key:randomUUID(),id:d.id,expected:3,content:certificate,issue:true,reason:'Wrong kind'},clinician);expect(wrongType.errors?.[0]?.extensions.code).toBe('VALIDATION');
    const page1=await ok(G.PatientTimelineDocument,{patientId:p.id,offset:0,limit:2},clinician);
    const page2=await ok(G.PatientTimelineDocument,{patientId:p.id,offset:2,limit:2},clinician);
    const all=await ok(G.PatientTimelineDocument,{patientId:p.id,offset:0,limit:100},clinician);
    expect([...page1.history.items,...page2.history.items]).toEqual(all.history.items.slice(0,4));
    expect(new Set(all.history.items.map(x=>x.id)).size).toBe(all.history.total);
    for(const token of [reception,admin])expect((await request(G.PreviewClinicalDocumentDocument,{id:c.id,version:2},token)).errors?.[0]?.extensions.code).toBe('FORBIDDEN');
    const event=await ok(G.PrintEventDocument,{key:randomUUID(),id:d.id,version:2,outcome:'CANCELLED'},clinician);expect(event.recordPrint.version).toBe(2);
    const other=await newPatient();const encounter=(await ok(G.StartEncounterDocument,{key:randomUUID(),patientId:other.id,occurredAt:new Date().toISOString()},clinician)).startConsultation;
    const mismatch=await request(G.NewCertificateDocument,{key:randomUUID(),patientId:p.id,consultationId:encounter.id,content:certificate},clinician);expect(mismatch.errors?.[0]?.extensions.code).toBe('VALIDATION');
  });
  it('books, reschedules, cancels and checks in with concurrent overlap protection and retained history',async()=>{
    const p=await newPatient(),other=await newPatient();
    const base={providerId,startsAt:'2027-01-11T09:00:00Z',endsAt:'2027-01-11T09:30:00Z',timeZone:'UTC'};
    const race=await Promise.all([request(G.BookVisitDocument,{key:randomUUID(),input:{...base,patientId:p.id}},reception),request(G.BookVisitDocument,{key:randomUUID(),input:{...base,patientId:other.id}},reception)]);
    expect(race.filter(x=>!x.errors)).toHaveLength(1);expect(race.filter(x=>x.errors?.[0]?.extensions.code==='CONFLICT')).toHaveLength(1);
    let visit=race.find(x=>!x.errors)!.data!.bookAppointment;
    visit=(await ok(G.RescheduleVisitDocument,{key:randomUUID(),id:visit.id,expected:1,startsAt:'2027-01-11T10:00:00Z',endsAt:'2027-01-11T10:30:00Z',timeZone:'UTC'},reception)).rescheduleAppointment;
    const wrong=await request(G.CheckInVisitDocument,{key:randomUUID(),id:visit.id,expected:2,patientId:randomUUID()},reception);expect(wrong.errors?.[0]?.extensions.code).toBe('VALIDATION');
    visit=(await ok(G.CheckInVisitDocument,{key:randomUUID(),id:visit.id,expected:2,patientId:visit.patientId},reception)).checkIn;
    const again=await ok(G.CheckInVisitDocument,{key:randomUUID(),id:visit.id,expected:2,patientId:visit.patientId},reception);expect(again.checkIn.checkedInAt).toBe(visit.checkedInAt);
    expect((await ok(G.VisitHistoryDocument,{id:visit.id},reception)).appointmentHistory).toHaveLength(3);
    const cancelled=(await ok(G.BookVisitDocument,{key:randomUUID(),input:{...base,patientId:p.id,startsAt:'2027-01-12T09:00:00Z',endsAt:'2027-01-12T09:30:00Z'}},reception)).bookAppointment;
    await ok(G.CancelVisitDocument,{key:randomUUID(),id:cancelled.id,expected:1,reason:'Synthetic cancellation'},reception);
    const noArrival=await request(G.CheckInVisitDocument,{key:randomUUID(),id:cancelled.id,expected:2,patientId:p.id},reception);expect(noArrival.errors?.[0]?.extensions.code).toBe('VALIDATION');
  });
  it('rolls back business writes when audit fails and protects historical rows',async()=>{
    const p=await newPatient();
    await db.$executeRawUnsafe(`CREATE FUNCTION reject_test_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."correlationId" = 'audit-failure-test' THEN RAISE EXCEPTION 'injected audit failure'; END IF; RETURN NEW; END $$`);
    await db.$executeRawUnsafe('CREATE TRIGGER synthetic_audit_failure BEFORE INSERT ON "AuditEvent" FOR EACH ROW EXECUTE FUNCTION reject_test_audit()');
    const failed=await request(G.UpdateProfileDocument,{key:'audit-failure-test',id:p.id,expected:1,input:{...patientInput(p.givenName),phone:'0999999999'}},reception);expect(failed.errors).toBeDefined();
    expect((await db.patient.findUniqueOrThrow({where:{id:p.id}})).version).toBe(1);
    expect(await db.commandReceipt.count({where:{key:'audit-failure-test'}})).toBe(0);
    for(const table of ['AuditEvent','NoteRevision','DocumentRevision','AppointmentChange','CommandReceipt'])await expect(db.$executeRawUnsafe(`UPDATE "${table}" SET "id"="id"`)).rejects.toThrow();
    const events=await db.auditEvent.findMany();expect(JSON.stringify(events)).not.toContain(password);expect(JSON.stringify(events)).not.toContain('Original clinical note');
  });
  it('revokes sessions and rejects expired sessions with generic login failures',async()=>{
    const session=await ok(G.SignInDocument,{username:'reception',password});await ok(G.SignOutDocument,{},session.login.token);
    expect((await request(G.PatientSearchDocument,{query:'',offset:0,limit:20},session.login.token)).errors?.[0]?.extensions.code).toBe('UNAUTHENTICATED');
    const bad=await request(G.SignInDocument,{username:'unknown',password:'incorrect'});expect(bad.errors?.[0]?.message).toBe('Invalid username or password.');
    const user=await db.user.findUniqueOrThrow({where:{username:'reception'}});await db.session.updateMany({where:{userId:user.id},data:{expiresAt:new Date(0)}});
    expect((await request(G.PatientSearchDocument,{query:'',offset:0,limit:20},reception)).errors?.[0]?.extensions.code).toBe('UNAUTHENTICATED');
  });
  it('backs up and restores synthetic records into a separate empty database',async()=>{
    const username=container.getUsername(),databaseName=container.getDatabase();
    const dump=await container.exec(['pg_dump','-U',username,'-d',databaseName,'-Fc','-f','/tmp/ehr-synthetic.dump']);expect(dump.exitCode).toBe(0);
    await db.$executeRawUnsafe('CREATE DATABASE ehr_restore');
    const restored=await container.exec(['pg_restore','-U',username,'-d','ehr_restore','/tmp/ehr-synthetic.dump']);expect(restored.exitCode).toBe(0);
    const target=new URL(container.getConnectionUri());target.pathname='/ehr_restore';const copy=createDatabase(target.toString());
    try{expect(await copy.patient.count()).toBe(await db.patient.count());expect(await copy.documentRevision.count()).toBe(await db.documentRevision.count());expect(await copy.auditEvent.count()).toBe(await db.auditEvent.count());}finally{await copy.$disconnect();}
  });
});
