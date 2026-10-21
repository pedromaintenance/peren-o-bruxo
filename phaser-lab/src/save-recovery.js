/**
 * M1h-F experimental Pages build: opt-in recovery of an unreadable preview save.
 * Classic and stable Phaser storage keys must never be accessed here.
 */
const MAX_IMPORT_BYTES=2_000_000;
const short=value=>String(value??'').replace(/[\r\n\t]+/g,' ').slice(0,240);
export function recoverPreviewSave({storage,key,expectedRaw,action,backupText,confirmed,downloaded,validate}){
 if(!key||!key.startsWith('peren_phaser_save_m1hf_preview_'))
  throw Error('Chave de prévia não reconhecida; recuperação bloqueada.');
 if(!downloaded)throw Error('Baixe antes uma cópia do save danificado.');
 if(!confirmed)throw Error('Recuperação cancelada sem modificar dados.');
 if(storage.getItem(key)!==expectedRaw)throw Error('O save mudou em outra aba. Recarregue antes de continuar.');
 if(action==='restore'){
  if(typeof backupText!=='string'||new TextEncoder().encode(backupText).length>MAX_IMPORT_BYTES)
   throw Error('Backup inválido ou maior que 2 MB.');
  const valid=validate(backupText);
  valid.revision+=1;
  storage.setItem(key,JSON.stringify(valid));
  return {action:'restore',revision:valid.revision};
 }
 if(action==='reset'){
  storage.removeItem(key);
  return {action:'reset'};
 }
 throw Error('Operação desconhecida.');
}
export function showPreviewSaveRecovery({document,storage,key,catalogs,error,validate,reload=()=>location.reload(),confirmAction=message=>window.confirm(message)}){
 let original;
 try{original=storage.getItem(key)}catch{original=null}
 let downloaded=false;
 const style=document.createElement('style');
 style.textContent=[
 '#m1hfRecovery{position:fixed;inset:0;z-index:30000;display:grid;place-items:center;overflow:auto;padding:clamp(12px,4vw,32px);background:#081319f5;color:#ebddc6;font:15px/1.55 system-ui,sans-serif}',
 '#m1hfRecoveryCard{width:min(650px,100%);max-height:calc(100dvh - 24px);overflow:auto;padding:clamp(18px,5vw,32px);background:linear-gradient(145deg,#1d3036,#0d1b23);border:2px solid #ba9762;border-radius:13px;box-shadow:0 22px 65px #000b}',
 '#m1hfRecovery h1{font:clamp(25px,5vw,36px) Georgia,serif;color:#efd098;margin:0 0 12px}',
 '#m1hfRecovery p{color:#d6d2c4}',
 '#m1hfRecovery button,#m1hfRecovery input[type=file]{min-height:46px;max-width:100%;font:inherit;border:1px solid #d0b17a;border-radius:7px;background:#243c46;color:#f6e2bf;padding:9px 13px}',
 '#m1hfRecovery button{cursor:pointer;font-weight:700}',
 '#m1hfRecovery button:disabled{opacity:.5;cursor:not-allowed}',
 '#m1hfRecovery label{display:block;margin:16px 0 10px}',
 '#m1hfRecovery input[type=file]{display:block;width:100%;margin:8px 0}',
 '#m1hfRecoveryStatus{min-height:44px;background:#132b33;border:1px solid #61756c;padding:9px;color:#e4d3b0;overflow-wrap:anywhere}',
 '#m1hfRecoveryNotice{font-size:12px;color:#b9c7c3}',
 '#m1hfRecoveryError{overflow-wrap:anywhere;color:#f7c99c;font-size:13px}',
 '#m1hfRecovery button:focus-visible,#m1hfRecovery input:focus-visible{outline:3px solid #ffe39f}'
 ].join('\n');
 const section=document.createElement('section');
 section.id='m1hfRecovery';section.setAttribute('role','alertdialog');
 section.setAttribute('aria-modal','true');section.setAttribute('aria-labelledby','m1hfRecoveryTitle');
 section.innerHTML=[
 '<div id="m1hfRecoveryCard">',
 '<small>PEREN · CARCAÇA · PRÉVIA M1h-F</small>',
 '<h1 id="m1hfRecoveryTitle">Recuperar progresso experimental</h1>',
 '<p>Não foi possível abrir o save desta prévia. O jogo foi interrompido <strong>antes de modificar qualquer dado</strong>. O progresso clássico e a demo Phaser anterior estão separados.</p>',
 '<p id="m1hfRecoveryError"></p>',
 '<p><strong>1. Preserve o arquivo atual.</strong> Mesmo danificado, ele pode ajudar na recuperação.</p>',
 '<button id="m1hfRecoveryDownload" type="button">Baixar save danificado (.txt)</button>',
 '<p><strong>2. Escolha como continuar.</strong> Restaure um backup válido ou reinicie apenas o protótipo M1h-F.</p>',
 '<label for="m1hfRecoveryImport">Restaurar backup Phaser v2 (máximo 2 MB)',
 '<input id="m1hfRecoveryImport" type="file" accept=".json,application/json" disabled></label>',
 '<button id="m1hfRecoveryReset" type="button" disabled>Reiniciar somente o teste M1h-F</button>',
 '<p id="m1hfRecoveryStatus" role="status" aria-live="polite">Baixe primeiro o arquivo danificado para liberar a recuperação.</p>',
 '<p id="m1hfRecoveryNotice">Nada é enviado automaticamente. Nenhuma opção limpa o cache, o save clássico ou o save da demo estável.</p>',
 '</div>'
 ].join('\n');
 document.head.append(style);document.body.append(section);
 document.getElementById('hub')?.setAttribute('inert','');
 const button=section.querySelector('#m1hfRecoveryDownload');
 const reset=section.querySelector('#m1hfRecoveryReset');
 const input=section.querySelector('#m1hfRecoveryImport');
 section.querySelector('#m1hfRecoveryError').textContent='Detalhe técnico: '+short(error?.message||error);
 const announce=message=>section.querySelector('#m1hfRecoveryStatus').textContent=message;
 button.addEventListener('click',()=>{
  if(original===null)return announce('Armazenamento ilegível. Não apague dados. Verifique permissões do navegador.');
  try{
   const url=URL.createObjectURL(new Blob([original],{type:'text/plain;charset=utf-8'}));
   const link=document.createElement('a');link.href=url;link.download='peren-m1hf-save-danificado.txt';
   document.body.append(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1800);
   downloaded=true;reset.disabled=false;input.disabled=false;
   announce('Arquivo solicitado. Agora escolha um backup válido ou confirme um reinício isolado.');
  }catch(e){announce('Falha ao baixar: '+short(e.message))}
 });
 const apply=(action,backupText)=>{
  if(!downloaded)return announce('Baixe primeiro o save danificado.');
  const message=action==='reset'?
   'Reiniciar SOMENTE o progresso experimental M1h-F? Esta ação apaga apenas esse save e não poderá ser desfeita aqui.':
   'Substituir SOMENTE o save experimental M1h-F pelo backup selecionado?';
  if(!confirmAction(message))return announce('Cancelado: o save atual foi preservado.');
  try{
   recoverPreviewSave({storage,key,expectedRaw:original,action,backupText,confirmed:true,downloaded,validate:text=>validate(text,catalogs)});
   announce('Recuperação confirmada; reiniciando a prévia…');
   reload();
  }catch(e){announce('Nenhum dado foi alterado: '+short(e.message))}
 };
 reset.addEventListener('click',()=>apply('reset'));
 input.addEventListener('change',async event=>{
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  if(file.size>MAX_IMPORT_BYTES)return announce('Backup maior que 2 MB. Nenhum dado foi alterado.');
  try{apply('restore',await file.text())}catch(e){announce('Falha ao ler backup: '+short(e.message))}
 });
 button.focus();
 return {hasRaw:original!==null,isUnlocked:()=>downloaded};
}
