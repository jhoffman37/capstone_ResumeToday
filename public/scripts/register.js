Document.querySelector('#loginSubmit').addEventListener('submit', async (e) => {
    const errorMessage = Document.querySelector('#error');

    e.preventDefault();
    const firstName = Document.querySelector('#firstName').value;
    const lastName = Document.querySelector('#lastName').value;
    const username = Document.querySelector('#username').value;
    const password = Document.querySelector('#password').value;
    const data =
        { first_name: firstName, last_name: lastName, username, password };

    const resp = await fetch('/register', {
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
