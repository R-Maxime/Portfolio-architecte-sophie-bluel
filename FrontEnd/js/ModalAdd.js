import ModalEdit from './ModalEdit.js';
import Api from './api.js';
import Works from './works.js';

const categories = [];
const titleErrorText = 'Veuillez renseigner un titre d\'au moins 3 caractères';
const categoryErrorText = 'Veuillez sélectionner une catégorie';
const fileErrorText = 'Le fichier doit être au format PNG ou JPG.';
const sizeErrorText = 'Le fichier ne doit pas dépasser 4 MO.';

/**
 *  Used to close the add modal on click on the arrow and display the edit modal
 *  Used to close all the modals on click on the close button
 *  @param {Boolean} close - If true, close the modal without add the listeners
 */
function closeAddModal(close) {
  const modal = document.querySelector('.modal');
  const addModalContent = document.querySelector('.add-modal-content');

  if (close) {
    modal.remove();
    addModalContent.remove();
  } else {
    const returnArrow = document.querySelector('.return');
    const closeButton = addModalContent.querySelector('.close');
    const editModalContent = document.querySelector('.edit-modal-content');

    returnArrow.addEventListener('click', () => {
      addModalContent.remove();
      editModalContent.style.display = '';
      displayAddModal();
      ModalEdit.deleteImage();
    });

    closeButton.addEventListener('click', () => {
      modal.remove();
    });
  }
}

/**
 * Used to add the upload button in the add modal
 */
function addUploadButton(addModalContent) {
  addModalContent.innerHTML += `
  <div class="upload-box">
    <img src="./assets/icons/img-icon.png" class="img-icon">
    <img id="add-img-preview" style="display:none;">
    <input type="file" name="add-img" id="add-img">
    <label class="img-text" for="add-img">+ Ajouter photo</label>
    <p>jpg, png : 4mo max</p>
  </div>
  `;
}

/**
 * Used to add the inputs in the add modal (title and category)
 */
async function addInputs(addModalContent) {
  if (!categories.length) {
    const cat = await Api.getCategories();
    categories.push(...cat);
  }

  addModalContent.innerHTML += `
    <div class="input-group">
      <label for="title">Titre :</label>
      <input type="text" id="title" name="title">
      <label for="category">Catégorie :</label>
      <select id="category" name="category">
        <option value="" disabled selected></option>
        ${categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('')}
      </select>
    </div>
  `;
}

/**
 * Remove the error text
 */
function removeErrorText() {
  const errorTexts = document.querySelectorAll('.error-text');
  if (errorTexts.length) {
    Array.from(errorTexts).forEach(errorText => errorText.remove());
  }
}

/**
 * Add and Error text under the input
 * @param {string} documentToSelect
 * @param {string} textToAdd
 */
function addErrorText(documentToSelect, textToAdd) {
  const doc = document.querySelector(documentToSelect);
  removeErrorText();

  const errorText = document.createElement('p');
  errorText.classList.add('error-text');
  errorText.textContent = textToAdd;
  doc.parentNode.insertBefore(errorText, doc.nextSibling);
}

/**
 * Get the title value and check if it's correct
 * @returns {string} title
 */
function listeningTitle() {
  const titleInput = document.querySelector('.input-group input[type="text"]');
  const title = titleInput.value;

  if (title.length > 2) {
    removeErrorText();
    return title;
  }

  titleInput.addEventListener('input', () => {
    removeErrorText();
    if (titleInput.value.length < 3) {
      addErrorText('.input-group input[type="text"]', titleErrorText);
    }
  });
  return false;
}

/**
 * Get the category value
 * @returns {string} category
 */
function listeningCategory() {
  const categoryInput = document.querySelector('.input-group select');
  const category = categoryInput.value;
  if (category) {
    return category;
  }

  categoryInput.addEventListener('change', () => {
    removeErrorText();
  });

  return false;
}
/**
 * Add the preview of the image in the add modal
 * @param {File} file
 */
function addImagePreview(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const imgPreview = document.querySelector('#add-img-preview');
    imgPreview.src = reader.result;
  };
  reader.readAsDataURL(file);
  const uploadBox = document.querySelector('.upload-box');
  for (const children of uploadBox.children) {
    if (children.id !== 'add-img-preview') {
      children.style.display = 'none';
    } else {
      children.style.display = '';
    }
  }
}

/**
 * Reset the modal after validation
 */
function reset() {
  const validationText = document.querySelector('.validation-text');
  if (validationText) {
    validationText.remove();
  }

  const uploadBox = document.querySelector('.upload-box');
  if (uploadBox) {
    for (const children of uploadBox.children) {
      if (children.id !== 'add-img-preview') {
        children.style.display = '';
      } else {
        children.style.display = 'none';
      }
    }
  }

  const inputText = document.querySelector('.input-group input[type="text"]');
  if (inputText) {
    inputText.value = '';
  }

  const inputSelect = document.querySelector('.input-group select');
  if (inputSelect) {
    inputSelect.value = '';
  }
}

/**
 * On validation, send the data to the API and do things if it's ok or not
 * @param {string} title
 * @param {string} category
 * @param {File} file
 */
async function onValidation(title, category, file) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', file);
  const res = await Api.addImages(formData);

  if (res === 'success') {
    const works = await Api.getWorks();
    await Works.addNewestWorks(works);
    await ModalEdit.addNewestWorks(works);
    const validationButton = document.querySelector('.validation');
    const validationText = '<p class="validation-text">Image ajoutée avec succès !</p>';
    validationButton.insertAdjacentHTML('afterend', validationText);
    setTimeout(() => {
      reset();
    }, 2000);
  } else {
    addErrorText('.validation', `Une erreur est survenue (${res})`);
  }
}

function listeningButton() {
  listeningTitle(); // Start listening title for prevent user if length < 3

  const fileInput = document.querySelector('#add-img');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const allowedExtensions = ['jpg', 'png'];
    const maxSize = 4 * 1024 * 1024; // 4 MO

    if (!allowedExtensions.includes(file.name.split('.').pop().toLowerCase())) {
      addErrorText('.upload-box', fileErrorText);
      fileInput.value = '';
      return;
    }

    if (file.size > maxSize) {
      addErrorText('.upload-box', sizeErrorText);
      fileInput.value = '';
      return;
    }
    addImagePreview(file);

    const validationButton = document.querySelector('.validation');
    validationButton.disabled = false;
    removeErrorText();

    validationButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const title = listeningTitle();
      const category = listeningCategory();

      if (!title && !document.querySelector('.error-text')) {
        addErrorText('.input-group input[type="text"]', titleErrorText);
        return;
      }

      if (!category) {
        addErrorText('.input-group select', categoryErrorText);
        return;
      }

      if (title && category) {
        await onValidation(title, category, file);
      }
    });
  });
}

/**
 * Used to generate the edit modal, call the addImages and closeModal functions
 */
async function generateAddModal() {
  const editModalContent = document.querySelector('.edit-modal-content');
  editModalContent.style.display = 'none';
  const modal = document.querySelector('.modal');
  modal.innerHTML += `
    <div class="add-modal-content">
      <i class="fa-solid fa-arrow-left return"></i>
       <span class="close">&times;</span>
      <h3>Ajout photo</h3>
    </div>
  `;
  const addModalContent = document.querySelector('.add-modal-content');
  addUploadButton(addModalContent);
  await addInputs(addModalContent);
  addModalContent.innerHTML += '<hr>';
  addModalContent.innerHTML += '<button class="validation button"disabled=true>Valider</button>';
  listeningButton();
  closeAddModal();
}

/**
 * Used to display the add modal on click on the edit button
 */
function displayAddModal() {
  const editButtons = document.querySelector('.add-image');
  editButtons.addEventListener('click', () => {
    generateAddModal();
  });
}

export default {
  displayAddModal
};
