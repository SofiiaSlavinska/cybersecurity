const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); 
const app = express();

app.use(cors()); 

const publicPath = path.join(__dirname, 'public');
console.log("Static folder path: ", publicPath);

app.use(express.static(publicPath));

app.get('/ping', (req, res) => {
    res.send("The CDN server is alive and receiving requests!");
});

app.get('/debug', (req, res) => {
    const cssPath = path.join(publicPath, 'theme.css');
    const imgPath = path.join(publicPath, 'logo.png');
    
    res.json({
        "Where Node is looking": publicPath,
        "Can Node see theme.css?": fs.existsSync(cssPath),
        "Can Node see logo.png?": fs.existsSync(imgPath)
    });
});

app.listen(6001, () => console.log('[System] Starting CDN on Port 6001...'));