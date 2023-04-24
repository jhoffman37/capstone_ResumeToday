Document.querySelector('#loginSubmit').addEventListener('submit', async (e) => {
    const errorMessage = Document.querySelector('#error');

    e.preventDefault();
    const username = Document.querySelector('#username').value;
    const password = Document.querySelector('#password').value;
    const data = { username, password };

    const resp = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const respJson = await resp.json();

    if (respJson.success) {
        const accessToken = respJson.accessToken;
        localStorage.setItem('accessToken', accessToken);
        window.location.href = '/home';
    } else {
        errorMessage.innerHTML = respJson.msg;
    }
});
