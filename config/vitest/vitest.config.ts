/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    plugins: [react()],
    // add "extends" to merge two configs together
    // extends: './vite.config.js',
    test: {
      include: ['./**/*.browser.setup.{tsx,jsx}'],
      // it is recommended to define a name when using inline configs
      name: 'happy-dom',
      environment: 'happy-dom',
      setupFiles: ["./browser.init.ts"],
      exclude: ['**/node_modules/**'],
      globals: true,
      // you might want to disable it, if you don't have tests that rely on CSS
      // since parsing CSS is slow
      css: false,
      // https://github.com/vitest-dev/vitest/issues/1674
      ...(process.env.CI && {
        minThreads: 4,
        maxThreads: 4
      })
    }
  },
  {
    test: {
      include: ['./**/*.node.test.{ts,js}'],
      exclude: ['**/node_modules/**'],
      name: 'node',
      environment: 'node',
      globals: true,
      ...(process.env.CI && {
        minThreads: 4,
        maxThreads: 4
      }),
      hookTimeout: 30000
    }
  }
])