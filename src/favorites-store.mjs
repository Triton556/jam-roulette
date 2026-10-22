import { catalogs } from './generator.mjs';

export const FAVORITES_KEY = 'jam-roulette.favorites.v1';
const categories = Object.keys(catalogs);
const copy = (value) => JSON.parse(JSON.stringify(value));
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function snapshot(combination) {
  const ids = {};
  const labels = {};
  for (const category of categories) {
    const field = `${category}Id`;
    const entry = catalogs[category].find(({ id }) => id === combination?.[field]);
    if (!entry) throw new Error('Недопустимая комбинация');
    ids[field] = entry.id;
    labels[category] = entry.label;
  }
  return { id: categories.map((key) => ids[`${key}Id`]).join('|'), combination: ids, labels };
}

function decode(raw) {
  if (raw === null) return [];
  const document = JSON.parse(raw);
  if (!object(document) || document.version !== 1 || !Array.isArray(document.items)) throw new Error('Недопустимый формат избранного');
  const seen = new Set();
  return document.items.map((item) => {
    if (!object(item) || !object(item.combination) || !object(item.labels)) throw new Error('Недопустимая запись');
    const expected = snapshot(item.combination);
    if (item.id !== expected.id || seen.has(item.id) || categories.some((key) => typeof item.labels[key] !== 'string' || !item.labels[key].trim())) {
      throw new Error('Недопустимая запись');
    }
    seen.add(item.id);
    return { id: item.id, combination: expected.combination, labels: Object.fromEntries(categories.map((key) => [key, item.labels[key]])) };
  });
}

/**
 * Synchronous API: createFavoritesStore(storage?) -> {load, save, remove}.
 * Inject a localStorage-compatible {getItem, setItem}; omitted storage uses browser
 * localStorage lazily, so denied access is returned as unavailable, never thrown.
 * Every outcome is {ok, code, items, message?}; items are detached snapshots.
 * load(): loaded | invalid-data | unavailable. Failed loads retain last good items
 * and block writes until an explicit load() succeeds after external repair.
 * save(combination): saved | duplicate | invalid-combination, plus failure codes.
 * remove(id): removed | not-found | invalid-id, plus failure codes.
 * Writes return save-failed on setItem errors, preserving last displayed items.
 * Both mutations implicitly load on first use; neither silently refreshes later.
 * No operation clears storage. Concurrent-tab conflict resolution is not provided.
 */
export function createFavoritesStore(storage) {
  let items = [];
  let initialized = false;
  let blocked = null;
  const resolveStorage = () => storage === undefined ? globalThis.localStorage : storage;
  const outcome = (ok, code, message) => ({ ok, code, items: copy(items), ...(message ? { message } : {}) });

  function load() {
    initialized = true;
    let raw;
    try {
      raw = resolveStorage().getItem(FAVORITES_KEY);
    } catch {
      blocked = ['unavailable', 'Хранилище недоступно'];
      return outcome(false, ...blocked);
    }
    try {
      items = decode(raw);
      blocked = null;
      return outcome(true, 'loaded');
    } catch {
      blocked = ['invalid-data', 'Данные избранного повреждены. Исправьте их перед сохранением'];
      return outcome(false, ...blocked);
    }
  }

  function ready() {
    if (!initialized) load();
    return blocked ? outcome(false, ...blocked) : null;
  }

  function persist(next, code) {
    try {
      resolveStorage().setItem(FAVORITES_KEY, JSON.stringify({ version: 1, items: next }));
    } catch {
      return outcome(false, 'save-failed', 'Не удалось сохранить изменения');
    }
    items = next;
    return outcome(true, code);
  }

  function save(combination) {
    const failure = ready();
    if (failure) return failure;
    let item;
    try { item = snapshot(combination); } catch {
      return outcome(false, 'invalid-combination', 'Недопустимая комбинация');
    }
    if (items.some(({ id }) => id === item.id)) return outcome(true, 'duplicate');
    return persist([...items, item], 'saved');
  }

  function remove(id) {
    const failure = ready();
    if (failure) return failure;
    if (typeof id !== 'string' || !id) return outcome(false, 'invalid-id', 'Недопустимый идентификатор');
    if (!items.some((item) => item.id === id)) return outcome(true, 'not-found');
    return persist(items.filter((item) => item.id !== id), 'removed');
  }

  return Object.freeze({ load, save, remove });
}
