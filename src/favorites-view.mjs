import { createFavoritesStore } from './favorites-store.mjs';

/** Bind the persisted snapshot list without coupling storage to the generator. */
export function mountFavorites({ root, saveButton, getCombination, store = createFavoritesStore() }) {
  const list = root.querySelector('.favorites-list');
  const feedback = root.querySelector('[role="status"]');
  const empty = root.querySelector('.favorites-empty');
  const categories = [['genre', 'Жанр'], ['mechanic', 'Механика'], ['constraint', 'Ограничение']];
  let items = [];

  function render() {
    list.replaceChildren();
    empty.hidden = items.length > 0;
    items.forEach((item, index) => {
      const row = document.createElement('li');
      row.className = 'favorite-entry';
      const labels = document.createElement('div');
      labels.className = 'favorite-labels';
      for (const [key, title] of categories) {
        const card = document.createElement('div');
        card.className = `card ${key} favorite-card`;
        const inner = document.createElement('div');
        inner.className = 'card-inner';
        const heading = document.createElement('p');
        heading.className = 'card-heading';
        heading.textContent = `◆ ${title}`;
        const text = document.createElement('div');
        text.className = 'parchment';
        text.textContent = item.labels[key];
        inner.append(heading, text);
        card.append(inner);
        labels.append(card);
      }
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'favorite-delete';
      remove.dataset.id = item.id;
      remove.textContent = 'Удалить';
      remove.setAttribute('aria-label', `Удалить комбинацию ${index + 1}: ${item.labels.genre}, ${item.labels.mechanic}, ${item.labels.constraint}`);
      remove.addEventListener('click', () => {
        const result = store.remove(item.id);
        if (!result.ok) {
          feedback.textContent = 'Не удалось удалить';
          return;
        }
        items = result.items;
        render();
        feedback.textContent = 'Удалено';
        const buttons = list.querySelectorAll('button');
        (buttons[Math.min(index, buttons.length - 1)] || saveButton).focus();
      });
      row.append(labels, remove);
      list.append(row);
    });
  }

  saveButton.addEventListener('click', () => {
    const result = store.save(getCombination());
    if (!result.ok) {
      feedback.textContent = ['unavailable', 'invalid-data'].includes(result.code)
        ? 'Избранное недоступно' : 'Не удалось сохранить';
      return;
    }
    items = result.items;
    render();
    feedback.textContent = result.code === 'duplicate' ? 'Уже в избранном' : 'Сохранено';
  });
  const initial = store.load();
  items = initial.items;
  render();
  if (!initial.ok) {
    empty.hidden = true;
    feedback.textContent = 'Избранное недоступно';
  }
}
