const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
try { process.loadEnvFile(path.join(root, '.env')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const port = Number(process.env.PORT) || 3000;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const publicFiles = new Set(fs.readdirSync(root).filter(name => /\.(html|css|js)$/.test(name) && name !== 'server.js'));
function createServer() { return http.createServer((request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); return response.end('Endereço inválido.'); }
  if (pathname === '/cloud-config.json') {
    response.writeHead(200, {'Content-Type': 'application/json'});
    return response.end(JSON.stringify({url: process.env.SUPABASE_URL || '', publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || ''}));
  }
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, requested);

  if ((!file.startsWith(root + path.sep)) || (!publicFiles.has(requested) && !/^assets\/[a-zA-Z0-9_.-]+\.(png|svg|webp|jpg|jpeg|js|css)$/.test(requested))) {
    response.writeHead(403);
    return response.end('Acesso negado.');
  }

  fs.readFile(file, (error, content) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return response.end('Arquivo não encontrado.');
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    response.end(content);
  });
}); }
module.exports = { createServer };
if (require.main === module) createServer().listen(port, '127.0.0.1', () => {
  console.log(`Estética Pro IA disponível em http://localhost:${port}`);
});
