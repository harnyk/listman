import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
        },
    },
    plugins: [
        react(),
        TanStackRouterVite(),
        VitePWA({
            registerType: 'autoUpdate',
            // devOptions: {
            //     enabled: true,
            // },
            // add this to cache all the imports
            workbox: {
                globPatterns: ['**/*'],
            },
            // add this to cache all the
            // static assets in the public folder
            includeAssets: ['**/*'],
            manifest: {
                name: 'Listman',
                short_name: 'Listman',
                start_url: '/',
                display: 'standalone',
                theme_color: '#007BFF',
                background_color: '#FFFFFF',
                icons: [
                    {
                        src: '/icon-72x72.png',
                        sizes: '72x72',
                        type: 'image/png',
                    },
                    {
                        src: '/icon-96x96.png',
                        sizes: '96x96',
                        type: 'image/png',
                    },
                    {
                        src: '/icon-128x128.png',
                        sizes: '128x128',
                        type: 'image/png',
                    },
                    {
                        src: '/icon-144x144.png',
                        sizes: '144x144',
                        type: 'image/png',
                    },
                    {
                        src: '/icon-152x152.png',
                        sizes: '152x152',
                        type: 'image/png',
                    },
                    {
                        src: '/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icon-384x384.png',
                        sizes: '384x384',
                        type: 'image/png',
                    },
                    {
                        src: '/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
});
