/**
 * Xbox/standard HTML5 Gamepad input adapter for the Phaser exploration lab.
 * This module is pure JavaScript so it can be tested without Phaser/browser.
 * The primary controller drives both paused HTML menus and live Phaser scenes.
 */
export const XBOX = Object.freeze({
  A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7,
  VIEW: 8, MENU: 9, L3: 10, R3: 11,
  UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15,
});
export const GAMEPAD_DEADZONE = 0.20;

function btn(pad, index) {
  const b = pad?.buttons?.[index];
  return !!(b && (b.pressed || Number(b.value || 0) >= 0.5));
}
function axis(pad, i) {
  const v = Number(pad?.axes?.[i]);
  return Number.isFinite(v) ? Math.max(-1, Math.min(1, v)) : 0;
}
function radialStick(rawX, rawY) {
  const length = Math.hypot(rawX, rawY);
  if (length <= GAMEPAD_DEADZONE) return {x: 0, y: 0};
  const magnitude = Math.min(1, (length - GAMEPAD_DEADZONE) / (1 - GAMEPAD_DEADZONE));
  return {x: rawX / length * magnitude, y: rawY / length * magnitude};
}
const emptyButtons = () => ({a:false,b:false,x:false,y:false,menu:false,view:false,up:false,down:false,left:false,right:false});
export function readXboxPad(gamepads = []) {
  // Prefer the browser's Standard Gamepad mapping (used by Xbox on USB/Bluetooth).
  const connected = Array.from(gamepads || []).filter(p => p && p.connected !== false);
  const pad = connected.find(p => p.mapping === 'standard') || connected[0];
  if (!pad) return {connected:false,index:null,id:'',move:{x:0,y:0},sprint:false,sneak:false,buttons:emptyButtons()};
  let move = radialStick(axis(pad,0), axis(pad,1));
  const dpadX=Number(btn(pad,XBOX.RIGHT))-Number(btn(pad,XBOX.LEFT));
  const dpadY=Number(btn(pad,XBOX.DOWN))-Number(btn(pad,XBOX.UP));
  if (dpadX || dpadY) {const size=Math.hypot(dpadX,dpadY);move={x:dpadX/size,y:dpadY/size};}
  const buttons = {
    a:btn(pad,XBOX.A),b:btn(pad,XBOX.B),x:btn(pad,XBOX.X),y:btn(pad,XBOX.Y),
    menu:btn(pad,XBOX.MENU),view:btn(pad,XBOX.VIEW),
    up:btn(pad,XBOX.UP) || move.y < -.78,
    down:btn(pad,XBOX.DOWN) || move.y > .78,
    left:btn(pad,XBOX.LEFT) || move.x < -.78,
    right:btn(pad,XBOX.RIGHT) || move.x > .78,
  };
  return {connected:true,index:pad.index ?? 0,id:String(pad.id||'Controle'),move,
    sprint:btn(pad,XBOX.RT)||btn(pad,XBOX.RB)||btn(pad,XBOX.L3),sneak:btn(pad,XBOX.LT),buttons};
}
export class XboxPadTracker {
  constructor(){this.last=emptyButtons();this.padId=null;}
  poll(getPads) {
    let pads=[];
    try {pads=typeof getPads==='function'?getPads()||[]:getPads||[];} catch {pads=[];}
    const state=readXboxPad(pads);
    const identity=state.connected?`${state.index}:${state.id}`:null;
    if (this.padId!==identity) this.last=emptyButtons();
    const justPressed={};
    for(const [key,pressed] of Object.entries(state.buttons)) justPressed[key]=pressed&&!this.last[key];
    this.last={...state.buttons};this.padId=identity;
    return {...state,justPressed};
  }
}
