const fs = require('node:fs');
const path = require('node:path');
require('./build-cloud.js');
const target = path.resolve('dist');
fs.mkdirSync(target, {recursive: true});
for (const file of fs.readdirSync('.')) {
  if (/\.(html|css|js)$/.test(file) && file !== 'server.js') fs.copyFileSync(file,path.join(target,file));
}
fs.cpSync('assets',path.join(target,'assets'),{recursive:true});
fs.writeFileSync(path.join(target,'cloud-config.json'),JSON.stringify({url:process.env.SUPABASE_URL || '',publishableKey:process.env.SUPABASE_PUBLISHABLE_KEY || ''}));
fs.writeFileSync(path.join(target,'.nojekyll'),'');
