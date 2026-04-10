const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const users = {
    "admin": "password123",
    "john": "smith789"
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

    if (users[username] && users[username] === password) {
        let cookieHeader = `SessionID=token-${username}-123; Path=/`;

        if (config.mode === 'mode-secure') {
            cookieHeader += '; HttpOnly';
        } else if (config.mode === 'mode-path-limit') {
            cookieHeader = `SessionID=token-${username}-123; Path=/api`;
        }

        res.setHeader('Set-Cookie', cookieHeader);
        res.json({ success: true, user: username });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

app.get('/api/emails', (req, res) => {
    res.json([{ sender: "System", subject: "Auth", body: "Secret data only for logged users" }]);
});

app.listen(port, () => console.log(`[App] Port ${port}`));