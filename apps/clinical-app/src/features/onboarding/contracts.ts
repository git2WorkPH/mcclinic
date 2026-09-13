export type Mode =
  | "Register"
  | "Verify email"
  | "Recover password"
  | "Accept invitation";
export interface Registration { email: string; name: string; password: string; practiceName: string }
export interface Credentials { token: string; password: string; code: string }
export interface OnboardingGateway {
  register(input: Registration): Promise<unknown>;
  verify(token: string): Promise<unknown>;
  resend(email: string): Promise<unknown>;
  requestReset(email: string): Promise<unknown>;
  reset(input: Credentials): Promise<unknown>;
  accept(input: Credentials): Promise<unknown>;
}
export interface OnboardingBrowser {
  read(): { mode: Mode; token: string };
  consume(): void;
  subscribe(listener: () => void): () => void;
  reveal(): void;
}
