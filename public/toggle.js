function toggleMode() {
  var body = document.body;
  var logo = document.querySelector('#logo');

  body.classList.toggle('dark-mode');
  logo.src = body.classList.contains('dark-mode') ? "../ResumeTodayLogo_dark.png" : "../ResumeTodayLogo.png";

  // Toggle background and text colors
  var bgColor = body.classList.contains('dark-mode') ? '#000' : '#fff';
  var textColor = body.classList.contains('dark-mode') ? '#fff' : '#000';
  body.style.backgroundColor = bgColor;
  body.style.color = textColor;

  // Update preferred mode in localStorage
  var currentMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('preferredMode', currentMode);

  // Gradual transition to dark mode
  body.classList.add('transition');
  window.setTimeout(function() {
    body.classList.remove('transition');
  }, 1000);
}

var toggleBtn = document.getElementById('toggle-btn');
toggleBtn.addEventListener('click', toggleMode);
