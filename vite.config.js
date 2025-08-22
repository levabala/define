import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import viteFastify from '@fastify/vite/plugin';
import preact from '@preact/preset-vite';

const root = resolve(import.meta.dirname);

export default defineConfig({
    root,
    plugins: [viteFastify(), preact()],
});
