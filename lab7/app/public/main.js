let currentCsrfToken = "";

async function login() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });
    if (res.ok) {
        location.reload();
    } else {
        alert("Login failed");
    }
}

async function fetchEmails() {
    const res = await fetch('/api/emails');
    if (res.ok) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('email-container').style.display = 'block';
        
        const data = await res.json();
        currentCsrfToken = data.csrfToken; 
        
        const list = document.getElementById('email-list');
        list.innerHTML = "";
        data.emails.forEach(e => {
            const li = document.createElement('li');
            li.innerHTML = `[ID: ${e.id}] <b>${e.sender}</b>: ${e.subject} 
            <button onclick="deleteEmailVulnerable(${e.id})" style="color:red">Delete (GET)</button>
            <button onclick="deleteEmailSecure(${e.id})" style="color:green">Delete (POST+CSRF)</button>`;
            list.appendChild(li);
        });
    }
}

async function deleteEmailVulnerable(id) {
    await fetch(`/api/emails/delete/${id}`);
    fetchEmails();
}

async function deleteEmailSecure(id) {
    await fetch(`/api/emails/delete/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': currentCsrfToken 
        }
    });
    fetchEmails();
}

window.onload = fetchEmails;