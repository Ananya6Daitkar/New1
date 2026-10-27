import {cookies} from 'next/headers';import {redirect} from 'next/navigation';import {pool} from './runtime';import {verifySession} from './session';
export async function getChatGPTUser(){const id=verifySession((await cookies()).get('loopfit_session')?.value);if(!id)return null;const r=await pool.query('SELECT id,email,name FROM app_users WHERE id=$1',[id]);const u=r.rows[0];return u?{userId:u.id,email:u.email,fullName:u.name,displayName:u.name}:null}
export async function requireChatGPTUser(returnTo:string){const u=await getChatGPTUser();if(!u)redirect(chatGPTSignInPath(returnTo));return u}
export const chatGPTSignInPath=(p='/')=>'/signin-with-chatgpt?return_to='+encodeURIComponent(p);
export const chatGPTSignOutPath=()=>'/signin-with-chatgpt';
