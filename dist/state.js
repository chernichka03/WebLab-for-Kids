/* Shared state for both pages. No personal data leaves the browser. */
(() => {
  const KEY = 'weblab-state-v1';
  const CHOICES = {
    color: ['purple', 'coral', 'mint', 'yellow'],
    animal: ['lion', 'capybara', 'turtle', 'dolphin'],
    tag: ['strong', 'mark', 'button', 'link']
  };
  const attempts = (value, choices) => Array.isArray(value)
    ? [...new Set(value.filter(item => choices.includes(item)))] : [];
  const cleanName = value => typeof value === 'string'
    ? Array.from(value.replace(/[\u0000-\u001f\u007f]/g, '').trim()).slice(0, 24).join('') : '';
  function normalize(value = {}) {
    if (!value || typeof value !== 'object') value = {};
    const name = cleanName(value.name);
    const triedColors = attempts(value.triedColors, CHOICES.color);
    const triedAnimals = attempts(value.triedAnimals, CHOICES.animal);
    const triedTags = attempts(value.triedTags, CHOICES.tag);
    const tagLinkVisited = value.tagLinkVisited === true && triedTags.length === CHOICES.tag.length;
    // Recalculate completion from actual attempts, including when importing older saves.
    const completed = Array.isArray(value.completed) && value.completed.includes('name') && name ? ['name'] : [];
    if (triedColors.length === CHOICES.color.length && triedAnimals.length === CHOICES.animal.length) completed.push('color');
    if (tagLinkVisited) completed.push('tag');
    return {
      version: 1, name,
      color: CHOICES.color.includes(value.color) ? value.color : 'purple',
      animal: CHOICES.animal.includes(value.animal) ? value.animal : 'lion',
      tag: CHOICES.tag.includes(value.tag) ? value.tag : 'strong',
      triedColors, triedAnimals, triedTags, tagLinkVisited, completed
    };
  }
  let persistent = true;
  function read() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved !== null) {
        try { return normalize(JSON.parse(saved)); } catch { return normalize(); }
      }
      // Import progress from the previous version without losing it.
      let completed = [];
      try { completed = JSON.parse(localStorage.getItem('weblab-completed-tasks') || '[]'); } catch { /* Broken legacy JSON. */ }
      return normalize({ name: localStorage.getItem('weblab-kid-name'), completed });
    } catch { persistent = false; return normalize(); }
  }
  let state = read();
  function update(patch) {
    state = normalize({ ...state, ...patch });
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      localStorage.removeItem('weblab-kid-name');
      localStorage.removeItem('weblab-completed-tasks');
      persistent = true;
    } catch { persistent = false; }
    window.dispatchEvent(new Event('weblab:statechange'));
  }
  window.webLabState = {
    get current() { return { ...state, completed: [...state.completed], triedColors: [...state.triedColors], triedAnimals: [...state.triedAnimals], triedTags: [...state.triedTags] }; },
    get persistent() { return persistent; },
    cleanName, update, reset: () => update(normalize()),
    selectChoice(type, choice) {
      const field = { color: 'triedColors', animal: 'triedAnimals', tag: 'triedTags' }[type];
      if (field && CHOICES[type].includes(choice)) update({ [type]: choice, [field]: [...state[field], choice] });
    },
    visitTagLink() {
      if (!state.tagLinkVisited && state.triedTags.length === CHOICES.tag.length) update({ tagLinkVisited: true });
    }
  };
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) {
      state = read(); window.dispatchEvent(new Event('weblab:statechange'));
    }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted && persistent) {
      state = read(); window.dispatchEvent(new Event('weblab:statechange'));
    }
  });
})();
