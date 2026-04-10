const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const isBreach = process.argv.includes('--mode=breach1');

app.get('/weather.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    
    if (isBreach) {
        res.send(`
            setTimeout(() => {
                alert("HACKED: I can see your cookies: " + document.cookie + " and User: " + document.getElementById('username').innerText);
            }, 500);
        `);
    } else {
        res.send(`console.log("Weather App: 72 Degrees and Sunny");`);
    }
});

app.listen(5000, () => console.log(`Utility listening on http://localhost:5000. Breach Mode: ${isBreach}`));