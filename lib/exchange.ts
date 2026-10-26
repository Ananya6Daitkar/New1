export type Piece = {id:string; owner:string; title:string; size:string; condition:string; color:string; kind:string; note:string; image?:string; chestCm?:number; lengthCm?:number; style?:string; conditionImage?:string};
export type Loop = {id:string; members:string[]; items:string[]; approvals:string[]; status:'proposed'|'reserved'|'complete'|'cancelled'; expires:number; handover?:string};
export const styles = ['Casual','Minimal','Streetwear','Formal','Vintage'] as const;
export type Preference={sizes:string[]; styles:string[]; minChest:number; maxChest:number};
export type State = {preferences?:Record<string,Preference>;pieces:Piece[]; wants:Record<string,string[]>; loops:Loop[]};
export const people = ['Asha','Maya','Noor'];
export function seed():State{return {pieces:[
{id:'sage',owner:'Asha',title:'The everyday linen shirt',size:'M',condition:'Very good',color:'#a3ac87',kind:'shirt',note:'100% linen. Chest 104 cm · length 68 cm. Softened with wear; small loose thread at the cuff.',image:'/images/sage-shirt.webp'},
{id:'knit',image:'/images/cardigan.webp',owner:'Maya',title:'A little cloud of a cardigan',size:'M',condition:'Good',color:'#e1d6bc',kind:'knit',note:'Cotton blend. Chest 100 cm · length 57 cm. Light pilling around both cuffs.'},
{id:'rust',image:'/images/rust-shirt.webp',owner:'Noor',title:'The golden-hour overshirt',size:'L',condition:'Very good',color:'#b16b4c',kind:'shirt',note:'Cotton twill. Chest 112 cm · length 72 cm. No known stains; slight fading at collar.'}
],wants:{Asha:['knit'],Maya:['rust'],Noor:['sage']},loops:[]};}
export function findCycles(s:State):string[][] {
 const locked=new Set(s.loops.filter(l=>l.status==='reserved'||l.status==='complete').flatMap(l=>l.items));
 const available=s.pieces.filter(p=>!locked.has(p.id)); const found=new Map<string,string[]>();
 function visit(path:string[]){const current=path[path.length-1];for(const item of available.filter(p=>(s.wants[current]||[]).includes(p.id)&&matchesPreference(s,current,p)&&p.owner!==current)){const next=item.owner;if(next===path[0]&&path.length>=2){const key=[...path].sort().join('|');if(!found.has(key))found.set(key,[...path]);}else if(path.length<3&&!path.includes(next))visit([...path,next]);}}
 [...new Set(available.map(p=>p.owner))].forEach(p=>visit([p]));return [...found.values()];
}
export function propose(s:State,members:string[],now=Date.now()):State {
 if(!findCycles(s).some(c=>c.join('|')===members.join('|')))throw Error('This loop is no longer available.');
 const items=members.map((m,i)=>s.pieces.find(p=>p.owner===members[(i+1)%members.length]&&(s.wants[m]||[]).includes(p.id)&&matchesPreference(s,m,p)&&!s.loops.some(l=>['reserved','complete'].includes(l.status)&&l.items.includes(p.id)))!.id);
 if(s.loops.some(l=>l.status==='proposed'&&l.expires>now&&l.items.join()===items.join()))throw Error('This loop is already awaiting approval.');
 return {...s,loops:[...s.loops,{id:crypto.randomUUID(),members,items,approvals:[],status:'proposed',expires:now+24*60*60*1000}]};
}
export function approve(s:State,id:string,actor:string,now=Date.now()):State{
 const l=s.loops.find(l=>l.id===id);if(!l||l.status!=='proposed'||l.expires<=now)throw Error('This proposal has expired or closed.');
 if(!l.members.includes(actor))throw Error('Only a participant may approve.');
 if(s.loops.some(x=>x.id!==id&&(x.status==='reserved'||x.status==='complete')&&x.items.some(i=>l.items.includes(i))))throw Error('A piece is already reserved.');
 const approvals=[...new Set([...l.approvals,actor])];const reserved=approvals.length===l.members.length;
 return {...s,loops:s.loops.map(x=>x.id===id?{...x,approvals,status:reserved?'reserved':'proposed'}:reserved&&x.status==='proposed'&&x.items.some(i=>l.items.includes(i))?{...x,status:'cancelled'}:x)};
}
export function withdraw(s:State,id:string,actor:string):State{const l=s.loops.find(x=>x.id===id);if(!l||!l.members.includes(actor)||l.status==='complete')throw Error('This loop cannot be withdrawn.');return {...s,loops:s.loops.map(x=>x.id===id?{...x,status:'cancelled',approvals:[]}:x)};}

export function matchesPreference(s:State,actor:string,p:Piece){const pref=s.preferences?.[actor];if(!pref)return true;return (!pref.sizes.length||pref.sizes.includes(p.size))&&(!pref.styles.length||!!p.style&&pref.styles.includes(p.style))&&typeof p.chestCm==='number'&&p.chestCm>=pref.minChest&&p.chestCm<=pref.maxChest;}
export function matchReason(s:State,actor:string,p:Piece){return matchesPreference(s,actor,p)?s.preferences?.[actor]?'Saved piece matches your size, style and garment chest range.':'Saved piece. Add preferences to check size, style and measurements.':'Outside your preferences or missing measurements. Update preferences to include this piece.';}
