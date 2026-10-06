const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../dist/state.js'), 'utf8');
function visit(saved = {}, blocked = false) {
  const data = new Map(Object.entries(saved));
  const listeners = {};
  const window = {
    addEventListener: (type, fn) => (listeners[type] ||= []).push(fn),
    dispatchEvent: event => (listeners[event.type] || []).forEach(fn => fn(event))
  };
  const localStorage = {
    getItem(key) { if (blocked) throw new Error('denied'); return data.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw new Error('denied'); data.set(key, value); },
    removeItem(key) { if (blocked) throw new Error('denied'); data.delete(key); }
  };
  vm.runInNewContext(source, { window, localStorage, Event: class { constructor(type) { this.type = type; } } });
  return { store: window.webLabState, data, window };
}
const legacy = visit({ 'weblab-kid-name': '  Ștefan  ', 'weblab-completed-tasks': '["name","color","color","unknown"]' });
assert.equal(legacy.store.current.name, 'Ștefan');
assert.equal(legacy.store.current.completed.length, 1);
legacy.store.update({ animal: 'turtle', color: 'mint', tag: 'link' });
assert.equal(legacy.data.has('weblab-kid-name'), false);
const reopened = visit(Object.fromEntries(legacy.data));
assert.equal(reopened.store.current.animal, 'turtle');
assert.equal(reopened.store.current.tag, 'link');
assert.equal(reopened.store.current.completed.length, 1);
reopened.store.reset();
assert.equal(reopened.store.current.name, '');
assert.equal(reopened.store.current.completed.length, 0);
assert.equal(reopened.store.current.color, 'purple');
for (const corrupt of ['{broken', 'null', '7', '{"completed":"wrong"}', '{"color":"evil","animal":"x","tag":"script"}']) {
  const test = visit({ 'weblab-state-v1': corrupt });
  assert.equal(test.store.current.color, 'purple');
  assert.equal(test.store.current.completed.length, 0);
}
const noStorage = visit({}, true);
noStorage.store.update({ name: 'Ana', completed: ['name'] });
assert.equal(noStorage.store.current.name, 'Ana');
assert.equal(noStorage.store.persistent, false);

const lesson = visit();
assert.equal(lesson.store.current.triedColors.length, 0);
assert.equal(lesson.store.current.triedAnimals.length, 0);
assert.equal(lesson.store.current.triedTags.length, 0, 'default previews do not count as attempts');
lesson.store.update({ name: 'Ксения', completed: ['name', 'color', 'tag'] });
assert.equal(lesson.store.current.completed.length, 1, 'old single-click completions must not count');
for (let i = 0; i < 5; i++) lesson.store.selectChoice('color', 'purple');
assert.equal(lesson.store.current.triedColors.length, 1, 'repeated choices count once');
for (const color of ['mint', 'coral']) lesson.store.selectChoice('color', color);
for (const animal of ['turtle', 'lion', 'dolphin', 'capybara']) lesson.store.selectChoice('animal', animal);
lesson.store.selectChoice('color', 'unknown');
lesson.store.selectChoice('unknown', 'purple');
assert.equal(lesson.store.current.completed.length, 1, 'three colors and four animals is incomplete');
const resumed = visit(Object.fromEntries(lesson.data));
resumed.store.selectChoice('color', 'yellow');
assert.equal(resumed.store.current.completed.length, 2, 'all eight buttons is sufficient, no need for sixteen combinations');
assert.equal(resumed.store.current.triedColors.length, 4);
assert.equal(resumed.store.current.triedAnimals.length, 4);
resumed.store.selectChoice('tag', 'link');
resumed.store.visitTagLink();
assert.equal(resumed.store.current.completed.length, 2, 'early link visit does not complete HTML');
for (const tag of ['strong', 'strong', 'mark', 'button']) resumed.store.selectChoice('tag', tag);
assert.equal(resumed.store.current.triedTags.length, 4);
assert.equal(resumed.store.current.completed.length, 2, 'trying every tag still needs a later link visit');
const arrival = visit(Object.fromEntries(resumed.data));
const pageNodes = { '#lion-greeting': {}, '#link-progress': {} };
arrival.window.webLabI18n = { t: (key, values) => key === 'greeting.named' ? `Привет, ${values.name}!` : String(values.count) };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../dist/link-page.js'), 'utf8'), {
  window: arrival.window, document: { querySelector: selector => pageNodes[selector] }
});
assert.equal(arrival.store.current.completed.length, 3);
assert.equal(pageNodes['#link-progress'].textContent, '3', 'link page already displays the completed third task');
assert.equal(pageNodes['#lion-greeting'].textContent, 'Привет, Ксения!');
arrival.store.visitTagLink();
assert.equal(arrival.store.current.completed.length, 3, 'repeat visit cannot duplicate completion');
const finished = visit(Object.fromEntries(arrival.data));
assert.equal(finished.store.current.completed.length, 3, 'completion survives reload');
for (const key of ['triedColors', 'triedAnimals', 'triedTags', 'completed']) {
  finished.store.current[key].length = 0;
  assert.ok(finished.store.current[key].length > 0, 'returned arrays cannot mutate stored state');
}
finished.store.reset();
assert.equal(finished.store.current.completed.length, 0);
assert.equal(finished.store.current.triedTags.length, 0);
assert.equal(finished.store.current.triedColors.length, 0);
assert.equal(finished.store.current.triedAnimals.length, 0);
assert.equal(finished.store.current.tagLinkVisited, false);
finished.store.visitTagLink();
assert.equal(finished.store.current.completed.length, 0, 'reset also clears link arrival');
const oldSave = visit({ 'weblab-state-v1': JSON.stringify({ name: 'Ana', completed: ['name', 'color', 'tag'], color: 'mint', animal: 'turtle', tag: 'link' }) });
assert.equal(oldSave.store.current.completed.length, 1);
assert.equal(oldSave.store.current.color, 'mint', 'old selection is preserved but does not count as an explicit attempt');
const invalid = visit({ 'weblab-state-v1': JSON.stringify({ triedColors: 'purple', triedAnimals: ['lion', 'lion', 'unknown'], triedTags: ['link'], tagLinkVisited: true }) });
assert.equal(invalid.store.current.triedColors.length, 0);
assert.equal(invalid.store.current.triedAnimals.length, 1);
assert.equal(invalid.store.current.tagLinkVisited, false);
assert.equal(invalid.store.current.completed.length, 0);
console.log('PASS: migration, invalid data, unavailable storage, unique choices, all eight design buttons, all four tags then link arrival, persistence and reset.');
