const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const users = { "admin": "password123" };
const activeSessions = {};

let emails = [
    { id: 1, sender: "Boss", subject: "Salary", body: "You get a raise!" },
    { id: 2, sender: "Spam", subject: "Free items", body: "Click here" }
];

const getSessionId = (req) => {
    const match = req.headers.cookie && req.headers.cookie.match(/SessionID=([^;]+)/);
    return match ? match[1] : null;
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

    if (users[username] === password) {
        const sessionId = `token-${username}-${Date.now()}`;
        const csrfToken = crypto.randomBytes(16).toString('hex');

        activeSessions[sessionId] = { username, csrfToken };

        let cookieHeader = `SessionID=${sessionId}; Path=/; HttpOnly`;


        if (config.mode === 'mode-samesite') {
            cookieHeader += '; SameSite=Strict'; 
        }

        res.setHeader('Set-Cookie', cookieHeader);
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});


app.get('/api/emails', (req, res) => {
    const sessionId = getSessionId(req);
    if (!sessionId || !activeSessions[sessionId]) return res.status(401).json({ error: "Unauthorized" });

    res.json({
        emails: emails,
        csrfToken: activeSessions[sessionId].csrfToken 
    });
});


app.get('/api/emails/delete/:id', (req, res) => {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    if (config.mode === 'mode-csrf') return res.status(405).send("GET not allowed. Use POST.");

    const sessionId = getSessionId(req);
    if (!sessionId || !activeSessions[sessionId]) return res.status(401).send("Unauthorized");

    emails = emails.filter(e => e.id !== parseInt(req.params.id));
    console.log(`[Server] Email ${req.params.id} deleted via GET!`);
    res.send("Email deleted");
});


app.post('/api/emails/delete/:id', (req, res) => {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    const sessionId = getSessionId(req);
    if (!sessionId || !activeSessions[sessionId]) return res.status(401).send("Unauthorized");

    if (config.mode === 'mode-csrf') {
        const clientToken = req.headers['x-csrf-token']; 
        if (!clientToken || clientToken !== activeSessions[sessionId].csrfToken) {
            console.log(`[Server] CSRF Attack Blocked! Invalid Token.`);
            return res.status(403).send("Forbidden: Invalid CSRF Token");
        }
    }

    emails = emails.filter(e => e.id !== parseInt(req.params.id));
    console.log(`[Server] Email ${req.params.id} deleted securely!`);
    res.send("Email deleted securely");
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(port, () => console.log(`[App] Port ${port} running`));