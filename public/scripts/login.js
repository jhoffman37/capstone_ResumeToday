document.querySelector('#loginSubmit').addEventListener('click', async (e) => {
    e.preventDefault();

    const errorMessage = document.querySelector('#error');
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const data = { username, password };

    const resp = await fetch('/user/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const respJson = await resp.json();

    if (respJson.success) {
        window.location.href = '/';
    } else {
        errorMessage.innerHTML = respJson.msg;
    }
});
