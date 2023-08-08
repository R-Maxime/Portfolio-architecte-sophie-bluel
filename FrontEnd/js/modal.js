import Api from './api.js';

function addImages(works, modal) {
  let gallery = '<div class="gallery">';
  for (let i = 0; i < works.length; i += 1) {
    gallery += `
    <figure>
      ${!i ? '<i class="fa-solid fa-up-down-left-right"></i>' : ''}
        <i class="fa-solid fa-trash-can"></i>
        <img src="${works[i].imageUrl}" alt="${works[i].title}">
        <span>éditer</span>
    </figure>`;
  }
  modal.innerHTML += `${gallery}</div>`;
}

async function generateModal() {
  const works = await Api.getWorks();

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <p>Galerie photo</p>
    </div>
  `;
  const modalContent = modal.querySelector('.modal-content');
  document.body.appendChild(modal);
  addImages(works, modalContent);
  const closeButton = modal.querySelector('.close');
  closeButton.addEventListener('click', () => {
    modal.remove();
  });
}

function displayModal() {
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Bouton "Modifier" cliqué');
      generateModal();
    });
  });
}

export default {
  displayModal
};
