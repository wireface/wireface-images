import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.css': 'text/css', '.jpg': 'image/jpeg', '.json': 'application/json' };
const port = Number(process.env.PORT || 5173);
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') { res.writeHead(302, { Location: '/examples/images/' }); return res.end(); }
    let path = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!path.startsWith(resolve(root) + sep) || path.split(sep).some(part => part.startsWith('.'))) { res.writeHead(403); return res.end(); }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }); res.end(await readFile(path));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Wireface Images: http://127.0.0.1:${port}/`));
