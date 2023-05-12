function toggleMode() {
  var cssMode = document.querySelector('#default');
  var logo = document.querySelector('#logo');
  var currentMode = cssMode.getAttribute('href');
  var newMode;

  if (currentMode == '../site.css') {
    newMode = '../site_dark.css';
    logo.src = "../ResumeTodayLogo_dark.png";
  } else {
    newMode = '../site.css';
    logo.src = "../ResumeTodayLogo.png";
  }

  cssMode.setAttribute('href', newMode);
  localStorage.setItem('preferredMode', newMode);

  // Gradual transition to dark mode
  var body = document.body;
  body.classList.add('transition');
  window.setTimeout(function() {
    body.classList.remove('transition');
  }, 1);
}

var toggleBtn = document.getElementById('toggle-btn');
toggleBtn.addEventListener('click', toggleMode);
