const fs = require('fs');
const path = 'c:/Users/syy20/Desktop/sgmochadyznbsl/radius-raid-js13k/radius-raid-js13k-master/js/game.js';
const src = fs.readFileSync(path, 'utf8');
let line = 1, col = 0;
let stack = [];
let inString = null;
let inComment = null;
for (let i = 0; i < src.length; i++) {
  const c = src[i];
  col++;
  if (c === '\n') { line++; col = 0; inComment = null; continue; }
  if (inComment) continue;
  if (inString) {
    if (c === '\\') { i++; col++; continue; }
    if (c === inString) {
      inString = null;
    }
    continue;
  }
  if (c === '"' || c === '\'' || c === '`') { inString = c; continue; }
  if (c === '/' && src[i+1] === '/') { inComment = 'line'; i++; col++; continue; }
  if (c === '/' && src[i+1] === '*') { inComment = 'block'; i++; col++; continue; }
  if (c === '{' || c === '(' || c === '[') stack.push({c, line, col, index: i});
  else if (c === '}' || c === ')' || c === ']') {
    const pair = {')':'(', '}':'{', ']':'['}[c];
    const top = stack.pop();
    if (!top) {
      console.log('unmatched close', c, 'at', line, col);
      process.exit(1);
    }
    if (top.c !== pair) {
      console.log('mismatch', top.c, 'with', c, 'at', line, col, 'top line', top.line, 'top col', top.col);
      process.exit(1);
    }
  }
}
if (inString) { console.log('unclosed string', inString, 'at', line, col); process.exit(1); }
if (stack.length) {
  const top = stack[stack.length-1];
  console.log('unclosed', top.c, 'at', top.line, top.col, 'remaining', stack.length);
  const start = Math.max(0, top.index-100);
  console.log(src.slice(start, start+220));
  process.exit(1);
}
console.log('balanced');
