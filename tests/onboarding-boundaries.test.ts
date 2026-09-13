import { afterEach, describe, expect, it, vi } from 'vitest';
import * as G from '../packages/graphql-contract/src/operations.generated';
import { onboardingGateway } from '../apps/clinical-app/src/features/onboarding/gateway';
import { onboardingBrowser } from '../apps/clinical-app/src/features/onboarding/browser';
import type { Api } from '../apps/clinical-app/src/mvp/client';

afterEach(() => vi.unstubAllGlobals());
describe('onboarding feature adapters', () => {
  it('maps every public account action without dropping credentials or practice intent', async () => {
    const request = vi.fn().mockResolvedValue({});
    const gateway = onboardingGateway(request as Api);
    const registration = {email:'synthetic@example.test',name:'Synthetic Doctor',password:'synthetic-password',practiceName:'Synthetic Clinic'};
    const credentials = {token:'synthetic-token',password:'synthetic-password',code:'123456'};
    await gateway.register(registration);
    await gateway.verify(credentials.token);
    await gateway.resend(registration.email);
    await gateway.requestReset(registration.email);
    await gateway.reset(credentials);
    await gateway.accept(credentials);
    expect(request.mock.calls).toEqual([
      [G.RegisterAccountDocument,{input:registration}],
      [G.VerifyAccountDocument,{token:credentials.token}],
      [G.ResendVerificationDocument,{email:registration.email}],
      [G.RequestPasswordResetDocument,{email:registration.email}],
      [G.ResetAccountPasswordDocument,credentials],
      [G.AcceptPracticeInvitationDocument,credentials],
    ]);
  });
  it('propagates failures without retrying account mutations', async () => {
    const failure = new Error('Connection unavailable');
    const request = vi.fn().mockRejectedValue(failure);
    await expect(onboardingGateway(request as Api).verify('token')).rejects.toBe(failure);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it.each([
    ['','Register',''], ['#verify=a%2Bb','Verify email','a+b'],
    ['#reset=reset-token','Recover password','reset-token'],
    ['#invite=invite-token','Accept invitation','invite-token'],
    ['#verify=v&reset=r&invite=i','Verify email','v'],
  ])('reads fragment %s with the existing precedence', (hash,mode,token) => {
    vi.stubGlobal('window',{location:{hash}});
    expect(onboardingBrowser.read()).toEqual({mode,token});
  });
  it('consumes secrets without changing path/query and removes its link listener', () => {
    const replaceState = vi.fn(), addEventListener = vi.fn(), removeEventListener = vi.fn();
    vi.stubGlobal('history',{replaceState});
    vi.stubGlobal('location',{pathname:'/clinic',search:'?view=account'});
    vi.stubGlobal('window',{addEventListener,removeEventListener});
    onboardingBrowser.consume();
    expect(replaceState).toHaveBeenCalledWith(null,'','/clinic?view=account');
    const listener = vi.fn();
    const dispose = onboardingBrowser.subscribe(listener);
    expect(addEventListener).toHaveBeenCalledWith('hashchange',listener);
    dispose();
    expect(removeEventListener).toHaveBeenCalledWith('hashchange',listener);
  });
});
