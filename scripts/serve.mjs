import http from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const contained = target => { const relative = path.relative(root, target); return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative)); };
const server = http.createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end('Method not allowed'); return; }
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const candidate = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!contained(candidate)) { response.writeHead(403); response.end('Forbidden'); return; }
    const target = await realpath(candidate);
    if (!contained(target)) { response.writeHead(403); response.end('Forbidden'); return; }
    const data = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : ['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code) ? 404 : 500);
    response.end('Unable to serve requested file');
  }
});
server.on('error', error => { console.error(`Preview failed: ${error.code === 'EADDRINUSE' ? '127.0.0.1:4173 is already in use. Stop its owner or retry later.' : error.message}`); process.exitCode = 1; });
server.listen(4173, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:4173\nRoot: ${root}\nStop: Ctrl+C`));
