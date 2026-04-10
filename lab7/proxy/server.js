const http = require('http');
const mode = process.argv.includes('--mode') ? process.argv[process.argv.indexOf('--mode') + 1] : 'normal';
const port = 8080;

const server = http.createServer((req, res) => {
    if (mode === 'breach') {
        console.log(`\n[SNIFFER] Перехоплено запит до: ${req.url}`);
        if (req.headers.cookie) {
            console.log(`[SNIFFER] ВРАЗЛИВІСТЬ! Вкрадено Cookie: ${req.headers.cookie}`);
        } else {
            console.log(`[SNIFFER] Cookie відсутні у запиті.`);
        }
    }
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res); 
    });

    proxyReq.on('error', (e) => {
        res.writeHead(500);
        res.end('Proxy Error');
    });

    req.pipe(proxyReq); 
});

server.listen(port, () => {
    console.log(`[Proxy] Запущено на http://localhost:${port} | Режим: ${mode}`);
});