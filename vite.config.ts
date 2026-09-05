import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    open: true
  },
  base: command === 'build' ? '/mosaics-map/' : '/'
}));