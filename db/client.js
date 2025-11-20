import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir =
  process.env.DATA_DIR ||
  (process.env.VERCEL ? '/tmp/insta-resource' : path.join(process.cwd(), 'data'));
const dbFilePath = path.join(dataDir, 'app.db');
const schemaFilePath = path.join(process.cwd(), 'db', 'schema.sql');

function ensureDatabase() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(dbFilePath);
  const schema = fs.readFileSync(schemaFilePath, 'utf8');
  db.exec(schema);

  return db;
}

let dbInstance;

export function getDb() {
  if (!dbInstance) {
    dbInstance = ensureDatabase();
  }
  return dbInstance;
}
