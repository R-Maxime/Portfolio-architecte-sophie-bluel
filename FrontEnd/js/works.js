import Api from './api.js';

/**
 * Manage the button style when clicked or not
 */
function manageButtonStyleOnClick() {
  const buttons = document.querySelectorAll('.filters button');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', (event) => {
      buttons.forEach((btn) => {
        btn.classList.remove('active');
      });

      if (event.currentTarget.classList.contains('active')) {
        event.currentTarget.classList.remove('active');
      } else {
        event.currentTarget.classList.add('active');
      }
    });
  }
}
/**
 * Function who add filters button with the categories get in the Works
 * @param {Array} works
 */
function addFiltersButton(works) {
  const categories = [{ id: 0, name: 'Tous' }];

  for (let i = 0; i < works.length; i += 1) {
    if (!categories.some((e) => e.id === works[i].category.id)) {
      categories.push(works[i].category);
    }
  }

  const portfolio = document.getElementById('portfolio');
  const filters = document.createElement('div');
  filters.className = 'filters';
  portfolio.appendChild(filters);
  for (let i = 0; i < categories.length; i += 1) {
    filters.innerHTML += `<button value="${categories[i].id}" ${!i ? 'class="active"' : ''}><span>${categories[i].name}</span></button>`;
  }
}

/**
 * Function who generates the portfolio section with the works get in the API
 */
async function displayWorks() {
  const works = await Api.getWorks();
  const portfolio = document.createElement('section');
  portfolio.id = 'portfolio';
  portfolio.innerHTML = `
  <div class="projects">
      <h2>Mes projets</h2>
      <div class="edit-button">
      <i class="fa-solid fa-pen-to-square"></i>
      <span>Modifier</span>
      </div>
  </div>`;

  const contactSection = document.getElementById('contact');
  const main = document.querySelector('main');

  main.insertBefore(portfolio, contactSection);
  addFiltersButton(works);

  let gallery = '<div class="gallery">';

  for (let i = 0; i < works.length; i += 1) {
    gallery += `
    <figure id="${works[i].category.id}">
      <img src="${works[i].imageUrl}" alt="${works[i].title}" id=${works[i].id}>
      <figcaption>${works[i].title}</figcaption>
    </figure>`;
  }

  portfolio.innerHTML += `${gallery}</div>`;
}

/**
 * Function who add the newest works in the portfolio section
 */
async function addNewestWorks(works) {
  const gallery = document.querySelector('.gallery');

  for (let i = 0; i < works.length; i += 1) {
    const existingFigure = document.getElementById(works[i].id);

    if (!existingFigure) {
      const newFigure = document.createElement('figure');
      newFigure.id = works[i].id;
      newFigure.innerHTML = `
        <img src="${works[i].imageUrl}" alt="${works[i].title}" id=${works[i].id}>
        <figcaption>${works[i].title}</figcaption>
      `;
      gallery.appendChild(newFigure);
    }
  }
}

/**
 * Function who filter the works by category
 */
function filterCategory() {
  const buttons = document.querySelectorAll('.filters button');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', (event) => {
      const figures = document.querySelectorAll('.gallery figure');
      const targetValue = event.currentTarget.value;

      for (let j = 0; j < figures.length; j += 1) {
        if (figures[j].id !== targetValue && targetValue !== '0') {
          figures[j].style.display = 'none';
          continue;
        }
        figures[j].style.display = 'block';
      }
    });
  }
}

export default {
  displayWorks,
  manageButtonStyleOnClick,
  filterCategory,
  addNewestWorks
};
