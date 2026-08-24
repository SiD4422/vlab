import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Mock Vercel Serverless Functions in Vite
const vercelApiMock = () => ({
  name: 'vercel-api-mock',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            // Load environment variables for local dev
            const env = loadEnv(server.config.mode, process.cwd(), '');
            process.env.OPENROUTER_API_KEY = env.VITE_OPENROUTER_API_KEY || env.OPENROUTER_API_KEY;

            // Mock req and res for the handler
            const handlerReq = { method: req.method, body: JSON.parse(body || '{}') };
            const handlerRes = {
              status: (code) => { res.statusCode = code; return handlerRes; },
              json: (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              }
            };

            // Dynamically import the handler (using a cache-buster to allow hot-reloading the backend)
            const handlerPath = path.resolve(process.cwd(), 'api/chat.js');
            const handler = await import(`file://${handlerPath}?update=${Date.now()}`);
            await handler.default(handlerReq, handlerRes);
          } catch (e) {
            console.error('API Error:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiMock()],
  build: {
    rollupOptions: {
      output: {
        // manualChunks as a function — required by Vite v8/rolldown
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'vendor-firebase';
          if (id.includes('node_modules/recharts')) return 'vendor-recharts';
          if (id.includes('node_modules/lucide-react')) return 'vendor-lucide';
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) return 'vendor-react';
        },
      },
    },
  },
})


