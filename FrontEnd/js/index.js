const loginLink = document.getElementsByClassName('login-link');

if (localStorage.getItem('token')) {
  loginLink[0].innerText = 'logout';
}

loginLink[0].addEventListener('click', (event) => {
  if (loginLink[0].innerText === 'logout') {
    event.preventDefault();
    loginLink[0].innerText = 'login';
    localStorage.removeItem('token');
  }
});
