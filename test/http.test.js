import test from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../src/http/server.js';

let baseUrl;

test.before(async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('POST /api/analyze devuelve el contrato tradicional', async () => {
  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'No puedo iniciar sesión', mode: 'traditional' })
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(Object.keys(body).sort(), ['category', 'mode', 'priority', 'requiresHumanReview', 'response'].sort());
  assert.equal(body.category, 'ACCESS');
});

test('POST /api/analyze rechaza una petición inválida', async () => {
  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'ok', mode: 'unknown' })
  });
  assert.equal(response.status, 400);
});
