const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));

app.get('/api/messages', (req, res) => {
    res.json({ message: "No new support messages." });
});

app.listen(4000, () => console.log('[System] Starting Partner Support on Port 4000...'));