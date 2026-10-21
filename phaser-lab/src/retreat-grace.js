/** M1h-F.18: temporary grace after retreat; purely volatile and never saved. */
export const RETREAT_GRACE_MS=3000;
export function tickRetreatGrace(remaining,elapsed){
 const start=Number.isFinite(remaining)?Math.max(0,remaining):0;
 const step=Number.isFinite(elapsed)?Math.max(0,elapsed):0;
 return Math.max(0,start-step);
}
export const retreatGraceActive=remaining=>Number.isFinite(remaining)&&remaining>0;
export function retreatGraceReadout(remaining){
 if(!retreatGraceActive(remaining))return null;
 const seconds=Math.ceil(remaining/1000);
 return {seconds,title:'RECUO SEGURO',detail:seconds+'s para se reposicionar · novos contatos temporariamente suspensos'};
}
