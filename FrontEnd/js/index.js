import Works from './works.js';
import ModalEdit from './ModalEdit.js';

/**
 *Change the visibility of the edit button and the filter button when user is logged or not
 * @param {Boolean} display
 */
function updatePropertyVisibility(display) {
  const data = document.querySelectorAll('.edit-button');
  data.forEach((element) => {
    element.style.display = display ? 'block' : 'none';
  });

  const filter = document.querySelector('.filters');
  filter.style.display = display ? 'none' : '';

  if (!display) {
    const editBar = document.querySelector('.edit-bar');
    if (editBar) {
      editBar.remove();
    }
  }
}

function addEditDiv() {
  const div = document.createElement('div');
  const header = document.querySelector('header');
  div.classList.add('edit-bar');
  div.innerHTML = '<div class="edition"><i class="fa-regular fa-pen-to-square"></i><span class="edit-text">Mode édition</span></div>';
  div.innerHTML += '<div class="publish">Publier les changements</div>';
  header.parentNode.insertBefore(div, header);
}

/**
 * Function who manage the DOM when user is logged or not
 */
function manageToken() {
  updatePropertyVisibility(false);
  const loginLink = document.getElementsByClassName('login-link');

  if (localStorage.getItem('token')) {
    loginLink[0].innerText = 'logout';
    updatePropertyVisibility(true);
    ModalEdit.displayEditModal();
    addEditDiv();
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

/**
 * Prevent default on the submit button
 */
function manageSubmitButton() {
  const button = document.querySelector('#contact input[type="submit"]');
  button.addEventListener('click', (event) => {
    event.preventDefault();
  });
}

(async () => {
  if (window.location.pathname === '/FrontEnd/index.html') {
    await Works.displayWorks();
    Works.manageButtonStyleOnClick();
    Works.filterCategory();
    manageToken();
    manageSubmitButton();
  }
})();
