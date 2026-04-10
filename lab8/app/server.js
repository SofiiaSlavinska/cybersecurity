const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https'); 
const http = require('http');  

const app = express();
const HTTP_PORT = 3000;
const HTTPS_PORT = 3443;

app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

const users = { "admin": "password123" };
const activeSessions = {};
let emails = [{ id: 1, sender: "System", subject: "Security Update", body: "Your connection is now encrypted!" }];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] === password) {
        const sessionId = `token-${username}-${Date.now()}`;
        const csrfToken = crypto.randomBytes(16).toString('hex');
        activeSessions[sessionId] = { username, csrfToken };

        let cookieHeader = `SessionID=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict`;

        res.setHeader('Set-Cookie', cookieHeader);
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get('/api/emails', (req, res) => {
    const match = req.headers.cookie && req.headers.cookie.match(/SessionID=([^;]+)/);
    const sessionId = match ? match[1] : null;
    if (!sessionId || !activeSessions[sessionId]) return res.status(401).json({ error: "Unauthorized" });
    
    res.json({ emails, csrfToken: activeSessions[sessionId].csrfToken });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

let options;
try {
    options = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };
} catch (err) {
    console.error("ПОМИЛКА: Файли сертифікатів не знайдені! Виконай команду openssl спочатку.");
    process.exit(1);
}

https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`[Secure Server] Запущено на https://localhost:${HTTPS_PORT}`);
});


http.createServer((req, res) => {
    const httpsUrl = `https://localhost:${HTTPS_PORT}${req.url}`;
    res.writeHead(301, { "Location": httpsUrl });
    res.end();
}).listen(HTTP_PORT, () => {
    console.log(`[Redirect Server] ↪️  Слухаю HTTP на порту ${HTTP_PORT}, перенаправляю на HTTPS`);
});