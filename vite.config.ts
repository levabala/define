import viteFastify from '@fastify/vite/plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const root = resolve(import.meta.dirname, 'src', 'client');
const outDir = resolve(import.meta.dirname, 'dist');

export default defineConfig({
    root,
    build: {
        outDir,
        emptyOutDir: true,
    },
    plugins: [
        viteFastify({ spa: true, useRelativePaths: true }),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Define App',
                short_name: 'Define',
                description: 'Define some words',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            includeAssets: [
                'favicon.ico',
                'apple-touch-icon.png',
                'favicon.svg',
            ],
            workbox: {
                globPatterns: ['**/*.{js,css,ico,png,svg}'],
            },
            devOptions: {
                enabled: true,
            },
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, './src'),
        },
    },
});
