CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instagram_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  creator_name TEXT,
  tags TEXT,
  keyword TEXT,
  status TEXT,
  resource_link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

