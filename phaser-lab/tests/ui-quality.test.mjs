import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../ui-theme.css',import.meta.url),'utf8');
const get=name=>{
 const m=css.match(new RegExp('--'+name+':(#[0-9a-fA-F]{6})'));
 assert.ok(m,'Token CSS obrigatório não encontrado: '+name);
 return m[1];
};
function rgb(hex){
 const s=hex.slice(1);
 return [0,2,4].map(i=>parseInt(s.slice(i,i+2),16)/255)
  .map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
}
const luminance=hex=>{
 const [r,g,b]=rgb(hex);return .2126*r+.7152*g+.0722*b;
};
function contrast(foreground,background){
 const values=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);
 return (values[0]+.05)/(values[1]+.05);
}
test('M1g-F contraste das cores canônicas de informação ≥ 4.5:1 nos painéis',()=>{
 for(const fg of ['ui-ivory','ui-muted','ui-gold','ui-gold-bright','ui-green','ui-blue','ui-red']){
  for(const bg of ['ui-night','ui-deep','ui-panel']){
   const value=contrast(get(fg),get(bg));
   assert.ok(value>=4.5,fg+' em '+bg+': contraste '+value.toFixed(2)+' menor que 4.5:1');
  }
 }
 assert.ok(contrast(get('ui-focus'),get('ui-panel'))>=3);
});
test('M1g-F barra de experiência tem gradiente CSS válido, sem parêntese extra',()=>{
 assert.match(css,/\.ui-gauge--xp\s*>\s*i\s*\{[^}]*linear-gradient\(90deg,#896336,#edbe76\)/);
 assert.doesNotMatch(css,/linear-gradient\(90deg,#896336,#edbe76\)\)/);
});
