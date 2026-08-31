const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = parseInt(process.env.PORT, 10) || 5500;
const DEFAULT_PAGE = '/src/pages/common/index.html';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',
    '.mp4': 'video/mp4',
    '.txt': 'text/plain; charset=utf-8',
    '.pdf': 'application/pdf'
};

const sendFile = (res, filePath) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache',
            // Allow Chrome DevTools and Live Server websockets - fixes CSP connect-src violation
            'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https: http:; connect-src 'self' ws://127.0.0.1:* ws://localhost:* http://127.0.0.1:* http://localhost:* https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https: http:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com data:"
        });
        res.end(data);
    });
};

const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    // Silently handle Chrome DevTools well-known probe and favicon (prevents 404 + CSP noise)
    if (urlPath === '/.well-known/appspecific/com.chrome.devtools.json' || urlPath.includes('.well-known/appspecific')) {
        res.writeHead(204, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'Content-Security-Policy': "default-src 'self'; connect-src 'self'" });
        res.end('');
        return;
    }
    if (urlPath === '/favicon.ico' || urlPath === '/favicon.png') {
        res.writeHead(204, { 'Cache-Control': 'no-cache' });
        res.end('');
        return;
    }
    if (urlPath === '/') urlPath = DEFAULT_PAGE;

    // Rewrite legacy "/frontend/..." / "/Frontend/..." paths so that
    // links pointing at the Frontend subfolder still resolve correctly
    // when this server is rooted at the Frontend folder.
    const normalized = urlPath.replace(/^\/+/, '').split('/');
    if (normalized.length > 1 && normalized[0].toLowerCase() === 'frontend') {
        urlPath = '/' + normalized.slice(1).join('/');
    }

    let filePath = path.join(ROOT, urlPath);
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        sendFile(res, filePath);
    });
});

const start = () => {
    let listenPort = PORT;
    const listen = (attemptPort) => {
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE' && attemptPort < PORT + 10) {
                console.warn(`⚠️  Port ${attemptPort} is in use, trying ${attemptPort + 1}...`);
                server.removeAllListeners('listening');
                listen(attemptPort + 1);
            } else {
                console.error('✗ Frontend startup failed:', err.message);
                process.exit(1);
            }
        });
        server.once('listening', () => {
            console.log(`🚀 Frontend running at: http://localhost:${attemptPort}`);
        });
        server.listen(attemptPort);
    };
    listen(listenPort);
};

start();