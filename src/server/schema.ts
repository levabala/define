import { InferSelectModel, sql } from 'drizzle-orm';
import { int, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
    username: text().primaryKey(),
    codeword: text().notNull(),
});

export const wordsTable = sqliteTable(
    'words',
    {
        value: text().notNull(),
        username: text('username')
            .references(() => usersTable.username)
            .notNull(),
        isDeleted: int().default(0).notNull(),
        updatedAt: text()
            .notNull()
            .default(sql`(datetime('now'))`),
        createdAt: text()
            .notNull()
            .default(sql`(datetime('now'))`),
    },
    (table) => [primaryKey({ columns: [table.value, table.username] })],
);

export type WordType = InferSelectModel<typeof wordsTable>;
export type UserType = InferSelectModel<typeof usersTable>;
