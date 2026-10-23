import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { sign } from './sign.mjs';

// Preview passes --host and --port; a deployment sets HOST and PORT instead.
let host = process.env.HOST || '127.0.0.1';
let port = Number(process.env.PORT || 8080);
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 2) {
  if (args[i] === '--host' && args[i + 1]) host = args[i + 1];
  else if (args[i] === '--port' && /^\d+$/u.test(args[i + 1] || '')) port = Number(args[i + 1]);
  else throw new Error('Use --host <address> --port <number>.');
}
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid port.');

const escape = (text) => String(text).replace(/[&<>"']/gu, (character) => `&#${character.charCodeAt(0)};`);
const page = (await readFile(new URL('./public/index.html', import.meta.url), 'utf8'))
  .replaceAll('{{title}}', escape(sign.title))
  .replaceAll('{{message}}', escape(sign.message));
const headers = { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };

const server = createServer((request, response) => {
  const url = new URL(request.url, 'http://exercise.local');
  if (request.method === 'GET' && url.pathname === '/api/health') {
    response.writeHead(200, { ...headers, 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ status: 'ready' }));
    return;
  }
  if (request.method === 'GET' && url.pathname === '/') {
    // Vibe64's Preview injects one inline bridge script into HTML, so script-src allows inline scripts.
    response.writeHead(200, { ...headers, 'content-type': 'text/html; charset=utf-8',
      'content-security-policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; frame-ancestors *; base-uri 'none'; form-action 'none'" });
    response.end(page);
    return;
  }
  response.writeHead(404, { ...headers, 'content-type': 'text/plain; charset=utf-8' });
  response.end('Not found.');
});
server.requestTimeout = 5000; server.headersTimeout = 5000;
server.listen(port, host, () => console.log(`Sign app listening on ${host}:${server.address().port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { server.close(); server.closeAllConnections(); });
