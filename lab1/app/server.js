const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const version = fs.readFileSync('version.txt', 'utf8').trim();

if (config.mode === 'mode1') {
    app.use(cors());
}

app.use(express.static('public'));

app.get('/api/emails', (req, res) => {
    res.json([
        { id: 1, sender: "boss@corp.com", subject: "Urgent", body: "Need those reports." },
        { id: 2, sender: "hr@corp.com", subject: "Party", body: "Pizza at 12!" }
    ]);
});

app.listen(3000, () => {
    console.log(`[System] Starting ${config.appName} v${version} on Port 3000...`);
});