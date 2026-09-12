import {it,expect} from 'vitest';
import {base32,totp,matchedStep} from '../apps/api/src/modules/onboarding/infrastructure/crypto';
it('matches RFC 6238 SHA-1 vectors and enforces six-digit window/replay checks',()=>{const secret=base32(Buffer.from('12345678901234567890'));expect(totp(secret,1,8)).toBe('94287082');expect(totp(secret,37037036,8)).toBe('07081804');expect(matchedStep(secret,'287082',-1,59000)).toBe(1);expect(matchedStep(secret,'287082',1,59000)).toBeNull();expect(matchedStep(secret,'287082',-1,180000)).toBeNull();expect(matchedStep(secret,'invalid',-1,59000)).toBeNull();});
