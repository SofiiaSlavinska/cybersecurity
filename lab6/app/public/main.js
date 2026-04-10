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
        alert("Неправильний логін або пароль");
    }
}

//incorrect, only browser
function logoutZombie() {
    document.cookie = "SessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert("Браузер забув кукі. Але сервер ще пам'ятає!");
    location.reload();
}

//correct, browaer and server
async function logoutSecure() {
    await fetch('/api/logout', { method: 'POST' });
    alert("Сесію офіційно знищено на сервері.");
    location.reload();
}

async function fetchEmails() {
    const res = await fetch('/api/emails');
    const data = await res.json();
    document.getElementById('email-list').innerText = res.ok ? JSON.stringify(data, null, 2) : data.error;
}

window.onload = fetchEmails;