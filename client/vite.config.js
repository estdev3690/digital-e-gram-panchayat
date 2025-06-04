import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 5173,
      proxy: {
        '/api': {
          target: isProduction 
            ? 'https://digital-e-gram-panchayat-xgvs.onrender.com'
            : 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './public/assets'),
      },
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(
        isProduction 
          ? 'https://digital-e-gram-panchayat-xgvs.onrender.com'
          : 'http://localhost:5000'
      ),
      'process.env.VITE_ENV': JSON.stringify(mode)
    }
  };
}); 