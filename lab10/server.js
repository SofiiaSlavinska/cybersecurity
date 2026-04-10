const express = require('express');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new sqlite3.Database('./camp.db');
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, surname TEXT, email TEXT, age INTEGER, date TEXT
    )`);
    db.run(`INSERT INTO bookings (name, email, age) SELECT 'Admin', 'admin@camp.com', 99 WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE name='Admin')`);
    db.run(`INSERT INTO bookings (name, email, age) SELECT 'John', 'john@test.com', 25 WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE name='John')`);
    db.run(`INSERT INTO bookings (name, email, age) SELECT 'Alice', 'alice@test.com', 30 WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE name='Alice')`);
});

app.get('/search-bookings', (req, res) => {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    const searchName = req.query.name;

    if (config.mode === 'mode-vulnerable') {
        const query = "SELECT * FROM bookings WHERE name = '" + searchName + "'";
        console.log("Виконується запит:", query); 
        
        db.all(query, (err, rows) => {
            if (err) return res.send(`Помилка БД: ${err.message}`);
            res.json(rows);
        });
    } 
    else if (config.mode === 'mode-parameterized') {
        const query = "SELECT * FROM bookings WHERE name = ?"; 
        console.log("Виконується безпечний запит:", query, "з параметром:", searchName);
        
        db.all(query, [searchName], (err, rows) => {
            if (err) return res.send(`Помилка БД: ${err.message}`);
            res.json(rows);
        });
    }
    else if (config.mode === 'mode-polp') {
        const readOnlyDb = new sqlite3.Database('./camp.db', sqlite3.OPEN_READONLY);
        
        const query = "SELECT * FROM bookings WHERE name = '" + searchName + "'";
        console.log("[PoLP] Виконується запит від імені обмеженого користувача:", query);
        
        readOnlyDb.exec(query, function(err) {
            if (err) return res.send(`БЛОКУВАННЯ (PoLP): ${err.message}`);
            res.send("Запит виконано (але exec не повертає рядки).");
        });
    }
});

app.post('/book', (req, res) => {
    const { name, surname, email, age, date } = req.body;
    db.run("INSERT INTO bookings (name, surname, email, age, date) VALUES (?, ?, ?, ?, ?)", 
        [name, surname, email, age, date], 
        (err) => {
            if (err) return res.send("Помилка збереження!");
            res.send(`<h2>Збережено в БД!</h2><a href="/">Назад</a>`);
    });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(port, () => console.log(`[Database Lab] Запущено на http://localhost:${port}`));