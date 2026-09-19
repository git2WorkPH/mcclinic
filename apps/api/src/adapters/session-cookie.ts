import type { RequestHandler } from 'express';
import type { ServerResponse } from 'node:http';
export const cookieSessionMarker = 'cookie-session';
const name = '__Host-mcclinic-session';
export function sessionCookiePolicy(origin: string) {
  const parsed = new URL(origin);
  if (
    parsed.protocol !== 'https:' ||
    parsed.origin !== origin ||
    parsed.username ||
    parsed.password
  )
    throw new Error('Cookie sessions require an exact HTTPS origin.');
  const guard: RequestHandler = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    if (
      req.method !== 'POST' ||
      req.headers.origin !== origin ||
      !/^application\/json(?:;|$)/i.test(req.headers['content-type'] ?? '')
    ) {
      res
        .status(403)
        .json({ errors: [{ message: 'Same-origin JSON POST required.' }] });
      return;
    }
    next();
  };
  return {
    guard,
    token(header: string | null) {
      const matches = (header ?? '')
        .split(';')
        .map((v) => v.trim())
        .filter((v) => v.startsWith(name + '='));
      if (matches.length !== 1) return '';
      const value = matches[0]!.slice(name.length + 1);
      return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : '';
    },
    set(res: ServerResponse, token: string) {
      if (token && !/^[A-Za-z0-9_-]{43}$/.test(token))
        throw new Error('Invalid session token.');
      res.setHeader(
        'Set-Cookie',
        `${name}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${token ? 28800 : 0}`,
      );
    },
  };
}
