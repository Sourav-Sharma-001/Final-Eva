import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3001,
    strictPort: true, // Ensures Vite doesn't fallback to another port if 3001 is occupied
  },
});
