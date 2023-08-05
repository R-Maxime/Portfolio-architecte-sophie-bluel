import Api from './api.js';

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const login = document.getElementById('login').value.trim();
  const password = document.getElementById('password').value.trim();

  const res = await Api.getUserToken(login, password);
  if (res.message === 'user not found' && !document.querySelector('.error-login')) {
    const submitButton = document.querySelector('input[type="submit"]');
    const errorText = document.createElement('p');
    errorText.className = 'error-login';
    errorText.innerText = 'Erreur dans l’identifiant ou le mot de passe';
    errorText.style.color = 'red';
    submitButton.parentNode.insertBefore(errorText, submitButton);
  } else if (res.token) {
    localStorage.setItem('token', res.token);
    window.location.href = 'index.html';
  }
});
