import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../../mvp/client';
import type { OnboardingGateway } from './contracts';
export function onboardingGateway(request: Api): OnboardingGateway {
  return {
    register: (input) => request(G.RegisterAccountDocument, { input }),
    verify: (token) => request(G.VerifyAccountDocument, { token }),
    resend: (email) => request(G.ResendVerificationDocument, { email }),
    requestReset: (email) => request(G.RequestPasswordResetDocument, { email }),
    reset: (input) => request(G.ResetAccountPasswordDocument, input),
    accept: (input) => request(G.AcceptPracticeInvitationDocument, input),
  };
}
