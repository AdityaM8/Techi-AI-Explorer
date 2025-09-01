CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE "Tool" ADD COLUMN IF NOT EXISTS embedding vector(1536);
CREATE INDEX IF NOT EXISTS tool_embedding_idx ON "Tool" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
