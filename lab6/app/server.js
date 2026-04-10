const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const users = {
    "admin": "password123"
};

const activeSessions = {};

const getSessionId = (req) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/SessionID=([^;]+)/);
    return match ? match[1] : null;
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        const sessionId = `token-${username}-${Date.now()}`;
        activeSessions[sessionId] = { username, createdAt: Date.now() };

        res.setHeader('Set-Cookie', `SessionID=${sessionId}; Path=/; HttpOnly`);
        res.json({ success: true, user: username });
    } else {
        res.status(401).json({ success: false });
    }
});

app.post('/api/logout', (req, res) => {
    const sessionId = getSessionId(req);
    if (sessionId && activeSessions[sessionId]) {
        delete activeSessions[sessionId];
    }
    res.setHeader('Set-Cookie', 'SessionID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    res.json({ success: true });
});

app.get('/api/emails', (req, res) => {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    const sessionId = getSessionId(req);

    if (config.mode === 'mode-zombie') {
        if (sessionId) {
            return res.json([{ sender: "Hacker", subject: "Зомбі Атака!", body: "Я бачу твої дані, бо сервер не перевірив БД сесій." }]);
        }
        return res.status(401).json({ error: "Немає кукі" });
    }

    if (!sessionId || !activeSessions[sessionId]) {
        return res.status(401).json({ error: "401 Unauthorized: Сесія не існує або була закрита." });
    }

    const session = activeSessions[sessionId];

    if (config.mode === 'mode-ttl') {
        const ageInMs = Date.now() - session.createdAt;
        if (ageInMs > 2 * 60 * 1000) { // 2 хв
            delete activeSessions[sessionId]; 
            return res.status(401).json({ error: "401 Unauthorized: Час життя сесії вичерпано (TTL)." });
        }
    }

    res.json([{ sender: "System", subject: "Secure Mode", body: `Вітаю, ${session.username}. Твоя сесія офіційно валідна на сервері.` }]);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(port, () => console.log(`[App] Port ${port} running`));