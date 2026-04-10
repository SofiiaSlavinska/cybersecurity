fetch('/api/emails')
    .then(res => res.json())
    .then(emails => {
        const list = document.getElementById('email-list');
        emails.forEach(email => {
            let li = document.createElement('li');
            li.innerText = `${email.sender} - ${email.subject}`;
            li.style.cursor = 'pointer';
            li.onclick = () => {
                document.getElementById('email-body').innerText = email.body;
            };
            list.appendChild(li);
        });
    });
	
async function login() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    
    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });
    
    if (res.ok) {
        alert("Успішний вхід! Оновлюю сторінку...");
        location.reload(); 
    } else {
        alert("Помилка! Неправильний логін або пароль.");
    }
}