// Stable IDs are the integration contract; labels are presentation content.
const entries = (rows) => Object.freeze(rows.map(([id, label]) => Object.freeze({ id, label })));

export const catalogs = Object.freeze({
  genre: entries([
    ['platformer', 'Платформер'], ['puzzle', 'Головоломка'],
    ['adventure', 'Приключение'], ['rpg', 'Ролевая игра'],
    ['strategy', 'Стратегия'], ['tactics', 'Тактика'],
    ['racing', 'Гонки'], ['horror', 'Ужасы'],
    ['stealth', 'Стелс'], ['survival', 'Выживание'],
    ['rhythm', 'Ритм-игра'], ['simulation', 'Симулятор'],
    ['arcade', 'Аркада'], ['quest', 'Квест'],
    ['detective', 'Детектив'], ['fighting', 'Файтинг'],
    ['shooter', 'Шутер'], ['sport', 'Спортивная игра'],
    ['visual-novel', 'Визуальная новелла'], ['tower-defense', 'Защита башни'],
    ['endless-runner', 'Бесконечный раннер'],
    ['metroidvania', 'Метроидвания'],
    ['roguelike', 'Рогалик'],
    ['bullet-hell', 'Дождь из пуль'],
    ['beat-em-up', 'Драка с толпой'],
    ['arena-battler', 'Бои на арене'],
    ['artillery', 'Артиллерийская дуэль'],
    ['pinball', 'Пинбол'],
    ['breakout', 'Разбивание кирпичей'],
    ['snake', 'Змейка'],
    ['falling-blocks', 'Падающие блоки'],
    ['match-three', 'Три в ряд'],
    ['sokoban', 'Сокобан'],
    ['hidden-object', 'Поиск предметов'],
    ['escape-room', 'Побег из комнаты'],
    ['jigsaw', 'Сборка мозаики'],
    ['word-game', 'Словесная игра'],
    ['trivia', 'Викторина'],
    ['memory-game', 'Игра на запоминание'],
    ['social-deduction', 'Поиск предателя'],
    ['card-solitaire', 'Карточный пасьянс'],
    ['dice-game', 'Игра в кости'],
    ['board-game', 'Настольная игра'],
    ['turn-based-duel', 'Пошаговая дуэль'],
    ['real-time-management', 'Менеджер в реальном времени'],
    ['city-builder', 'Градостроительная игра'],
    ['factory-game', 'Фабрика'],
    ['farming-game', 'Фермерская игра'],
    ['cooking-game', 'Кулинарная игра'],
    ['fishing-game', 'Рыбалка'],
    ['pet-care', 'Уход за питомцем'],
    ['trading-game', 'Торговая игра'],
    ['incremental', 'Игра с накоплением дохода'],
    ['typing-game', 'Игра на скорость печати'],
    ['flight-game', 'Лётная игра'],
    ['sailing-game', 'Парусная регата'],
    ['minigolf', 'Мини-гольф'],
    ['billiards', 'Бильярд'],
    ['programming-puzzle', 'Задачи на программирование'],
    ['interactive-fiction', 'Текстовое приключение'],
  ]),
  mechanic: entries([
    ['time-rewind', 'Перемотка времени'], ['gravity-switch', 'Смена гравитации'],
    ['cloning', 'Создание клонов'], ['crafting', 'Создание предметов'],
    ['deck-building', 'Сборка колоды'], ['shape-shift', 'Смена формы'],
    ['possession', 'Вселение в персонажей'], ['portals', 'Создание порталов'],
    ['light-control', 'Управление светом'], ['sound-navigation', 'Навигация по звуку'],
    ['resource-trade', 'Обмен ресурсами'], ['terrain-change', 'Изменение ландшафта'],
    ['chain-reaction', 'Цепные реакции'], ['word-combining', 'Сочетание слов'],
    ['magnetism', 'Притяжение магнитом'], ['route-programming', 'Программирование маршрута'],
    ['object-growing', 'Выращивание объектов'], ['memory-replay', 'Повтор записанных действий'],
    ['size-change', 'Изменение размера'], ['negotiation', 'Переговоры с противниками'],
    ['grappling-hook', 'Подтягивание крюком'],
    ['wall-jump', 'Прыжки от стен'],
    ['dash', 'Рывок вперёд'],
    ['ricochet', 'Рикошет снарядов'],
    ['parry', 'Отражение ударов'],
    ['charge-shot', 'Накопление силы выстрела'],
    ['aiming-trajectory', 'Расчёт траектории броска'],
    ['push-blocks', 'Толкание блоков'],
    ['rope-link', 'Связывание объектов верёвкой'],
    ['fluid-routing', 'Перенаправление потоков воды'],
    ['wire-circuits', 'Соединение электрических цепей'],
    ['mirror-beams', 'Отражение лучей зеркалами'],
    ['color-mixing', 'Смешивание цветов'],
    ['pattern-matching', 'Поиск совпадающих узоров'],
    ['sorting', 'Сортировка предметов'],
    ['stack-balancing', 'Балансировка стопки'],
    ['weighing', 'Взвешивание предметов'],
    ['cutting', 'Разрезание объектов'],
    ['stitching', 'Сшивание частей'],
    ['rotation', 'Вращение элементов'],
    ['folding', 'Складывание листа'],
    ['excavation', 'Раскопки слоёв'],
    ['tracking', 'Выслеживание по следам'],
    ['photography', 'Фотографирование целей'],
    ['fingerprint-compare', 'Сравнение отпечатков'],
    ['interrogation', 'Допрос свидетелей'],
    ['bidding', 'Ставки на аукционе'],
    ['worker-assignment', 'Распределение работников'],
    ['inventory-packing', 'Укладка вещей в рюкзак'],
    ['recipe-following', 'Выполнение рецептов'],
    ['heat-control', 'Регулировка температуры'],
    ['watering', 'Полив растений'],
    ['animal-training', 'Обучение животных'],
    ['fishing-timing', 'Подсечка в нужный момент'],
    ['musical-sequence', 'Воспроизведение мелодии'],
    ['breath-control', 'Управление запасом воздуха'],
    ['scent-trails', 'Прокладывание пахучих следов'],
    ['signal-flags', 'Передача сигналов флажками'],
    ['vote-allocation', 'Распределение голосов'],
    ['map-drawing', 'Рисование карты'],
  ]),
  constraint: entries([
    ['one-button', 'Только одна кнопка'], ['no-text', 'Без текста'],
    ['one-room', 'Вся игра в одной комнате'], ['sixty-seconds', 'Раунд длится минуту'],
    ['no-violence', 'Без насилия'], ['two-colors', 'Только два цвета'],
    ['always-moving', 'Нельзя останавливаться'], ['no-jumping', 'Нельзя прыгать'],
    ['shared-health', 'Общее здоровье с врагом'], ['limited-vision', 'Виден только ближний круг'],
    ['one-item', 'Можно нести один предмет'], ['reverse-controls', 'Управление наоборот'],
    ['shrinking-world', 'Мир постепенно сжимается'], ['no-sound', 'Без звука'],
    ['single-life', 'Только одна жизнь'], ['actions-cost-time', 'Каждое действие тратит время'],
    ['fragile-tools', 'Инструменты ломаются после использования'], ['no-direct-control', 'Без прямого управления героем'],
    ['help-enemies', 'Для победы нужно помогать врагам'], ['return-to-start', 'Нужно вернуться к началу'],
    ['fixed-camera', 'Камера неподвижна'],
    ['no-mouse', 'Без мыши'],
    ['mouse-only', 'Управление только мышью'],
    ['no-hud', 'Без индикаторов поверх игры'],
    ['no-numbers', 'Без чисел на экране'],
    ['no-dialogue', 'Без диалогов'],
    ['no-tutorial', 'Обучение только через игру'],
    ['no-randomness', 'Без случайных событий'],
    ['no-enemies', 'Без врагов'],
    ['no-collectibles', 'Без собираемых предметов'],
    ['no-upgrades', 'Без улучшений персонажа'],
    ['no-map', 'Без карты местности'],
    ['no-inventory', 'Без инвентаря'],
    ['no-restart', 'Нельзя начать раунд заново'],
    ['ten-moves', 'На победу даётся десять ходов'],
    ['three-tools', 'Всего три вида инструментов'],
    ['five-objects', 'На поле не более пяти объектов'],
    ['one-opponent', 'Только один соперник'],
    ['two-characters', 'Всего два персонажа'],
    ['single-screen', 'Весь уровень виден на одном экране'],
    ['looping-level', 'Края уровня соединены'],
    ['vertical-world', 'Мир шириной в одну клетку'],
    ['dark-start', 'Каждый раунд начинается в темноте'],
    ['vanishing-path', 'Пройденный путь исчезает'],
    ['finite-fuel', 'Топливо нельзя пополнить'],
    ['no-backtracking', 'Нельзя идти назад'],
    ['one-use-ability', 'Способность доступна один раз за раунд'],
    ['alternating-turns', 'Игрок и мир действуют по очереди'],
    ['stationary-player', 'Герой не покидает стартовую точку'],
    ['indirect-victory', 'Цель достигается руками другого персонажа'],
    ['losing-is-progress', 'Поражение открывает следующий этап'],
    ['protect-object', 'Нужно сохранить хрупкий объект целым'],
    ['leave-no-trace', 'После победы нельзя оставить следов'],
    ['exact-score', 'Для победы нужен точный счёт'],
    ['shared-currency', 'Здоровье служит валютой'],
    ['one-minute-build', 'На подготовку даётся одна минута'],
    ['silent-character', 'Герой не может издавать звуки'],
    ['no-stopping-clock', 'Таймер идёт даже во время выбора'],
    ['same-start', 'Каждый раунд начинается одинаково'],
    ['visible-rules', 'Все правила видны до первого действия'],
  ]),
});

const categories = Object.keys(catalogs);

function validateRandom(random) {
  if (typeof random !== 'function') throw new TypeError('Генератор случайных чисел должен быть функцией');
}

function sample(list, random) {
  const value = random();
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('Случайное значение должно быть числом в диапазоне [0, 1)');
  }
  return list[Math.floor(value * list.length)].id;
}

/** Create an ephemeral three-slot combination with a uniform draw per category. */
export function createCombination(random = Math.random) {
  validateRandom(random);
  return Object.fromEntries(categories.map((category) => [`${category}Id`, sample(catalogs[category], random)]));
}

/** Preserve locked slots; sample uniformly from every other ID in unlocked slots. */
export function shuffleCombination(combination, locks, random = Math.random) {
  validateRandom(random);
  for (const category of categories) {
    if (!catalogs[category].some(({ id }) => id === combination?.[`${category}Id`])) {
      throw new RangeError(`Недопустимый идентификатор категории ${category}`);
    }
    if (typeof locks?.[category] !== 'boolean') {
      throw new TypeError(`Состояние замка ${category} должно быть логическим значением`);
    }
  }
  return Object.fromEntries(categories.map((category) => {
    const field = `${category}Id`;
    const current = combination[field];
    const candidates = catalogs[category].filter(({ id }) => id !== current);
    return [field, locks[category] || candidates.length === 0 ? current : sample(candidates, random)];
  }));
}
