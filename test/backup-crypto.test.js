const {test} = require('node:test');
const assert = require('node:assert/strict');
const {encrypt,decrypt} = require('../scripts/backup-crypto');
test('backup criptografado recupera o original e rejeita senha incorreta e adulteração', () => {
  const password = 'senha-sintetica-de-teste-para-backup';
  const source = Buffer.from('Conteúdo sintético para teste de restauração');
  const encoded = encrypt(source,password);
  assert.ok(!encoded.includes(source)); assert.deepEqual(decrypt(encoded,password),source);
  assert.throws(()=>decrypt(encoded,'outra-senha-de-teste-incorreta'));
  encoded[encoded.length-1] ^= 1;
  assert.throws(()=>decrypt(encoded,password));
});
