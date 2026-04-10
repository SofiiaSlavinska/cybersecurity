const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 6001;

app.use(cors());

const mode = process.argv.includes('--mode') ? process.argv[process.argv.indexOf('--mode') + 1] : 'normal';

app.get('/react-mock.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    if (mode === 'breach') {
        res.send('alert("CRITICAL: CDN Compromised! Stealing data...");');
    } else {
        res.send('console.log("React v1.0.0 loaded from CDN (Port 6001)");');
    }
});

app.get('/logo.png', (req, res) => res.sendFile(path.join(__dirname, 'public', 'logo.png')));
app.get('/theme.css', (req, res) => res.sendFile(path.join(__dirname, 'public', 'theme.css')));

app.listen(port, () => {
    console.log(`[CDN] Running in ${mode} mode on port ${port}`);
});