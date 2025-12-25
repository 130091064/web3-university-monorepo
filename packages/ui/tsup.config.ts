import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  external: ['react', 'react-dom'],
  treeshake: true,
  splitting: false,
  minify: false,
  // 注入 CSS
  injectStyle: false,
  // 保留 CSS 作为单独的文件
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
