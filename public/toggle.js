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

    // Add 'hidden' attribute to body
    document.body.setAttribute('hidden', '');

    // Remove 'hidden' attribute after 5ms
    setTimeout(function() {
      document.body.removeAttribute('hidden');
    }, 5);

  cssMode.setAttribute('href', newMode);
  localStorage.setItem('preferredMode', newMode);
}

var toggleBtn = document.getElementById('toggle-btn');
toggleBtn.addEventListener('click', toggleMode);
