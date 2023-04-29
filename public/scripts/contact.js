document.querySelector('#contactSubmit').addEventListener('click', async (e) => {
    e.preventDefault();

    const errorMessage = document.querySelector('#error');
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const email = document.querySelector('#email').value;
    const comments = document.querySelector('#comments').value;
    const data =
        { first_name: firstName, last_name: lastName, email, comments };

    const resp = await fetch('/user/contact', {
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
