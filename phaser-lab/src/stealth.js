/** F.19: slower travel in exchange for a smaller enemy sight radius.
 * No stealth RNG, invisibility, combat ability, or persistent state.
 */
export const SNEAK_SPEED=82;
export const SNEAK_SIGHT_MODIFIER=-1.35;
export function sneakActive({touch=false,keyboard=false,gamepad=false,sprint=false}={}){
 return !Boolean(sprint) && Boolean(touch||keyboard||gamepad);
}
export function travelSpeed({sprint=false,sneak=false,wet=false}={}){
 return (sprint?205:sneak?SNEAK_SPEED:135)*(wet?.78:1);
}
