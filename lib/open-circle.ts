import {matchesPreference,type State} from './exchange.ts';
export type Transfer={from:string;to:string;piece:string};
type Community=State&{members:Record<string,string>;requests?:Record<string,boolean>};
// A gift may go directly to a requester or through one consenting swapper.
export function findOpenChains(s:Community):Transfer[][]{
 const locked=new Set(s.loops.filter(l=>['reserved','complete'].includes(l.status)).flatMap(l=>l.items));
 const pieces=s.pieces.filter(p=>!locked.has(p.id)&&s.members[p.owner]);
 const members=Object.keys(s.members),found:Transfer[][]=[];
 const wants=(who:string,p:typeof pieces[number])=>(s.wants[who]||[]).includes(p.id)&&matchesPreference(s,who,p);
 for(const gift of pieces.filter(p=>p.offer==='gift'))for(const receiver of members){
  if(receiver===gift.owner||!wants(receiver,gift))continue;
  const first={from:gift.owner,to:receiver,piece:gift.id};
  if(s.requests?.[receiver])found.push([first]);
  for(const offered of pieces.filter(p=>p.owner===receiver&&p.offer!=='gift'))for(const recipient of members){
   if(recipient===gift.owner||recipient===receiver||!s.requests?.[recipient]||!wants(recipient,offered))continue;
   found.push([first,{from:receiver,to:recipient,piece:offered.id}]);
  }
 }
 return found;
}
