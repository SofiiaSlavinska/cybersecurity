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
        } 
        else if (config.mode === 'mode-mitm-secure') {
            cookieHeader += '; HttpOnly; Secure';
        }

        res.setHeader('Set-Cookie', cookieHeader);
        res.json({ success: true, user: username });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

app.get('/', (req, res) => {
    let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
    res.send(html);
});

app.listen(port, () => console.log(`[App] Port ${port} running in mode: ${JSON.parse(fs.readFileSync('config.json')).mode}`));