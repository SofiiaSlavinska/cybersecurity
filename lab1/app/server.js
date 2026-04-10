const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const version = fs.readFileSync('version.txt', 'utf8').trim();

console.log(`[System] Starting ${config.appName} v${version}...`);

if (config.mode === 'mode1') {
    app.use(cors());
}

app.use(express.static('public'));

app.get('/api/emails', (req, res) => {
    res.json([
        { sender: "boss@company.com", subject: "Urgent", body: "Please review the attached documents." },
        { sender: "hr@company.com", subject: "Welcome", body: "Welcome to SecureMail Pro!" }
    ]);
});

app.listen(3000, () => console.log('GoodHost listening on http://localhost:3000'));