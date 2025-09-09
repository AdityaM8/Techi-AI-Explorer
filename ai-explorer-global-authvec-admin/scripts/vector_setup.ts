import { ensurePgVector } from '../src/lib/embeddings'
async function main(){ await ensurePgVector(); console.log('pgvector ready') }
main().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1) })
