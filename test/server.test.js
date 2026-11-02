const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createServer} = require('../server');
test('servidor entrega site e bloqueia configuração privada, banco, código de teste e git', async t => {
  const server = createServer(); await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>{server.closeAllConnections();server.close(resolve);}));
  const origin = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(origin)).status,200);
  for (const file of ['/.env','/.git/config','/database/setup.sql','/test/identity.test.js','/src/cloud-store.js','/server.js','/package-lock.json']) assert.equal((await fetch(origin+file)).status,403,file);
  const config = await (await fetch(origin+'/cloud-config.json')).json();
  assert.deepEqual(Object.keys(config).sort(),['publishableKey','url']);
  assert.equal((await fetch(origin+'/%E0%A4%A')).status,400);
});
