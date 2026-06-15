import vercelAdapter from '@sveltejs/adapter-vercel';
import nodeAdapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    compilerOptions: {
        runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
    },
    kit: {
        adapter: process.env.VERCEL ? vercelAdapter() : nodeAdapter(),
        alias: {
            '@/*': './src/*',
        },
        env: {
            dir: '.'
        }
    },
};

export default config;
