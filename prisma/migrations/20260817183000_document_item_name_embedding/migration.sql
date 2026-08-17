CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "DocumentItem" ADD COLUMN "nameEmbedding" vector(768);

CREATE INDEX "DocumentItem_nameEmbedding_idx"
  ON "DocumentItem" USING hnsw ("nameEmbedding" vector_cosine_ops);
