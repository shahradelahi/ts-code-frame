import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/browser.ts'],
  format: ['cjs', 'esm'],
  target: 'esnext',
  outDir: 'dist',
});
