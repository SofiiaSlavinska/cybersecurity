const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.static('public'));

app.listen(6001, () => console.log('CDN listening on http://localhost:6001'));