import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';

// Start the sign app as Preview does (--host/--port) and as a deployment does
// (HOST/PORT), then read its page and health route.
const server = new URL('../training/exercises/sign-app/server.mjs', import.meta.url).pathname;

async function freePort() {
  const probe = createServer().listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const { port } = probe.address();
  probe.close();
  await once(probe, 'close');
  return port;
}

async function withApp({ args = [], env = {} }, run) {
  const child = spawn(process.execPath, [server, ...args], { env: { ...process.env, HOST: '', PORT: '', ...env }, stdio: ['ignore', 'pipe', 'inherit'] });
  try {
    const [line] = await once(child.stdout, 'data');
    assert.match(String(line), /Sign app listening on 127\.0\.0\.1:\d+/u);
    await run();
  } finally {
    child.kill('SIGTERM');
    await once(child, 'exit');
  }
}

async function check(port) {
  const health = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ready' });
  const page = await (await fetch(`http://127.0.0.1:${port}/`)).text();
  assert.match(page, /<h1>Open today<\/h1>/u);
  assert.match(page, /Come in, we are open from 9 to 5\./u);
  assert.equal((await fetch(`http://127.0.0.1:${port}/missing`)).status, 404);
}

const previewPort = await freePort();
await withApp({ args: ['--host', '127.0.0.1', '--port', String(previewPort)] }, () => check(previewPort));
const deployedPort = await freePort();
await withApp({ env: { HOST: '127.0.0.1', PORT: String(deployedPort) } }, () => check(deployedPort));
console.log('sign app: Preview and deployment starts pass');
