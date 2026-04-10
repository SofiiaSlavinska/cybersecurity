document.cookie = "SessionID=123456";

fetch('/api/emails')
    .then(res => res.json())
    .then(emails => {
        const sidebar = document.getElementById('sidebar');
        emails.forEach(email => {
            const div = document.createElement('div');
            div.innerText = `${email.sender} - ${email.subject}`;
            div.style.cursor = 'pointer';
            div.style.marginBottom = '10px';
            div.onclick = () => document.getElementById('main-area').innerText = email.body;
            sidebar.appendChild(div);
        });
    });