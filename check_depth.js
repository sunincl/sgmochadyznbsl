const fs = require('fs');
const file = 'c:/Users/syy20/Desktop/sgmochadyznbsl/radius-raid-js13k/radius-raid-js13k-master/js/game.js';
const text = fs.readFileSync(file, 'utf8');
const lines = text.split('\n');
let inString = null;
let inComment = null;
let depth = 0;
for (let li = 0; li < lines.length; li++) {
  const line = lines[li];
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    const next = line[i + 1];
    if (inComment) {
      if (inComment === 'line') break;
      if (inComment === 'block' && c === '*' && next === '/') { inComment = null; i++; continue; }
      continue;
    }
    if (inString) {
      if (c === '\\') { i++; continue; }
      if (c === inString) { inString = null; }
      continue;
    }
    if (c === '/' && next === '/') { inComment = 'line'; break; }
    if (c === '/' && next === '*') { inComment = 'block'; i++; continue; }
    if (c === '"' || c === '\'' || c === '`') { inString = c; continue; }
    if (c === '{') depth++;
    if (c === '}') depth--;
  }
  if (li >= 1139 && li <= 1515) {
    if (depth === 0 || depth === 1 || depth === 2 || depth === 3 || depth === 4 || depth % 20 === 0) {
      console.log('line', li + 1, 'depth', depth, lines[li].trim());
    }
  }
}
console.log('final depth', depth);
