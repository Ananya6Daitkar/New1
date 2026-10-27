import pg from 'pg';
const p=new pg.Pool({connectionString:process.env.DATABASE_URL});
await p.query(`CREATE TABLE IF NOT EXISTS app_users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password_hash TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS auth_limits(key TEXT PRIMARY KEY,window_start BIGINT NOT NULL,count INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS previews(id TEXT PRIMARY KEY,owner TEXT NOT NULL,task TEXT,status TEXT NOT NULL,created BIGINT NOT NULL);
CREATE INDEX IF NOT EXISTS preview_owner_created ON previews(owner,created);
CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,code TEXT UNIQUE NOT NULL,owner TEXT NOT NULL,payload TEXT NOT NULL,version INTEGER NOT NULL,created BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY,event TEXT NOT NULL,owner TEXT NOT NULL,mime TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS photo_objects(id TEXT PRIMARY KEY,bytes BYTEA NOT NULL,mime TEXT NOT NULL);`);await p.end();console.log('Render schema ready');
