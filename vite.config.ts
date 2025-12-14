import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Safely inject the API key
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Polyfill 'process' so the browser doesn't crash if it's referenced directly
      'process': { env: {} } 
    },
  };
});