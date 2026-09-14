import type { Mode } from './contracts';
export function readOnboardingLink() {
  const values = new URLSearchParams(window.location.hash.slice(1));
  return {
    mode: (values.has('verify')
      ? 'Verify email'
      : values.has('reset')
        ? 'Recover password'
        : values.has('invite')
          ? 'Accept invitation'
          : 'Register') as Mode,
    token:
      values.get('verify') ?? values.get('reset') ?? values.get('invite') ?? '',
  };
}
export const onboardingBrowser = {
  read: readOnboardingLink,
  consume() {
    history.replaceState(null, '', location.pathname + location.search);
  },
  subscribe(listener: () => void) {
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  },
  reveal() {
    window.requestAnimationFrame(() =>
      document
        .getElementById('account-onboarding-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  },
};
