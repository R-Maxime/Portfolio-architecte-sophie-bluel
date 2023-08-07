import Works from './works.js';

function updatePropertyVisibility(display) {
  const data = document.querySelectorAll('.edit-button');
  data.forEach((element) => {
    element.style.display = display ? 'block' : 'none';
  });

  const filter = document.querySelector('.filters');
  filter.style.display = display ? 'none' : '';
}

function manageToken() {
  updatePropertyVisibility(false);
  const loginLink = document.getElementsByClassName('login-link');

  if (localStorage.getItem('token')) {
    loginLink[0].innerText = 'logout';
    updatePropertyVisibility(true);
  }

  loginLink[0].addEventListener('click', (event) => {
    if (loginLink[0].innerText === 'logout') {
      event.preventDefault();
      loginLink[0].innerText = 'login';
      updatePropertyVisibility(false);
      localStorage.removeItem('token');
    }
  });
}

(async () => {
  if (window.location.pathname === '/FrontEnd/index.html') {
    await Works.displayWorks();
    Works.addButtonListener();
    Works.filterCategory();
    manageToken();
  }
})();
