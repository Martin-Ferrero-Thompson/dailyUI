import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@images': path.resolve(__dirname, './src/images'), // Alias for images folder
    },
  },
  server: {
    port: 8081,
  },
  rollupOptions: {
    input: {
      main: path.resolve(__dirname, 'src/index.html'),
      ...getHtmlFiles('./src'),
    },
  },
});

function getHtmlFiles(dir) {
  const fs = require('fs');
  const path = require('path');
  const entries = {};

  function traverse(currentDir) {
    const files = fs.readdirSync(currentDir);

    files.forEach(file => {
      const fullPath = path.join(currentDir, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        traverse(fullPath);
      } else if (file.endsWith('.html')) {
        const relativePath = path.relative('./src', fullPath);
        const name = relativePath.replace(/\.html$/, '').replace(/\\/g, '/');
        entries[name] = fullPath;
      }
    });
  }

  traverse(dir);
  return entries;
}