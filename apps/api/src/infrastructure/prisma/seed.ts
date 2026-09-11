import { createDatabase } from './database.js';
import { hashPassword } from '../../modules/identity/infrastructure/local-identity.js';
export async function seedDemo(url:string,password:string) {
  if(password.length<12)throw new Error('DEMO_PASSWORD must contain at least 12 characters.');
  const db=createDatabase(url);
  try {
    for(const [username,name,role] of [['clinician','Dr Demo Clinician','CLINICIAN'],['reception','Demo Reception','RECEPTION'],['admin','Demo Administrator','ADMINISTRATOR']]) {
      if(!username||!name||!role)throw new Error('Invalid fixture');
      if(!await db.user.findUnique({where:{username}}))await db.user.create({data:{username,name,role,passwordHash:await hashPassword(password)}});
    }
  }finally{await db.$disconnect();}
}
