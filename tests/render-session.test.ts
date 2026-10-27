import test from 'node:test';
import assert from 'node:assert/strict';
import {signSession,verifySession} from '../render/session.ts';
import {createHmac} from 'node:crypto';
process.env.SESSION_SECRET='test-only-secret-not-for-deployment';
test('signed session identifies its owner',()=>{assert.equal(verifySession(signSession('alice')),'alice')});
test('tampered or malformed cookies fail closed',()=>{const t=signSession('alice');assert.equal(verifySession(t+'x'),null);assert.equal(verifySession(t+'.extra'),null);assert.equal(verifySession(undefined),null);assert.equal(verifySession('broken'),null)});
test('expired signed session is rejected',()=>{const p=Buffer.from(JSON.stringify({id:'alice',expires:Date.now()-1000})).toString('base64url');const sig=createHmac('sha256',process.env.SESSION_SECRET!).update(p).digest('base64url');assert.equal(verifySession(p+'.'+sig),null)});
test('rotation invalidates previous sessions',()=>{const t=signSession('alice'),old=process.env.SESSION_SECRET;process.env.SESSION_SECRET='replacement';assert.equal(verifySession(t),null);process.env.SESSION_SECRET=old});
