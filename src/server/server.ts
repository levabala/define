import {
    fastifyTRPCPlugin,
    FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import fastifyVite from '@fastify/vite';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyFormBody from '@fastify/formbody';
import { createContext } from './context';
import { appRouter, type AppRouter } from './appRouter';
import { resolve } from 'node:path';
import { usersTable } from './schema';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { type } from 'arktype';
import { COOKIE_NAME_USERNAME } from '@/consts';

const server = fastify({
    maxParamLength: 5000,
});

const COOKIE_NAME_AUTH = 'token';

await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
    cookie: {
        cookieName: COOKIE_NAME_AUTH,
        signed: false,
    },
});

await server.register(fastifyCookie);
await server.register(fastifyFormBody);

const rootPath = resolve(import.meta.dirname, '../..');
console.log(rootPath);

await server.register(fastifyVite, {
    root: rootPath, // where to look for vite.config.js
    dev: process.argv.includes('--dev'),
    spa: true,
});

const PayloadType = type({
    username: 'string',
    codeword: 'string',
});

server.post('/login', async (request, reply) => {
    const { username, codeword } = PayloadType.assert(request.body);

    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username));

    if (user.length === 0 || user[0].codeword !== codeword) {
        return reply.status(401).send('Unauthorized');
    }

    const payload = {
        username,
    };

    const payloadSigned = server.jwt.sign(payload);

    return reply
        .setCookie(COOKIE_NAME_AUTH, payloadSigned, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        })
        .setCookie(COOKIE_NAME_USERNAME, username, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        })
        .redirect('/');
});

server.post('/logout', async (_request, reply) => {
    return reply.clearCookie(COOKIE_NAME_AUTH).status(303).redirect('/login');
});

server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
        router: appRouter,
        createContext: async (opts) => {
            await opts.req.jwtVerify();
            return createContext(opts);
        },
        onError({ path, error }) {
            console.error(`Error in tRPC handler on path '${path}':`, error);
        },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

server.get('/*', (_req, reply) => {
    return reply.html();
});

try {
    await server.vite.ready();
    await server.listen({ port: 3000 });
} catch (err) {
    server.log.error(err);
    process.exit(1);
}
