import Api from './api.js';

function addButtonListener() {
  const buttons = document.querySelectorAll('.filters button');
  console.log(buttons);
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

async function displayWorks() {
  const works = await Api.getWorks();
  const portfolio = document.createElement('section');
  portfolio.id = 'portfolio';
  portfolio.innerHTML = '<h2>Mes projets</h2>';

  const contactSection = document.getElementById('contact');
  const main = document.querySelector('main');

  main.insertBefore(portfolio, contactSection);
  addFiltersButton(works);

  let gallery = '<div class="gallery">';

  for (let i = 0; i < works.length; i += 1) {
    gallery += `
    <figure id="${works[i].category.id}">
      <img src="${works[i].imageUrl}" alt="${works[i].title}">
      <figcaption>${works[i].title}</figcaption>
    </figure>`;
  }

  portfolio.innerHTML += `${gallery}</div>`;
}

function filterCategory() {
  const buttons = document.querySelectorAll('.filters button');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', (event) => {
      const figures = document.querySelectorAll('.gallery figure');

      for (let j = 0; j < figures.length; j += 1) {
        if (figures[j].id !== event.currentTarget.value && event.currentTarget.value !== '0') {
          figures[j].style.display = 'none';
        } else {
          figures[j].style.display = 'block';
        }
      }
    });
  }
}

(async () => {
  await displayWorks();
  addButtonListener();
  filterCategory();
})();
