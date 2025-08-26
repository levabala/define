import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import viteFastify from '@fastify/vite/plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const root = resolve(import.meta.dirname);

export default defineConfig({
    root,
    plugins: [viteFastify(), react(), tailwindcss()],
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, './src'),
        },
    },
});
