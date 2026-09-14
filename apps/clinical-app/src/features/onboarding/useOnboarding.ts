import { useEffect, useState } from 'react';
import { useAction } from '../../mvp/ui';
import type { Mode, OnboardingGateway, OnboardingBrowser } from './contracts';
export function useOnboarding(
  gateway: OnboardingGateway,
  browser: OnboardingBrowser,
) {
  const [initial] = useState(() => browser.read());
  const [open, setOpen] = useState(Boolean(initial.token)),
    [mode, setMode] = useState<Mode>(initial.mode),
    [email, setEmail] = useState(''),
    [name, setName] = useState(''),
    [password, setPassword] = useState(''),
    [practiceName, setPracticeName] = useState(''),
    [token, setToken] = useState(initial.token),
    [code, setCode] = useState(''),
    [message, setMessage] = useState('');
  const action = useAction();
  const togglePanel = () => {
    const opening = !open;
    setOpen(opening);
    if (opening) browser.reveal();
  };
  useEffect(() => {
    const consumeLink = () => {
      const value = browser.read();
      if (!value.token) return;
      setMode(value.mode);
      setToken(value.token);
      setOpen(true);
      setMessage('');
      browser.consume();
    };
    consumeLink();
    return browser.subscribe(consumeLink);
  }, [browser]);
  const run = (fn: () => Promise<unknown>, success: string) => {
    setMessage('');
    void action.run(async () => {
      await fn();
      setMessage(success);
    });
  };
  const actions = {
    register: () =>
      run(
        () => gateway.register({ email, name, password, practiceName }),
        'If eligible, a verification link is in the local mailbox. Verify before signing in.',
      ),
    verify: () =>
      run(
        () => gateway.verify(token),
        'Email verified. Sign in above, or accept your invitation if joining a practice.',
      ),
    resend: () =>
      run(
        () => gateway.resend(email),
        'If eligible, a verification link is in the local mailbox.',
      ),
    requestReset: () =>
      run(
        () => gateway.requestReset(email),
        'If eligible, a reset link is in the local mailbox.',
      ),
    reset: () =>
      run(
        () => gateway.reset({ token, password, code }),
        'Password changed and sessions revoked. Sign in again.',
      ),
    accept: () =>
      run(
        () => gateway.accept({ token, password, code }),
        'Invitation accepted. Sign in, then switch to the practice.',
      ),
  };
  return {
    open,
    mode,
    setMode,
    email,
    setEmail,
    name,
    setName,
    password,
    setPassword,
    practiceName,
    setPracticeName,
    token,
    setToken,
    code,
    setCode,
    message,
    setMessage,
    action,
    togglePanel,
    actions,
  };
}
