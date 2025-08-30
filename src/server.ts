import { COOKIE_NAME_USERNAME } from '@/consts';
import fastifyCookie from '@fastify/cookie';
import fastifyFormBody from '@fastify/formbody';
import fastifyJwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import fastifyVite from '@fastify/vite';
import {
    fastifyTRPCPlugin,
    FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import { type } from 'arktype';
import { eq } from 'drizzle-orm';
import fastify from 'fastify';
import { resolve } from 'node:path';
import { appRouter, type AppRouter } from './appRouter';
import { createContext } from './context';
import { db } from './db';
import { usersTable } from './schema';

const server = fastify({
    maxParamLength: 5000,
    logger: false,
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

// Global error handler to sanitize all thrown errors
server.setErrorHandler(function (error, request, reply) {
    console.error(error, `Error in ${request.method} ${request.url}`);

    // Always return 500 Internal Server Error for any thrown error
    reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Something went wrong',
        statusCode: 500,
    });
});

server.addHook('onRequest', async (request) => {
    if (
        request.url.startsWith('/trpc') ||
        request.url === '/login' ||
        request.url === '/logout' ||
        request.url.endsWith('.html')
    ) {
        console.log(`${request.method} ${request.url}`);
    }
});

const rootPath = resolve(import.meta.dirname, '..');
const distDir = resolve(import.meta.dirname, '..', 'dist');
const publicDir = resolve(import.meta.dirname, '..', 'public');

// Register static file serving for public directory
await server.register(fastifyStatic, {
    root: publicDir,
    prefix: '/',
    wildcard: false,
});

await server.register(fastifyVite, {
    root: rootPath, // where to look for vite.config.js
    distDir: distDir,
    dev: process.argv.includes('--dev'),
    spa: true,
    logLevel: 'debug',
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
            try {
                await opts.req.jwtVerify();
            } catch (err) {
                opts.res.code(401).send('Unauthorized');
                return null;
            }

            return createContext(opts);
        },
        onError({ path, error }) {
            console.error(`Error in tRPC handler on path '${path}':`, error);
        },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

// Only handle non-static routes
const spaRoutes = ['/', '/login', '/logout'];
spaRoutes.forEach((route) => {
    server.get(route, (_req, reply) => {
        return reply.html();
    });
});

try {
    await server.vite.ready();
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server started on http://localhost:3000');
} catch (err) {
    console.error(err);
    process.exit(1);
}
