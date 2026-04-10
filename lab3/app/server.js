const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const port = 3000;

app.get('/', (req, res) => {
    let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
    
    const sriHash = 'sha256-V8BG0F2dn+ICXHtrz8L/39Qq6eg35k4eWCC041KXIto='; 

    if (config.mode === 'mode-sri-active') {
        html = html.replace(
            '<script src="http://localhost:6000/react-mock.js"></script>',
            `<script src="http://localhost:6000/react-mock.js" integrity="${sriHash}" crossorigin="anonymous"></script>`
        );
    }

    res.send(html);
});

app.get('/emails', (req, res) => {
    res.json([
        { sender: "Admin", subject: "Lab 3 SRI Test", body: "If SRI works, malicious CDN script will be blocked." },
        { sender: "System", subject: "Security Update", body: "Subresource Integrity active." }
    ]);
});

app.listen(port, () => {
    console.log(`[System] Starting ${config.appName} v${config.version} in mode: ${config.mode}`);
});