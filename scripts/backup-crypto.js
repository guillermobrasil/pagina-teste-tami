const crypto = require('node:crypto');
const magic = Buffer.from('TAMI-BACKUP-1\n');
function encrypt(input, password) {
  if (!password || password.length < 20) throw new Error('Use uma senha de backup com pelo menos 20 caracteres.');
  const salt = crypto.randomBytes(16), nonce = crypto.randomBytes(12);
  const key = crypto.scryptSync(password, salt, 32, {N:32768,r:8,p:1,maxmem:64*1024*1024});
  const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
  cipher.setAAD(magic);
  const encrypted = Buffer.concat([cipher.update(input),cipher.final()]);
  return Buffer.concat([magic,salt,nonce,cipher.getAuthTag(),encrypted]);
}
function decrypt(input, password) {
  if (input.length < magic.length + 44 || !input.subarray(0,magic.length).equals(magic)) throw new Error('Formato inválido.');
  const offset = magic.length;
  const key = crypto.scryptSync(password,input.subarray(offset,offset+16),32,{N:32768,r:8,p:1,maxmem:64*1024*1024});
  const decipher = crypto.createDecipheriv('aes-256-gcm',key,input.subarray(offset+16,offset+28));
  decipher.setAAD(magic); decipher.setAuthTag(input.subarray(offset+28,offset+44));
  return Buffer.concat([decipher.update(input.subarray(offset+44)),decipher.final()]);
}
module.exports = {encrypt,decrypt};
if (require.main === module) {
  const chunks = [];
  process.stdin.on('data',chunk=>chunks.push(chunk));
  process.stdin.on('end',()=>{
    try {
      const action = process.argv[2];
      if (!['encrypt','decrypt'].includes(action)) throw new Error('Informe encrypt ou decrypt.');
      process.stdout.write(module.exports[action](Buffer.concat(chunks),process.env.BACKUP_PASSWORD));
    } catch { process.stderr.write('Falha na criptografia: confira formato, integridade e senha do backup.\n'); process.exitCode = 1; }
  });
}
