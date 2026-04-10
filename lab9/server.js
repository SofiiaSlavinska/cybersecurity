const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let bookings = []; 

function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}

app.post('/book', (req, res) => {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    let { name, surname, email, age, date } = req.body;

    if (config.mode === 'mode-secure') {
        let errors = [];

        if (!name || !surname || !email || !age || !date) errors.push("Всі поля є обов'язковими.");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) errors.push("Неправильний формат email.");

        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) errors.push("Вік має бути від 5 до 100 років.");

        if (isNaN(Date.parse(date))) errors.push("Неправильна або неіснуюча дата.");

        if (errors.length > 0) {
            return res.status(400).send(`<h2> 400 Bad Request</h2><p style="color:red;">${errors.join('<br>')}</p><a href="/">Назад</a>`);
        }

        name = escapeHTML(name);
        surname = escapeHTML(surname);
        email = escapeHTML(email);
    }

    bookings.push({ name, surname, email, age, date });
    console.log("[Server] Отримано нове бронювання:", { name, surname, email, age, date });

    res.send(`
        <h2> Бронювання успішне!</h2>
        <div style="background:#eee; padding:10px;">
            <p><strong>Ім'я:</strong> ${name} ${surname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Вік:</strong> ${age}</p>
            <p><strong>Дата:</strong> ${date}</p>
        </div>
        <br><a href="/">Повернутися назад</a>
    `);
});

app.listen(port, () => console.log(`[Camp Validator] Запущено на http://localhost:${port}`));