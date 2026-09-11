import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApp } from '../apps/api/src/app';
import { readConfig } from '../apps/api/src/config';
let server: Server;
let url: string;
beforeAll(async () => {
  server = await new Promise<Server>((resolve) => { const s = createApp().listen(0, '127.0.0.1', () => resolve(s)); });
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
describe('public non-clinical API', () => {
  it('serves the generated status contract through Express/Yoga', async () => {
    const response = await fetch(`${url}/graphql`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: '{ systemStatus { service status } }' }) });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: { systemStatus: { service: 'clinic-ehr', status: 'available' } } });
  });
  it('rejects fields outside the schema without exposing clinical data', async () => {
    const response = await fetch(`${url}/graphql`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: '{ patients { id } }' }) });
    const body = await response.json();
    expect(body.errors).toHaveLength(1); expect(body.data).toBeUndefined();
  });
  it('rejects malformed request JSON', async () => {
    const response = await fetch(`${url}/graphql`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    expect(response.status).toBe(400);
  });
  it('reports liveness without claiming database readiness', async () => {
    const response = await fetch(`${url}/health/live`);
    expect(await response.json()).toEqual({ status: 'alive' });
  });
});
it('validates startup configuration without leaking input values', () => {
  expect(readConfig({}).PORT).toBe(4000);
  for (const PORT of ['0', '65536', 'not-a-port']) expect(() => readConfig({ PORT })).toThrow('Invalid server configuration');
});
