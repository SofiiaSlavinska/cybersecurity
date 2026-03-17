document.cookie = "SessionID=123456";

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