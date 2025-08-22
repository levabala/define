import { initTRPC } from '@trpc/server';
import { type } from 'arktype';

export const t = initTRPC.create();
export const appRouter = t.router({
    hello: t.procedure.mutation(() => {
        return 'hello';
    }),
    getUser: t.procedure.input(type('string')).query((opts) => {
        return { id: opts.input, name: 'Bilbo' };
    }),
    createUser: t.procedure
        .input(
            type({
                name: 'string',
            }),
        )
        .mutation(async () => {}),
});

export type AppRouter = typeof appRouter;
