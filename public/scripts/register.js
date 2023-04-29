document.querySelector('#registerSubmit').addEventListener('click', async (e) => {
    e.preventDefault();

    const errorMessage = document.querySelector('#error');
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const data =
        { first_name: firstName, last_name: lastName, username, password };

    const resp = await fetch('/user/register', {
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
        password.value = '';
    }
});
