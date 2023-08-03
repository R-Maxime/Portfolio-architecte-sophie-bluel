import Works from './works.js';

(async () => {
  await Works.displayWorks();
  Works.addButtonListener();
  Works.filterCategory();
})();
