import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5174,  // Use the same port as your terminal log
    open: true,  // Automatically opens your app in the browser
  },
});
