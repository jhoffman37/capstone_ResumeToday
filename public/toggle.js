function toggleMode() {
  var body = document.body;
  var logo = document.querySelector('#logo');

  body.classList.toggle('dark-mode');
  logo.src = body.classList.contains('dark-mode') ? "../ResumeTodayLogo_dark.png" : "../ResumeTodayLogo.png";
  
  var currentMode = body.classList.contains('dark-mode') ? '../site_dark.css' : '../site.css';
  localStorage.setItem('preferredMode', currentMode);

  // Gradual transition to dark mode
  body.classList.add('transition');
  window.setTimeout(function() {
    body.classList.remove('transition');
  }, 1);
}

var toggleBtn = document.getElementById('toggle-btn');
toggleBtn.addEventListener('click', toggleMode);
e