import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './appRouter';

export const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: '/trpc',
        }),
    ],
});
