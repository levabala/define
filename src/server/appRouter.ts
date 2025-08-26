import { initTRPC } from '@trpc/server';
import { type } from 'arktype';
import { and, eq, sql } from 'drizzle-orm';
import { processWord } from '../helpers';
import { db } from './db';
import { wordsTable } from './schema';

export const t = initTRPC.create();
export const appRouter = t.router({
    getWordsAll: t.procedure
        .input(type({ username: 'string' }))
        .query(async ({ input: { username } }) => {
            return await db
                .select()
                .from(wordsTable)
                .where(eq(wordsTable.username, username));
        }),
    getWord: t.procedure
        .input(type({ word: 'string' }))
        .query(async ({ input: { word } }) => {
            return await db
                .select()
                .from(wordsTable)
                .where(eq(wordsTable.value, word));
        }),
    addWord: t.procedure
        .input(type({ username: 'string', word: 'string' }))
        .mutation(async ({ input: { username, word } }) => {
            const wordProcessed = processWord(word);
            await db
                .insert(wordsTable)
                .values({ username, value: wordProcessed });
        }),
    deleteWord: t.procedure
        .input(type({ username: 'string', word: 'string' }))
        .mutation(async ({ input: { username, word } }) => {
            await db
                .update(wordsTable)
                .set({ isDeleted: 1, updatedAt: sql`(datetime('now'))` })
                .where(
                    and(
                        eq(wordsTable.username, username),
                        eq(wordsTable.value, word),
                    ),
                );
        }),
});

export type AppRouter = typeof appRouter;
