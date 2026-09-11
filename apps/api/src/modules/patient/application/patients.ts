import { authorize, requireValue, AppError, validDate, type Actor } from '../../../application/context.js';
import type { Persistence, Runtime } from '../../../application/ports.js';
import type { PatientInput } from '../domain/patient.js';
export function patientUseCases(db: Persistence, clock: Runtime) {
  function validate(input: PatientInput) {
    if (!input.givenName.trim() || !input.familyName.trim() || !validDate(input.birthDate) || input.birthDate > clock.now().slice(0,10)) throw new AppError('VALIDATION','Enter names and a valid birth date that is not in the future.');
  }
  return {
    search(actor: Actor | null, query: string, offset: number, limit: number) { const a=authorize(actor,'patient'); return db.read(a,'patient.search','directory',u=>u.patients.search(query,offset,limit)); },
    get(actor: Actor | null,id: string) { const a=authorize(actor,'patient'); return db.read(a,'patient.read',id,async u=>requireValue(await u.patients.get(id))); },
    create(actor: Actor | null,key: string,input: PatientInput) { const a=authorize(actor,'patient'); validate(input); return db.write(a,key,input,'patient.create',u=>u.patients.create(input)); },
    update(actor: Actor | null,key: string,id: string,expected: number,input: PatientInput) { const a=authorize(actor,'patient'); validate(input); return db.write(a,key,{id,expected,input},'patient.update',u=>u.patients.update(id,expected,input)); },
  };
}
