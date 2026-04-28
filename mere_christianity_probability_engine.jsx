import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const doctrines = [
{ id:'incarnation', title:'Incarnation', weight:0.22, verses:['John 1:1-14','Philippians 2:5-11'], objections:['Legend development','Metaphysical incoherence'], premises:[['Earliest sources attribute divine status to Jesus',72],['Post-resurrection worship emerges early',78],['Incarnation best explains mediation between God and humanity',66]]},
{ id:'trinity', title:'Trinity', weight:0.2, verses:['Matthew 28:19','2 Corinthians 13:14'], objections:['Contradiction with monotheism','Late doctrinal invention'], premises:[['One God is retained',95],['Father Son Spirit each receive divine treatment',74],['Triune model best unifies data',69]]},
{ id:'atonement', title:'Atonement', weight:0.18, verses:['Isaiah 53','Romans 3:21-26'], objections:['Moral objection to substitution','Could forgive without cross'], premises:[['Jesus interpreted death salvifically',76],['Earliest preaching centers cross and forgiveness',79],['Representative sacrifice coheres with covenant themes',68]]},
{ id:'scripture', title:'Apostolic Scripture', weight:0.2, verses:['Luke 1:1-4','2 Peter 1:16'], objections:['Canon politics','Transmission corruption'], premises:[['Apostles/witness circles had privileged access',81],['Core NT texts are early',75],['Providence plausibly preserves testimony',66]]},
{ id:'church', title:'Church & Sacraments', weight:0.2, verses:['Acts 2:42','1 Corinthians 11:23-26'], objections:['Institutional abuse','Purely symbolic rites'], premises:[['Jesus founded enduring community',77],['Baptism/Eucharist are primitive practices',82],['Embodied grace fits human persons',71]]}
];
const noisyOr = vals => 1-vals.reduce((a,v)=>a*(1-v),1);
const avg = vals => vals.reduce((a,b)=>a+b,0)/vals.length;

export default function App(){
const [tab,setTab]=useState('engine');
const [saved,setSaved]=useState([]);
const [state,setState]=useState(()=>Object.fromEntries(doctrines.map(d=>[d.id,d.premises.map(p=>p[1])])));
const [branch,setBranch]=useState('mere');
const results = useMemo(()=>doctrines.map(d=>{
 const vals=state[d.id].map(v=>v/100);
 const score=Math.min(1,avg(vals)*0.62 + noisyOr(vals.map(v=>v*0.45))*0.38);
 return {...d,score};
}),[state]);
const base=Math.round(results.reduce((a,r)=>a+r.score*r.weight,0)*100);
const branchAdj = branch==='catholic'?6:branch==='orthodox'?5:branch==='protestant'?3:0;
const total=Math.min(100,base+branchAdj);
const timeline=[['30 AD','Crucifixion / Resurrection claims'],['50s AD','Pauline letters'],['90s AD','Johannine corpus'],['325 AD','Council of Nicaea'],['381 AD','Constantinople'],['451 AD','Chalcedon']];
return <div className='min-h-screen bg-black text-white p-6 md:p-10'>
<div className='max-w-7xl mx-auto space-y-8'>
<header className='space-y-4'>
<h1 className='text-6xl font-bold'>Mere Christianity Engine V4</h1>
<p className='text-zinc-300'>Public-release apologetics platform with branch paths, history timeline, saved sessions, and objection challenger.</p>
<div className='flex flex-wrap gap-3'>
{['engine','history','report','challenge'].map(t=><Button key={t} onClick={()=>setTab(t)}>{t}</Button>)}
</div>
</header>
{tab==='engine' && <div className='space-y-6'>
<Card className='bg-zinc-950 border-zinc-800 text-white'><CardContent className='p-6 space-y-4'>
<div className='flex gap-3 flex-wrap'>{['mere','catholic','orthodox','protestant'].map(b=><Button key={b} onClick={()=>setBranch(b)}>{b}</Button>)}</div>
<div className='text-sm text-zinc-400'>Tradition path selected: {branch}</div>
<div className='text-7xl font-bold text-yellow-400'>{total}%</div>
<div className='h-4 bg-zinc-800 rounded-full overflow-hidden'><div className='h-full bg-yellow-400' style={{width:`${total}%`}}/></div>
<Button onClick={()=>setSaved(s=>[...s,{date:new Date().toLocaleString(),score:total,branch}])}>Save Session</Button>
</CardContent></Card>
{results.map(r=><Card key={r.id} className='bg-zinc-950 border-zinc-800 text-white'><CardContent className='p-6'><div className='flex justify-between'><h2 className='text-2xl font-semibold'>{r.title}</h2><div className='text-yellow-400 font-bold'>{Math.round(r.score*100)}%</div></div><div className='mt-4 space-y-4'>{r.premises.map((p,i)=><div key={i}><div className='flex justify-between text-sm'><span>{p[0]}</span><span>{state[r.id][i]}%</span></div><input type='range' min='0' max='100' value={state[r.id][i]} onChange={e=>setState(s=>({...s,[r.id]:s[r.id].map((v,ix)=>ix===i?+e.target.value:v)}))} className='w-full'/></div>)}</div></CardContent></Card>)}
</div>}
{tab==='history' && <div className='grid gap-4'>{timeline.map(t=><Card key={t[0]} className='bg-zinc-950 border-zinc-800 text-white'><CardContent className='p-5'><div className='text-yellow-400 font-bold'>{t[0]}</div><div>{t[1]}</div></CardContent></Card>)}</div>}
{tab==='report' && <Card className='bg-zinc-950 border-zinc-800 text-white'><CardContent className='p-6'><h2 className='text-3xl font-bold'>Saved Sessions</h2><div className='mt-4 space-y-3'>{saved.length===0?'No saved sessions yet.':saved.map((s,i)=><div key={i} className='border-b border-zinc-800 pb-2'>{s.date} · {s.branch} · {s.score}%</div>)}</div></CardContent></Card>}
{tab==='challenge' && <Card className='bg-zinc-950 border-zinc-800 text-white'><CardContent className='p-6'><h2 className='text-3xl font-bold'>Best Current Objection</h2><p className='mt-3 text-zinc-300'>Your weakest current doctrine score is the best place for criticism. Lower sliders there first. Current target: {results.sort((a,b)=>a.score-b.score)[0].title}.</p></CardContent></Card>}
</div></div>
}
