import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogs, createCombination } from '../src/generator.mjs';
import { createFavoritesStore, FAVORITES_KEY } from '../src/favorites-store.mjs';

function fixture(raw) {
  const data = new Map([['unrelated', 'keep']]);
  if (raw !== undefined) data.set(FAVORITES_KEY, raw);
  return {
    data, readFails: false, writeFails: false, writes: 0,
    getItem(key) { if (this.readFails) throw new Error('read'); return data.get(key) ?? null; },
    setItem(key, value) { this.writes++; if (this.writeFails) throw new Error('write'); data.set(key, value); },
  };
}
const a = () => createCombination(() => 0);
const b = () => createCombination(() => 0.5);

test('1. Durable detached ID and Russian label snapshots', () => {
  const storage = fixture();
  const store = createFavoritesStore(storage);
  const source = a();
  const result = store.save(source);
  assert.equal(result.code, 'saved');
  const expected = structuredClone(result.items);
  assert.equal(expected[0].labels.genre, catalogs.genre[0].label);
  assert.deepEqual(JSON.parse(storage.data.get(FAVORITES_KEY)), { version: 1, items: expected });
  source.genreId = 'puzzle';
  result.items[0].labels.genre = 'changed';
  result.items[0].combination.genreId = 'changed';
  assert.deepEqual(store.load().items, expected);
  assert.deepEqual(createFavoritesStore(storage).load().items, expected);
  // Persisted display labels are historical snapshots, not recomputed on load.
  const document = JSON.parse(storage.data.get(FAVORITES_KEY));
  document.items[0].labels.genre = 'Историческая подпись';
  storage.data.set(FAVORITES_KEY, JSON.stringify(document));
  assert.equal(createFavoritesStore(storage).load().items[0].labels.genre, 'Историческая подпись');
});

test('2. Duplicate, insertion order, durable targeted and absent deletion', () => {
  const storage = fixture();
  const store = createFavoritesStore(storage);
  const savedA = store.save(a()).items[0];
  const writes = storage.writes;
  assert.equal(store.save(a()).code, 'duplicate');
  assert.equal(storage.writes, writes);
  const both = store.save(b()).items;
  assert.equal(both.length, 2);
  assert.deepEqual(both[0], savedA);
  assert.equal(store.remove(savedA.id).code, 'removed');
  const rebuilt = createFavoritesStore(storage);
  assert.deepEqual(rebuilt.load().items, [both[1]]);
  assert.equal(rebuilt.remove(savedA.id).code, 'not-found');
  assert.deepEqual(createFavoritesStore(storage).load().items, [both[1]]);
});

test('3. Empty, malformed, schema, record, read/write failures and recovery', () => {
  const empty = fixture();
  assert.deepEqual(createFavoritesStore(empty).load(), { ok: true, code: 'loaded', items: [] });
  assert.equal(empty.data.has(FAVORITES_KEY), false);
  const validStorage = fixture();
  const record = createFavoritesStore(validStorage).save(a()).items[0];
  const invalid = [
    '{', 'null', '[]', '{}', '{"version":2,"items":[]}', '{"version":1,"items":{}}',
    JSON.stringify({ version: 1, items: [null] }),
    JSON.stringify({ version: 1, items: [{ ...record, id: 'wrong' }] }),
    JSON.stringify({ version: 1, items: [{ ...record, combination: { ...record.combination, genreId: 'unknown' } }] }),
    JSON.stringify({ version: 1, items: [{ ...record, labels: { ...record.labels, genre: '' } }] }),
    JSON.stringify({ version: 1, items: [record, record] }),
  ];
  for (const raw of invalid) {
    const storage = fixture(raw);
    const store = createFavoritesStore(storage);
    assert.equal(store.load().code, 'invalid-data');
    assert.equal(store.save(a()).ok, false);
    assert.equal(store.remove(record.id).code, 'invalid-data');
    assert.equal(storage.data.get(FAVORITES_KEY), raw);
    assert.equal(storage.data.get('unrelated'), 'keep');
    assert.equal(storage.writes, 0);
    storage.data.delete(FAVORITES_KEY); // external repair alone does not unblock writes
    assert.equal(store.save(a()).code, 'invalid-data');
    assert.equal(store.load().code, 'loaded');
    assert.equal(store.save(a()).code, 'saved');
  }
  const storage = fixture();
  const store = createFavoritesStore(storage);
  const previous = store.save(a()).items;
  const raw = storage.data.get(FAVORITES_KEY);
  storage.writeFails = true;
  for (const result of [store.save(b()), store.remove(record.id)]) {
    assert.equal(result.code, 'save-failed');
    assert.equal(result.ok, false);
    assert.deepEqual(result.items, previous);
    assert.equal(storage.data.get(FAVORITES_KEY), raw);
  }
  storage.writeFails = false;
  storage.readFails = true;
  assert.deepEqual(store.load().items, previous);
  assert.equal(store.save(b()).code, 'unavailable');
  assert.equal(createFavoritesStore(storage).remove(record.id).code, 'unavailable');
  storage.readFails = false;
  assert.equal(store.load().code, 'loaded');
  assert.equal(store.save(b()).code, 'saved');
  assert.equal(store.save({}).code, 'invalid-combination');
  assert.equal(store.remove(null).code, 'invalid-id');
  assert.equal(createFavoritesStore(null).load().code, 'unavailable');
  assert.equal(storage.data.get('unrelated'), 'keep');
  storage.data.set(FAVORITES_KEY, '{');
  assert.equal(store.load().code, 'invalid-data');
  assert.equal(store.load().items.length, 2); // retain last good display on corrupt reload
});

// Pinned pre-expansion v1 document: no current catalog-derived labels.
test('4. Pre-expansion v1 snapshot survives new catalog saves and targeted deletion', () => {
  assert.equal(FAVORITES_KEY, 'jam-roulette.favorites.v1');
  const historical = {"id":"platformer|time-rewind|one-button","combination":{"genreId":"platformer","mechanicId":"time-rewind","constraintId":"one-button"},"labels":{"genre":"Платформер","mechanic":"Перемотка времени","constraint":"Только одна кнопка"}};
  const storage = fixture(JSON.stringify({ version: 1, items: [historical] }));
  const store = createFavoritesStore(storage);
  assert.deepEqual(store.load().items, [historical]);
  assert.equal(storage.writes, 0);
  const fresh = { genreId: 'interactive-fiction', mechanicId: 'map-drawing', constraintId: 'visible-rules' };
  const saved = store.save(fresh);
  assert.equal(saved.code, 'saved');
  assert.deepEqual(saved.items[0], historical);
  assert.deepEqual(saved.items[1].combination, fresh);
  assert.equal(store.save(fresh).code, 'duplicate');
  assert.equal(store.remove(historical.id).code, 'removed');
  assert.deepEqual(createFavoritesStore(storage).load().items, [saved.items[1]]);
  assert.equal(JSON.parse(storage.data.get(FAVORITES_KEY)).version, 1);
  assert.equal(storage.data.get('unrelated'), 'keep');
});
