import express from 'express';
import { request as httpRequest, type IncomingHttpHeaders } from 'node:http';
import { resolve } from 'node:path';

export function packagedWeb(assets: string, upstream: string) {
  const target = new URL(upstream);
  if (target.protocol !== 'http:' || target.username || target.password || target.pathname !== '/' || target.search || target.hash)
    throw new Error('Use an internal HTTP API origin without credentials or a path.');
  const app = express();
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('X-Frame-Options','SAMEORIGIN');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; frame-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'");
    next();
  });
  for (const path of ['/mvp/graphql','/graphql','/health/ready']) app.all(path, (req, res) => {
    const headers: IncomingHttpHeaders = {...req.headers, host:target.host};
    for (const key of ['accept-encoding','connection','proxy-authorization','proxy-connection','transfer-encoding','upgrade','forwarded','x-forwarded-for','x-forwarded-host','x-forwarded-proto']) delete headers[key];
    const proxy = httpRequest(new URL(req.originalUrl, target), {method:req.method, headers, timeout:25000}, upstreamResponse => {
      res.statusCode = upstreamResponse.statusCode ?? 502;
      const contentType = upstreamResponse.headers['content-type'];
      if (contentType) res.setHeader('Content-Type',contentType);
      upstreamResponse.pipe(res);
    });
    proxy.on('timeout', () => proxy.destroy(new Error('Upstream timeout')));
    proxy.on('error', () => { if (!res.headersSent) res.status(502).json({error:'API unavailable. Please retry.'}); else res.destroy(); });
    req.on('aborted', () => proxy.destroy());
    res.on('close', () => { if (!res.writableEnded) proxy.destroy(); });
    req.pipe(proxy);
  });
  app.get('/health/live', (_req,res) => res.json({status:'alive'}));
  app.use('/assets', express.static(resolve(assets,'assets'), {
    fallthrough:false,
    setHeaders(res, path) {
      if (/[-.][A-Za-z0-9_-]{8,}\.(js|css|woff2|png|svg)$/.test(path)) res.setHeader('Cache-Control','public, max-age=31536000, immutable');
    },
  }));
  for (const path of ['/','/clinic']) app.get(path, (_req,res) => res.sendFile(resolve(assets,'index.html'), {cacheControl:false}));
  return app;
}
