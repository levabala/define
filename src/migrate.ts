import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';

const sqlite = new Database(process.env.DB_FILE_NAME!);

const db = drizzle(sqlite);

console.log('Migrating database...');
migrate(db, { migrationsFolder: './drizzle' });
console.log('Migration complete!');
