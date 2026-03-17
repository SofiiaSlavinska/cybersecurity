const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const args = process.argv.slice(2);
const isBreach = args.includes('--mode') && args[args.indexOf('--mode') + 1] === 'breach1';

app.get('/weather.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    
    if (isBreach) {
        res.send(`alert("HACKED: I can see your cookies: " + document.cookie + " and User: " + document.getElementById('username').innerText);`);
    } else {
        res.send(`console.log("Weather: 72°F and Sunny");`);
    }
});

app.listen(5000, () => {
    console.log(`[System] Starting Utility on Port 5000... (Breach Mode: ${isBreach})`);
});