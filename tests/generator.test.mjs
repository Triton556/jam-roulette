import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogs, createCombination, shuffleCombination } from '../src/generator.mjs';

// Pinned before JB-5; changing catalogs must never rewrite this fixture.
const originalCatalogs = {
  "genre": [
    {
      "id": "platformer",
      "label": "Платформер"
    },
    {
      "id": "puzzle",
      "label": "Головоломка"
    },
    {
      "id": "adventure",
      "label": "Приключение"
    },
    {
      "id": "rpg",
      "label": "Ролевая игра"
    },
    {
      "id": "strategy",
      "label": "Стратегия"
    },
    {
      "id": "tactics",
      "label": "Тактика"
    },
    {
      "id": "racing",
      "label": "Гонки"
    },
    {
      "id": "horror",
      "label": "Ужасы"
    },
    {
      "id": "stealth",
      "label": "Стелс"
    },
    {
      "id": "survival",
      "label": "Выживание"
    },
    {
      "id": "rhythm",
      "label": "Ритм-игра"
    },
    {
      "id": "simulation",
      "label": "Симулятор"
    },
    {
      "id": "arcade",
      "label": "Аркада"
    },
    {
      "id": "quest",
      "label": "Квест"
    },
    {
      "id": "detective",
      "label": "Детектив"
    },
    {
      "id": "fighting",
      "label": "Файтинг"
    },
    {
      "id": "shooter",
      "label": "Шутер"
    },
    {
      "id": "sport",
      "label": "Спортивная игра"
    },
    {
      "id": "visual-novel",
      "label": "Визуальная новелла"
    },
    {
      "id": "tower-defense",
      "label": "Защита башни"
    }
  ],
  "mechanic": [
    {
      "id": "time-rewind",
      "label": "Перемотка времени"
    },
    {
      "id": "gravity-switch",
      "label": "Смена гравитации"
    },
    {
      "id": "cloning",
      "label": "Создание клонов"
    },
    {
      "id": "crafting",
      "label": "Создание предметов"
    },
    {
      "id": "deck-building",
      "label": "Сборка колоды"
    },
    {
      "id": "shape-shift",
      "label": "Смена формы"
    },
    {
      "id": "possession",
      "label": "Вселение в персонажей"
    },
    {
      "id": "portals",
      "label": "Создание порталов"
    },
    {
      "id": "light-control",
      "label": "Управление светом"
    },
    {
      "id": "sound-navigation",
      "label": "Навигация по звуку"
    },
    {
      "id": "resource-trade",
      "label": "Обмен ресурсами"
    },
    {
      "id": "terrain-change",
      "label": "Изменение ландшафта"
    },
    {
      "id": "chain-reaction",
      "label": "Цепные реакции"
    },
    {
      "id": "word-combining",
      "label": "Сочетание слов"
    },
    {
      "id": "magnetism",
      "label": "Притяжение магнитом"
    },
    {
      "id": "route-programming",
      "label": "Программирование маршрута"
    },
    {
      "id": "object-growing",
      "label": "Выращивание объектов"
    },
    {
      "id": "memory-replay",
      "label": "Повтор записанных действий"
    },
    {
      "id": "size-change",
      "label": "Изменение размера"
    },
    {
      "id": "negotiation",
      "label": "Переговоры с противниками"
    }
  ],
  "constraint": [
    {
      "id": "one-button",
      "label": "Только одна кнопка"
    },
    {
      "id": "no-text",
      "label": "Без текста"
    },
    {
      "id": "one-room",
      "label": "Вся игра в одной комнате"
    },
    {
      "id": "sixty-seconds",
      "label": "Раунд длится минуту"
    },
    {
      "id": "no-violence",
      "label": "Без насилия"
    },
    {
      "id": "two-colors",
      "label": "Только два цвета"
    },
    {
      "id": "always-moving",
      "label": "Нельзя останавливаться"
    },
    {
      "id": "no-jumping",
      "label": "Нельзя прыгать"
    },
    {
      "id": "shared-health",
      "label": "Общее здоровье с врагом"
    },
    {
      "id": "limited-vision",
      "label": "Виден только ближний круг"
    },
    {
      "id": "one-item",
      "label": "Можно нести один предмет"
    },
    {
      "id": "reverse-controls",
      "label": "Управление наоборот"
    },
    {
      "id": "shrinking-world",
      "label": "Мир постепенно сжимается"
    },
    {
      "id": "no-sound",
      "label": "Без звука"
    },
    {
      "id": "single-life",
      "label": "Только одна жизнь"
    },
    {
      "id": "actions-cost-time",
      "label": "Каждое действие тратит время"
    },
    {
      "id": "fragile-tools",
      "label": "Инструменты ломаются после использования"
    },
    {
      "id": "no-direct-control",
      "label": "Без прямого управления героем"
    },
    {
      "id": "help-enemies",
      "label": "Для победы нужно помогать врагам"
    },
    {
      "id": "return-to-start",
      "label": "Нужно вернуться к началу"
    }
  ]
};

const categories = ['genre', 'mechanic', 'constraint'];
const fixture = (values) => {
  let index = 0;
  return () => {
    assert.ok(index < values.length, 'Unexpected random draw');
    return values[index++];
  };
};
const unlocked = { genre: false, mechanic: false, constraint: false };

test('1. Catalogs and deterministic initialization', () => {
  assert.deepEqual(Object.keys(catalogs), categories);
  const allIds = [];
  for (const category of categories) {
    const list = catalogs[category];
    assert.equal(list.length, 60);
    assert.deepEqual(list.slice(0, 20), originalCatalogs[category]);
    assert.equal(new Set(list.map(({ id }) => id)).size, 60);
    assert.equal(new Set(list.map(({ label }) => label)).size, 60);
    for (const { id, label } of list) {
      assert.match(id, /^[a-z][a-z0-9-]*$/);
      assert.match(label, /[А-Яа-яЁё]/u);
      assert.equal(label, label.trim());
      allIds.push(id);
    }
  }
  assert.equal(new Set(allIds).size, 180);
  assert.equal(catalogs.genre.length * catalogs.mechanic.length * catalogs.constraint.length, 216000);
  const values = [0, 0.5, 1 - Number.EPSILON];
  const result = createCombination(fixture(values));
  assert.deepEqual(result, createCombination(fixture(values)));
  assert.deepEqual(result, {
    genreId: catalogs.genre[0].id,
    mechanicId: catalogs.mechanic[30].id,
    constraintId: catalogs.constraint[59].id,
  });
  for (let index = 0; index < 60; index++) {
    const combination = createCombination(() => (index + 0.5) / 60);
    for (const category of categories) assert.equal(combination[`${category}Id`], catalogs[category][index].id);
  }
  assert.equal(Object.keys(createCombination()).length, 3);
});

test('2. All eight lock masks, boundaries, uniform candidate coverage and immutability', () => {
  for (let currentIndex = 0; currentIndex < 60; currentIndex++) {
    const combination = Object.freeze(Object.fromEntries(categories.map((category) => [`${category}Id`, catalogs[category][currentIndex].id])));
    for (let mask = 0; mask < 8; mask++) {
      const locks = Object.freeze(Object.fromEntries(categories.map((category, index) => [category, Boolean(mask & (1 << index))])));
      const before = { ...combination };
      for (const value of [0, 1 - Number.EPSILON, 0.5]) {
        let draws = 0;
        const result = shuffleCombination(combination, locks, () => { draws++; return value; });
        assert.equal(draws, categories.filter((category) => !locks[category]).length);
        for (const category of categories) {
          const field = `${category}Id`;
          assert.ok(catalogs[category].some(({ id }) => id === result[field]));
          if (locks[category]) assert.equal(result[field], combination[field]);
          else assert.notEqual(result[field], combination[field]);
        }
        if (mask === 7) assert.deepEqual(result, combination);
        assert.deepEqual(combination, before);
        assert.deepEqual(locks, Object.fromEntries(categories.map((category, index) => [category, Boolean(mask & (1 << index))])));
      }
    }
    // Every equal-width sampling bucket reaches exactly one eligible ID.
    const seen = Object.fromEntries(categories.map((category) => [category, new Set()]));
    for (let bucket = 0; bucket < 59; bucket++) {
      const result = shuffleCombination(combination, unlocked, () => (bucket + 0.5) / 59);
      for (const category of categories) seen[category].add(result[`${category}Id`]);
    }
    for (const category of categories) {
      assert.deepEqual([...seen[category]], catalogs[category].filter((_, index) => index !== currentIndex).map(({ id }) => id));
    }
  }
});

test('3. Explicit validation failures for IDs, random values and malformed inputs', () => {
  const combination = createCombination(() => 0);
  for (const category of categories) {
    for (const invalid of ['missing-id', '', null, undefined, 7, catalogs[categories.find((other) => other !== category)][0].id]) {
      const input = { ...combination, [`${category}Id`]: invalid };
      for (const locks of [unlocked, { genre: true, mechanic: true, constraint: true }]) {
        assert.throws(() => shuffleCombination(input, locks, () => 0), { name: 'RangeError', message: /идентификатор/ });
      }
    }
  }
  for (const invalid of [-0.01, 1, 2, NaN, Infinity, -Infinity, '0.5', null, undefined]) {
    assert.throws(() => createCombination(() => invalid), { name: 'RangeError', message: /\[0, 1\)/ });
    for (let draw = 0; draw < 3; draw++) {
      const values = [0, 0, 0];
      values[draw] = invalid;
      assert.throws(() => shuffleCombination(combination, unlocked, fixture(values)), RangeError);
      assert.throws(() => createCombination(fixture(values)), RangeError);
    }
  }
  assert.throws(() => createCombination(null), TypeError);
  assert.throws(() => shuffleCombination(null, unlocked), RangeError);
  assert.throws(() => shuffleCombination(combination, null), TypeError);
  assert.throws(() => shuffleCombination(combination, { ...unlocked, genre: 1 }), TypeError);
  assert.deepEqual(shuffleCombination(combination, { genre: true, mechanic: true, constraint: true }, () => { throw new Error('Must not draw'); }), combination);
});
