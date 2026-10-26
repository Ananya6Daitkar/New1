'use client';
import {m} from 'framer-motion';import SiteHeader from '../site-header';import TryOn from '../try-on';
export default function Studio(){return <div className="studio-page"><SiteHeader active="studio"/><main className="studio-main"><m.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45}}><TryOn expanded/></m.div></main><footer className="editorial-footer"><span>LOOPFIT — CIRCULAR BY DESIGN</span><span>Less new. More you.</span><a href="/">Back to the edit ↗</a></footer></div>}
