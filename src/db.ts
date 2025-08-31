import { Database } from 'bun:sqlite';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { resolve } from 'node:path';

const path = resolve(
    process.env.DB_ROOT_DIR || '.',
    process.env.DB_FILE_NAME || 'db.sqlite',
);

const sqlite = new Database(path);
export const db = drizzle(sqlite);

db.run('PRAGMA journal_mode = WAL;');
