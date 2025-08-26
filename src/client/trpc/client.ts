import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../appRouter';

export const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: '/trpc',
            fetch: async (url, options) => {
                const response = await fetch(url, options);

                if (
                    response.status === 401 &&
                    window.location.pathname !== '/login'
                ) {
                    window.location.href = '/login';
                }

                return response;
            },
        }),
    ],
});
