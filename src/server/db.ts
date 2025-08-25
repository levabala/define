import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database(process.env.DB_FILE_NAME!);
export const db = drizzle(sqlite);

db.run('PRAGMA journal_mode = WAL;');
