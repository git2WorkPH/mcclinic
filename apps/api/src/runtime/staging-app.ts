import express from 'express';
import { timingSafeEqual } from 'node:crypto';
import { createApp } from '../app.js';
import { installMvpGraphql } from '../adapters/mvp-graphql.js';
import type { Database } from '../infrastructure/prisma/database.js';
import { outboxDelivery } from '../modules/onboarding/infrastructure/outbox.js';

export function stagingApp(
  database: Database,
  config: { origin: string; originSecret: string; domains: readonly string[] },
  draining: () => boolean,
) {
  const app = express();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    if (draining()) {
      res.status(503).json({ status: 'draining' });
      return;
    }
    // Only ALB health checks bypass the origin credential; the task has no public ingress.
    if (
      req.method === 'GET' &&
      ['/health/live', '/health/ready'].includes(req.path)
    ) {
      next();
      return;
    }
    const supplied = Buffer.from(req.get('x-mcclinic-origin') ?? '');
    const expected = Buffer.from(config.originSecret);
    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      res.status(403).json({ error: 'Staging origin access denied.' });
      return;
    }
    next();
  });
  app.get('/health/ready', async (_req, res) => {
    try {
      await database.$queryRaw`SELECT 1`;
      res.json({ status: 'ready' });
    } catch {
      res.status(503).json({ status: 'unavailable' });
    }
  });
  app.use(createApp());
  installMvpGraphql(app, database, outboxDelivery(config.domains), undefined, {
    cookieOrigin: config.origin,
  });
  return app;
}
