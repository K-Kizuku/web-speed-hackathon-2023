import path from 'node:path';

import purgecss from '@fullhuman/postcss-purgecss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

import { getFileList } from './tools/get_file_list';

const publicDir = path.resolve(__dirname, './public');
const getPublicFileList = async (targetPath: string) => {
  const filePaths = await getFileList(targetPath);
  const publicFiles = filePaths
    .map((filePath) => path.relative(publicDir, filePath))
    .map((filePath) => path.join('/', filePath));

  return publicFiles;
};

export default defineConfig(async () => {
  const videos = await getPublicFileList(path.resolve(publicDir, 'videos'));

  return {
    build: {
      assetsInlineLimit: 20480,
      cssCodeSplit: false,
      cssTarget: 'es6',
      minify: false,
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 40960,
        },
      },
      // target: 'es2015',
      target: 'chrome110',
    },
    css: {
      postcss: {
        plugins: [
          purgecss({
            content: ['dist/*.html', 'dist/assets/*.js'],
            // css: ["dist/assets/*.css"],
            // safelist: [/filepond-*/],
          }),
        ],
      },
    },
    plugins: [
      react(),
      wasm(),
      topLevelAwait(),
      ViteEjsPlugin({
        module: '/src/client/index.tsx',
        title: '買えるオーガニック',
        videos,
      }),
      viteCompression(),
    ],
  };
});
