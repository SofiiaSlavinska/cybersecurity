async function login() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });
    if (res.ok) location.reload();
    else alert("Login failed");
}

async function fetchEmails() {
    const res = await fetch('/api/emails');
    if (res.ok) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('email-container').style.display = 'block';
        const data = await res.json();
        const list = document.getElementById('email-list');
        data.emails.forEach(e => {
            const li = document.createElement('li');
            li.innerHTML = `<b>${e.sender}</b>: ${e.subject} - ${e.body}`;
            list.appendChild(li);
        });
    }
}
window.onload = fetchEmails;