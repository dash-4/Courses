import { courses, categories } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const categoriesList = document.querySelector(".categories");
  const searchInput = document.querySelector(".search__input");
  const loadMoreBtn = document.getElementById("loadMore");

  if (!grid || !categoriesList || !searchInput || !loadMoreBtn) {
    console.error("Не найдены обязательные элементы DOM");
    return;
  }

  let currentCategory = "all";
  let currentSearch = "";
  let displayedCount = 6;

  function renderCategories() {
    categories.forEach(cat => {
      const count = cat.slug === 'all' 
        ? courses.length 
        : courses.filter(c => c.category === cat.slug).length;

      const li = document.createElement('li');
      li.innerHTML = `
        <button class="categories__button ${cat.slug === currentCategory ? 'categories__button--active' : ''}">
          ${cat.name} <span class="categories__count">${count}</span>
        </button>
      `;

      li.addEventListener('click', () => {
        currentCategory = cat.slug;
        displayedCount = 6;
        document.querySelectorAll('.categories__button').forEach(b => b.classList.remove('categories__button--active'));
        li.querySelector('button').classList.add('categories__button--active');
        renderCourses();
      });

      categoriesList.appendChild(li);
    });
  }

  function createCard(course) {
    const categoryInfo = categories.find(c => c.slug === course.category) || categories[0];

    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <div class="card__inner">
        <div class="card__top">
          <img 
            src="${course.image}" 
            alt="${course.author}"
            class="card__photo"
            loading="lazy"
          >
        </div>
        <div class="card__content">
          <div class="card__tag" style="background:${categoryInfo.color}">
            ${categoryInfo.name}
          </div>
          <h3 class="card__title">${course.title}</h3>
          <div class="card__footer">
            <span class="card__price">$${course.price}</span>
            <span class="card__author">| by ${course.author}</span>
          </div>
        </div>
      </div>
    `;

    return card;
  }

  function getFilteredCourses() {
    return courses.filter((course) => {
      const matchesCategory = currentCategory === "all" || course.category === currentCategory;
      const matchesSearch = course.title.toLowerCase().includes(currentSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  function renderCourses() {
    const filtered = getFilteredCourses();
    const toShow = filtered.slice(0, displayedCount);

    grid.innerHTML = "";
    toShow.forEach((course) => grid.appendChild(createCard(course)));

    loadMoreBtn.style.display = displayedCount >= filtered.length ? "none" : "block";
  }

  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.trim();
    displayedCount = 6;
    renderCourses();
  });

  loadMoreBtn.addEventListener("click", () => {
    displayedCount += 6;
    renderCourses();
  });

  renderCategories();
  renderCourses();
});