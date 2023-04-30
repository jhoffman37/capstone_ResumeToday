document.querySelector('#logout').addEventListener('click', async (e) => {
  e.preventDefault();
  const confirmLogout = confirm('Are you sure you want to logout?');
  if (!confirmLogout) return;
  const response = await fetch('/user/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  window.location.href = '/';
});
