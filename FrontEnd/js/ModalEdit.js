import Api from './api.js';
import ModalAdd from './ModalAdd.js';

/**
 * Used to close the modal on cross click, outside click or escape key
 */
function closeEditModal() {
  const modal = document.querySelector('.modal');
  const closeButton = modal.querySelector('.close');
  closeButton.addEventListener('click', () => {
    modal.remove();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.remove();
    }
  });
}

async function addNewestWorks(works) {
  const gallery = document.querySelector('.edit-modal-content .gallery');

  for (let i = 0; i < works.length; i += 1) {
    const existingFigure = document.querySelector(`.modal .gallery figure[id="${works[i].id}"]`);
    console.log(existingFigure);

    if (!existingFigure) {
      const newFigure = document.createElement('figure');
      newFigure.id = works[i].id;
      newFigure.innerHTML = `    
    <figure id=${works[i].id}>
      ${!i ? '<i class="fa-solid fa-up-down-left-right"></i>' : ''}
        <i class="fa-solid fa-trash-can"></i>
        <img src="${works[i].imageUrl}" alt="${works[i].title}">
        <span>éditer</span>
    </figure>`;
      gallery.appendChild(newFigure);
    }
  }
}

/**
 * Used to add images to the modal
 * @param {Array} works
 * @param {Document} modal
 */
function addImagesToModal(works, modal) {
  let gallery = '<div class="gallery">';
  for (let i = 0; i < works.length; i += 1) {
    gallery += `
    <figure id=${works[i].id}>
      ${!i ? '<i class="fa-solid fa-up-down-left-right"></i>' : ''}
        <i class="fa-solid fa-trash-can"></i>
        <img src="${works[i].imageUrl}" alt="${works[i].title}">
        <span>éditer</span>
    </figure>`;
  }
  modal.innerHTML += `${gallery}</div>`;
}

/**
 * Start the buttons listeners
 * Used to delete an image from the modal, the gallery and the database
 */
function deleteImage() {
  const deleteButtons = document.querySelectorAll('.fa-trash-can');
  const hr = document.querySelector('.modal hr');
  const message = document.createElement('p');

  for (let i = 0; i < deleteButtons.length; i += 1) {
    const button = deleteButtons[i];
    button.addEventListener('click', async () => {
      const image = button.parentNode;
      const res = await Api.deleteImageById(image.id);
      if (!res) {
        message.textContent = 'Une erreur est survenue lors de la suppression de l\'image.';
        message.style.color = 'red';
        message.style.textAlign = 'center';
        hr.parentNode.insertBefore(message, hr);
        setTimeout(() => {
          message.remove();
        }, 2000);
        return;
      }
      const gallery = document.querySelector('#portfolio .gallery');
      for (let j = 0; j < gallery.childNodes.length; j += 1) {
        const child = gallery.childNodes[j];
        if (child.nodeName === 'FIGURE' && child.querySelector('img').id === image.id) {
          image.remove();
          child.remove();
          break;
        }
      }
      message.textContent = 'L\'image a correctement été supprimée.';
      message.style.color = 'green';
      message.style.textAlign = 'center';
      hr.parentNode.insertBefore(message, hr);
      setTimeout(() => {
        message.remove();
      }, 2000);
    });
  }
}

/**
 * Used to delete all the gallery's images from the modal, the gallery and the database
 */
function deleteGallery() {
  const deleteAll = document.querySelector('.delete-gallery');
  deleteAll.addEventListener('click', async () => {
    await Api.deleteAllWorks();
    const gallerys = document.querySelectorAll('.gallery');
    for (const gallery of gallerys) {
      gallery.remove();
    }
  });
}

/**
 * Used to generate the edit modal, call the addImages and closeModal functions
 */
async function generateEditModal() {
  const works = await Api.getWorks();

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="edit-modal-content">
      <span class="close">&times;</span>
      <h3>Galerie photo</h3>
    </div>
  `;
  const modalContent = modal.querySelector('.edit-modal-content');
  document.body.appendChild(modal);
  addImagesToModal(works, modalContent);
  modalContent.innerHTML += '<hr>';
  modalContent.innerHTML += '<button class="add-image button"><span>Ajouter une image</span></button>';
  modalContent.innerHTML += '<span class="delete-gallery">Supprimer la galerie</span>';
  closeEditModal();
  deleteImage();
  deleteGallery();
  ModalAdd.displayAddModal();
}

/**
 * Used to display the edit modal on click on the edit button
 */
function displayEditModal() {
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      generateEditModal();
    });
  });
}

export default {
  displayEditModal,
  addNewestWorks,
  deleteImage
};
