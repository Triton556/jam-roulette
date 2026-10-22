import { catalogs, createCombination, shuffleCombination } from './generator.mjs';
import { mountFavorites } from './favorites-view.mjs';

const categories = [
  { key: 'genre', label: 'Жанр', emblem: '<path d="M12 3 4 7v8l8 7 8-7V7z"/><path d="M12 7v10M8 11h8"/>' },
  { key: 'mechanic', label: 'Механика', emblem: '<path d="m6 3 4 4-3 3-4-4v6l5 3 7 7 4-4-7-7-3-5z"/>' },
  { key: 'constraint', label: 'Ограничение', emblem: '<path d="M4 4h16l-2 16H6zM8 8l8 8M16 8l-8 8"/>' },
];
const locks = { genre: false, mechanic: false, constraint: false };
let combination = createCombination();
const cards = document.querySelector('.cards');
const shuffle = document.querySelector('.shuffle');
const status = document.querySelector('#status');
const lockIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="shackle" d="M7 11V7a5 5 0 0 1 10 0v4"/><path d="M5 11h14v10H5z"/><path d="M12 15v3"/></svg>';

for (const { key, label, emblem } of categories) {
  const card = document.createElement('article');
  card.className = `card ${key}`;
  card.dataset.category = key;
  card.innerHTML = `<div class="card-inner"><div class="card-heading"><svg class="emblem" viewBox="0 0 24 24" aria-hidden="true">${emblem}</svg><h2>${label}</h2><span class="ordinal" aria-hidden="true">0${categories.findIndex(c => c.key === key) + 1}</span></div><div class="parchment"><span class="ingredient"></span></div><button class="lock" type="button" aria-pressed="false">${lockIcon}<span>Закрепить</span></button></div>`;
  card.querySelector('button').addEventListener('click', () => {
    locks[key] = !locks[key];
    render();
  });
  cards.append(card);
}

function render() {
  for (const { key, label } of categories) {
    const card = cards.querySelector(`[data-category="${key}"]`);
    const entry = catalogs[key].find(entry => entry.id === combination[`${key}Id`]);
    card.querySelector('.ingredient').textContent = entry.label;
    card.dataset.id = entry.id;
    card.dataset.locked = String(locks[key]);
    const button = card.querySelector('button');
    const action = locks[key] ? 'Открепить' : 'Закрепить';
    button.setAttribute('aria-pressed', String(locks[key]));
    button.setAttribute('aria-label', `${action}: ${label}`);
    button.querySelector('span').textContent = action;
  }
  const count = Object.values(locks).filter(Boolean).length;
  shuffle.disabled = count === 3;
  status.textContent = count === 3 ? 'Все карточки закреплены' : count === 0
    ? 'Все три карточки участвуют в перемешивании' : `Закреплено: ${count} из 3. Остальные перемешиваются`;
}

shuffle.addEventListener('click', () => {
  combination = shuffleCombination(combination, locks);
  render();
  for (const { key } of categories) {
    const card = cards.querySelector(`[data-category="${key}"]`);
    card.classList.remove('shuffling');
    if (!locks[key]) {
      void card.offsetWidth;
      card.classList.add('shuffling');
    }
  }
});
cards.addEventListener('animationend', event => event.target.classList.remove('shuffling'));
render();
mountFavorites({
  root: document.querySelector('.favorites'),
  saveButton: document.querySelector('.save-combination'),
  getCombination: () => ({ ...combination }),
});
