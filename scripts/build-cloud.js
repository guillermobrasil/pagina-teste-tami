const esbuild = require('esbuild');
esbuild.buildSync({absWorkingDir: require('path').resolve(__dirname, '..'), tsconfigRaw: {}, entryPoints: ['./src/cloud-store.js'], outfile: 'assets/cloud-store.js', bundle: true, minify: true, platform: 'browser', target: ['es2020'], legalComments: 'eof'});
