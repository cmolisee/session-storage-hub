import { defineConfig } from 'wxt';
import { resolve } from 'node:path';

// See https://wxt.dev/api/config.html
export default defineConfig({
    alias: {
        types: resolve('types'),
    },
    extensionApi: 'chrome',
    modules: ['@wxt-dev/module-solid'],
    srcDir: 'src',
    outDir: 'dist',
    manifest: {
        permissions: ['activeTab', 'tabs', 'storage'],
        action: {},
        web_accessible_resources: [
            {
                resources: ['inject.js'],
                matches: ["<all_urls>"],
            }
        ],
    },
    runner: {
        startUrls: ['https://webext-core.aklinker1.io/'],
    },
    vite: () => ({
        optimizeDeps: {
            include: ['@codemirror/state', '@codemirror/view'],
        },
    })
});
