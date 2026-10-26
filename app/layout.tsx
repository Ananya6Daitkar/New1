import type { Metadata } from 'next';
import './globals.css';
import MotionProvider from './motion-provider';
export const metadata:Metadata={title:'LoopFit — Good clothes, new connections',description:'Discover three-way clothing swaps. See the piece, close the loop, wear it again.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><MotionProvider>{children}</MotionProvider></body></html>}
