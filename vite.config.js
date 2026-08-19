import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'attendance-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/attendance' && req.method === 'GET') {
            try {
              const data = fs.readFileSync(path.resolve(__dirname, 'attendance.json'), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } catch (e) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({}));
            }
            return;
          }
          if (req.url === '/api/attendance' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              fs.writeFileSync(path.resolve(__dirname, 'attendance.json'), body);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({status: 'ok'}));
            });
            return;
          }
          next();
        });
      }
    }
  ]
})
