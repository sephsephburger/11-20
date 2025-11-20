import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbFilePath = path.join(process.cwd(), 'data', 'app.db');
const schemaFilePath = path.join(process.cwd(), 'db', 'schema.sql');

function ensureDatabase() {
  const dbDir = path.dirname(dbFilePath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
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

