const fs = require('fs');
const p = 'c:/Users/syy20/Desktop/sgmochadyznbsl/radius-raid-js13k/radius-raid-js13k-master/js/game.js';
const s = fs.readFileSync(p,'utf8');
let stack = [];
let inQ = null;
for(let i=0;i<s.length;i++){
  const c = s[i];
  if(inQ){
    if(c==='\\') { i++; continue; }
    if(c===inQ){ inQ=null; continue; }
    continue;
  }
  if(c==='\''||c==='"'||c==='`'){ inQ=c; continue; }
  if(c==='('||c==='{'||c==='[') stack.push({c,i});
  if(c===')'||c==='}'||c===']'){
    if(stack.length===0){ console.log('Unmatched closing',c,'at',i); console.log(s.slice(Math.max(0,i-60),i+60)); process.exit(0); }
    const top=stack.pop();
    if((top.c==='('&&c!==')')||(top.c==='{'&&c!=='}')||(top.c==='['&&c!==']')){
      console.log('Mismatched',top.c,'with',c,'at',i); console.log(s.slice(Math.max(0,i-60),i+60)); process.exit(0);
    }
  }
}
if(inQ){ console.log('Unclosed quote',inQ,'at',s.length-1); console.log(s.slice(-200)); process.exit(0); }
if(stack.length){ const top=stack[stack.length-1]; console.log('Unclosed stack top',top.c,'at',top.i,'remaining',stack.length); console.log(s.slice(Math.max(0,top.i-60),top.i+200)); process.exit(0);} 
console.log('All balanced');
