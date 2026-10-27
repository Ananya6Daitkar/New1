import {Pool} from 'pg';
export const pool=new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:10000});
function sql(q:string){let i=0;const ignored=q.includes('INSERT OR IGNORE');return q.replace('INSERT OR IGNORE','INSERT').replace(/\?/g,()=>'$'+(++i))+(ignored?' ON CONFLICT DO NOTHING':'');}
class Statement{values:unknown[]=[];constructor(public query:string){}bind(...values:unknown[]){this.values=values;return this}async first<T>(){return (await pool.query(sql(this.query),this.values)).rows[0] as T|null}async run(){const client=await pool.connect();try{await client.query('BEGIN');await client.query('SELECT pg_advisory_xact_lock(720031)');const r=await client.query(sql(this.query),this.values);await client.query('COMMIT');return {meta:{changes:r.rowCount||0}}}catch(e){await client.query('ROLLBACK');throw e}finally{client.release()}}}
const DB={prepare:(q:string)=>new Statement(q)};
const BUCKET={async put(id:string,stream:ReadableStream,options:any){const bytes=Buffer.from(await new Response(stream).arrayBuffer());await pool.query('INSERT INTO photo_objects (id,bytes,mime) VALUES ($1,$2,$3)',[id,bytes,options.httpMetadata.contentType])},async get(id:string){const r=await pool.query('SELECT bytes FROM photo_objects WHERE id=$1',[id]);return r.rows[0]?{body:new Uint8Array(r.rows[0].bytes)}:null}};
export const env={DB,BUCKET,YOUCAM_API_KEY:process.env.YOUCAM_API_KEY};

export function expectedOrigin(req:Request){return new URL(process.env.RENDER_EXTERNAL_URL||process.env.APP_ORIGIN||req.url).origin}
