import {findCycles,propose,approve,withdraw,type State,type Piece,styles} from './exchange.ts';
export type EventState=State&{name:string;members:Record<string,string>;receipts:Record<string,string[]>;log:{at:number;actor:string;action:string}[]};
export function change(s:EventState,actor:string,a:any,now=Date.now()):EventState{
 if(!s.members[actor])throw Error('Join this event first.');
 let next:EventState={...s,loops:s.loops.map(l=>l.status==='proposed'&&l.expires<=now?{...l,status:'cancelled'}:l)};
 const locked=(id:string)=>next.loops.some(l=>['reserved','complete'].includes(l.status)&&l.items.includes(id));
 if(a.type==='list'){
 if(next.pieces.filter(p=>p.owner===actor).length>=5)throw Error('Maximum five pieces per participant.');
 const p=a.piece;if(!p||typeof p.title!=='string'||!p.title.trim()||p.title.length>80||typeof p.note!=='string'||p.note.trim().length<10||p.note.length>1000||!['XS','S','M','L','XL','XXL'].includes(p.size)||!['Very good','Good','Visible wear'].includes(p.condition)||typeof p.image!=='string'||!/^\/api\/media\?id=[\w-]+$/.test(p.image))throw Error('Add a photo, size and honest measurements / condition notes.');
 if(!Number.isFinite(p.chestCm)||p.chestCm<40||p.chestCm>200||!Number.isFinite(p.lengthCm)||p.lengthCm<20||p.lengthCm>150||!styles.includes(p.style)||typeof p.conditionImage!=='string'||!/^\/api\/media\?id=[\w-]+$/.test(p.conditionImage)||p.conditionImage===p.image)throw Error('Add garment measurements, style and a separate condition close-up.');
 next={...next,pieces:[...next.pieces,{id:crypto.randomUUID(),owner:actor,title:p.title.trim(),note:p.note.trim(),size:p.size,condition:p.condition,image:p.image,chestCm:p.chestCm,lengthCm:p.lengthCm,style:p.style,conditionImage:p.conditionImage,kind:'shirt',color:'#9aab85'}]};
 }else if(a.type==='preferences'){
 const p=a.preferences;if(!p||!Array.isArray(p.sizes)||!Array.isArray(p.styles)||p.sizes.length>6||p.styles.length>5||p.sizes.some((x:string)=>!['XS','S','M','L','XL','XXL'].includes(x))||p.styles.some((x:any)=>!styles.includes(x))||!Number.isFinite(p.minChest)||!Number.isFinite(p.maxChest)||p.minChest<40||p.maxChest>200||p.minChest>p.maxChest)throw Error('Choose valid preferences and a chest range between 40 and 200 cm.');
 next={...next,preferences:{...next.preferences,[actor]:{sizes:p.sizes,styles:p.styles,minChest:p.minChest,maxChest:p.maxChest}},loops:next.loops.map(l=>l.status==='proposed'&&l.members.includes(actor)?{...l,status:'cancelled'}:l)};
 }else if(a.type==='handover'){
 const l=next.loops.find(l=>l.id===a.id);const place=typeof a.location==='string'?a.location.trim():'';
 if(!l||!l.members.includes(actor)||l.status!=='proposed'||next.receipts[l.id]?.length||!place||place.length>160)throw Error('Choose a public meeting place before handover starts.');
 next={...next,loops:next.loops.map(x=>x.id===l.id?{...x,handover:place,approvals:[],status:'proposed',expires:now+86400000}:x)};
 }else if(a.type==='wish'){
 const p=next.pieces.find(p=>p.id===a.id);if(!p||p.owner===actor||locked(p.id))throw Error('This piece cannot be saved.');const old=next.wants[actor]||[];next={...next,wants:{...next.wants,[actor]:old.includes(p.id)?old.filter(id=>id!==p.id):[...old,p.id]},loops:next.loops.map(l=>l.status==='proposed'&&l.members.includes(actor)?{...l,status:'cancelled'}:l)};
 }else if(a.type==='propose'){
 if(!Array.isArray(a.members)||!a.members.includes(actor))throw Error('You must participate in the loop.');const location=typeof a.location==='string'?a.location.trim():'';if(!location||location.length>160)throw Error('Add a public meeting location.');next={...next,...propose(next,a.members,now)};next={...next,loops:next.loops.map((l,i)=>i===next.loops.length-1?{...l,handover:location}:l)};
 }else if(a.type==='approve'){next={...next,...approve(next,a.id,actor,now)};
 }else if(a.type==='withdraw'){
 if(next.receipts[a.id]?.length)throw Error('A handover has started. Resolve it together before changing the exchange.');next={...next,...withdraw(next,a.id,actor)};
 }else if(a.type==='receive'){
 const l=next.loops.find(l=>l.id===a.id);if(!l||l.status!=='reserved'||!l.members.includes(actor))throw Error('Only reserved-loop participants can confirm receipt.');const receipts=[...new Set([...(next.receipts[l.id]||[]),actor])];next={...next,receipts:{...next.receipts,[l.id]:receipts},loops:next.loops.map(x=>x.id===l.id&&receipts.length===l.members.length?{...x,status:'complete'}:x)};
 }else if(a.type==='remove'){
 const p=next.pieces.find(p=>p.id===a.id);if(!p||p.owner!==actor||locked(p.id))throw Error('Only your unreserved pieces can be removed.');next={...next,pieces:next.pieces.filter(x=>x.id!==p.id),loops:next.loops.map(l=>l.status==='proposed'&&l.items.includes(p.id)?{...l,status:'cancelled'}:l)};
 }else throw Error('Unknown action.');
 return {...next,log:[...next.log,{at:now,actor,action:a.type}].slice(-100)};
}
// Exact maximum participant coverage for a bounded event (at most 12 members).
export function coverage(s:State,maxLength=3){const cs=findCycles(s).filter(c=>c.length<=maxLength),people=[...new Set(cs.flat())];const dp=new Map<number,string[][]>([[0,[]]]);for(const c of cs){const mask=c.reduce((m,p)=>m|(1<<people.indexOf(p)),0);for(const [used,chosen] of [...dp])if(!(used&mask)&&!dp.has(used|mask))dp.set(used|mask,[...chosen,c]);}let best:string[][]=[];for(const chosen of dp.values())if(chosen.flat().length>best.flat().length)best=chosen;return {count:best.flat().length,loops:best};}
