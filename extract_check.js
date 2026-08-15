const fs = require('fs');
const path = require('path');
const inFile = path.resolve('radius-raid-js13k/radius-raid-js13k-master/index.html');
const tmp = path.resolve('radius-raid-js13k/radius-raid-js13k-master/tmp_extracted.js');
const html = fs.readFileSync(inFile, 'utf8');
const regex = /<script(?:\s+[^>]*?)?>([\s\S]*?)<\/script>/gi;
let code = '';
let idx = 0;
let m;
while ((m = regex.exec(html)) !== null) {
  const tag = m[0];
  if (/src\s*=/.test(tag)) continue;
  idx++;
  code += `// SCRIPT BLOCK ${idx}\n` + m[1] + '\n';
}
fs.writeFileSync(tmp, code, 'utf8');
console.log('WROTE', tmp);
try{
  const { execFileSync } = require('child_process');
  execFileSync('node', ['--check', tmp], { stdio: 'inherit' });
  console.log('SYNTAX OK');
}catch(e){
  console.error('SYNTAX ERROR:');
  if(e.stdout) console.error(e.stdout.toString());
  if(e.stderr) console.error(e.stderr.toString());
  process.exitCode = 2;
}
