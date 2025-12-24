ALTER TABLE files
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(extracted_text, '')), 'B')
) STORED;

CREATE INDEX idx_files_search_vector
ON files USING GIN (search_vector);
