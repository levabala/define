import { initTRPC } from '@trpc/server';
import { type } from 'arktype';
import { and, eq, sql } from 'drizzle-orm';
import { db } from './db';
import { processWord } from './helpers';
import { wordsTable } from './schema';

export const t = initTRPC.create({
    errorFormatter({ shape, error }) {
        // Log full error server-side for debugging
        console.error('tRPC error:', error);

        // Return sanitized error to client
        return {
            ...shape,
            message: 'Internal server error',
            data: {
                code: 'INTERNAL_SERVER_ERROR',
                httpStatus: 500,
            },
        };
    },
});
export const appRouter = t.router({
    ping: t.procedure.mutation(() => {
        return 'pong';
    }),
    getWordsAll: t.procedure
        .input(type({ username: 'string' }))
        .query(async ({ input: { username } }) => {
            return await db
                .select()
                .from(wordsTable)
                .where(
                    and(
                        eq(wordsTable.username, username),
                        eq(wordsTable.isDeleted, 0),
                    ),
                );
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
