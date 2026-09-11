import { AppError, type Actor } from '../../../application/context.js';
export interface Credentials { id: string; name: string; role: Actor['role']; passwordHash: string }
export interface IdentityPorts {
  account(username:string): Promise<Credentials|null>;
  verify(password:string,hash:string): Promise<boolean>;
  openSession(actor:Actor): Promise<string>;
  resolve(token:string): Promise<Actor|null>;
  revoke(token:string): Promise<void>;
  failed(): Promise<void>;
}
export function identityUseCases(ports: IdentityPorts) {
  return {
    async login(username:string,password:string) {
      const account=await ports.account(username.trim().toLowerCase());
      // A fixed synthetic hash is used by the adapter for absent accounts to avoid fast rejection.
      const valid=await ports.verify(password,account?.passwordHash??'');
      if(!account || !valid){await ports.failed();throw new AppError('UNAUTHENTICATED','Invalid username or password.');}
      const actor:Actor={id:account.id,name:account.name,role:account.role};
      return {token:await ports.openSession(actor),actor};
    },
    resolve(token:string){return ports.resolve(token);},
    logout(token:string){return ports.revoke(token);},
  };
}
