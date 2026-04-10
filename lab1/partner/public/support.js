const btn = document.createElement('button');
btn.innerText = "Chat with Support";
btn.style.cssText = "position: fixed; bottom: 20px; right: 20px; padding: 10px;";
btn.onclick = () => {
    fetch('http://localhost:4000/api/messages')
        .then(res => res.json())
        .then(data => alert(data.message))
        .catch(err => console.error("Support Fetch Error:", err));
};
document.body.appendChild(btn);