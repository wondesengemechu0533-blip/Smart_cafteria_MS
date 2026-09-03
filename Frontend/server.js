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
        // Prevent Back-Forward Cache (bfcache) for HTML which breaks LiveServer/WebSocket reload
        const isHtml = ext === '.html';
        const headers = {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
            'Cache-Control': isHtml ? 'no-store, no-cache, must-revalidate' : 'no-cache',
            // Hybrid CSP - vendored CSS/JS offline + allow Unsplash banners when online, with local fallback onerror
            'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; connect-src 'self' ws://127.0.0.1:* ws://localhost:* http://127.0.0.1:* http://localhost:*; img-src 'self' data: blob: https: http:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:"
        };
        if (isHtml) headers['Pragma'] = 'no-cache';
        res.writeHead(200, headers);
        res.end(data);
    });
};

const server = http.createServer((req, res) => {
    let rawPath = req.url.split('?')[0];
    let urlPath;
    try { urlPath = decodeURIComponent(rawPath); } catch { urlPath = rawPath; }
    // Handle LiveServer / VSCode injected WebSocket reload endpoint (e.g. /ws , /src/pages/common/login.html/ws)
    // This is NOT our app's Socket.IO (which is on :5000) - it's the livereload server on :5500/:5501
    // Return 204 to silence "WebSocket connection to ws://.../ws failed: Page entered Back-Forward Cache"
    if (urlPath.endsWith('/ws') || urlPath === '/ws' || urlPath.includes('/ws?')) {
        // If it's a real WebSocket upgrade, just close gracefully
        if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
            res.writeHead(426, { 'Content-Type': 'text/plain' });
            res.end('Upgrade Required - use node server.js (5500) not Live Server');
            return;
        }
        res.writeHead(204, { 'Cache-Control': 'no-store' });
        res.end('');
        return;
    }
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
    if (urlPath === '/' || urlPath === '') {
        res.writeHead(302, { Location: DEFAULT_PAGE, 'Cache-Control': 'no-cache' });
        res.end();
        return;
    }

    // Rewrite legacy "/frontend/..." / "/Frontend/..." paths so that
    // links pointing at the Frontend subfolder still resolve correctly
    // when this server is rooted at the Frontend folder.
    const normalized = urlPath.replace(/^\/+/, '').split('/');
    if (normalized.length > 1 && normalized[0].toLowerCase() === 'frontend') {
        urlPath = '/' + normalized.slice(1).join('/');
    }

    // Robust path resolution - prevent directory traversal but allow normal absolute URLs
    // Use path.resolve and case-insensitive check on Windows
    let filePath = path.resolve(path.join(ROOT, '.' + urlPath));
    const rootResolved = path.resolve(ROOT);
    const isInsideRoot = filePath.toLowerCase().startsWith(rootResolved.toLowerCase());
    if (!isInsideRoot) {
        console.warn(`[403] Blocked traversal attempt: ${req.url} -> ${filePath}`);
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

 // Gracefully handle stray WebSocket upgrade requests (e.g. LiveServer livereload)
// Without this, Chrome logs "WebSocket connection to ws://.../ws failed: Page entered Back-Forward Cache"
server.on('upgrade', (req, socket) => {
    // Our app's real sockets are on backend :5000 (Socket.IO), not here.
    // Just destroy livereload upgrades to silence errors.
    socket.write('HTTP/1.1 426 Upgrade Required\r\n\r\n');
    socket.destroy();
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