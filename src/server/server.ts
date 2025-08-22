import {
    fastifyTRPCPlugin,
    FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import fastifyVite from '@fastify/vite';
import { createContext } from './context';
import { appRouter, type AppRouter } from '../trpc/appRouter';
import { resolve } from 'node:path';

const server = fastify({
    maxParamLength: 5000,
});

const rootPath = resolve(import.meta.dirname, '../..');
console.log(rootPath);

await server.register(fastifyVite, {
    root: rootPath, // where to look for vite.config.js
    dev: process.argv.includes('--dev'),
    spa: true,
});

server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
        router: appRouter,
        createContext,
        onError({ path, error }) {
            console.error(`Error in tRPC handler on path '${path}':`, error);
        },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

server.get('/', (_req, reply) => {
    return reply.html();
});

try {
    await server.vite.ready();
    await server.listen({ port: 3000 });
} catch (err) {
    server.log.error(err);
    process.exit(1);
}
