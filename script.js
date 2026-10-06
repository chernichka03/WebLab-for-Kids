(() => {
  const store = window.webLabState;
  const t = (key, values) => window.webLabI18n.t(key, values);
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const nameInput = $('#name-input');
  const nameError = $('#name-error');
  const tagResult = $('#tag-result');
  const greetingPreview = $('#greeting-preview');
  const codeToggle = $('#greeting-code-toggle');
  let codeOpen = false;
  let codePinned = false;
  let buttonClicked = false;
  let sparkTimer;
  function complete(task, patch = {}) {
    store.update({ ...patch, completed: [...store.current.completed, task] });
  }
  function renderProgress() {
    const { completed } = store.current;
    $('#progress-count').textContent = completed.length;
    $('#progress-bar').style.width = `${completed.length / 3 * 100}%`;
    $('.progress-track').setAttribute('aria-valuenow', completed.length);
    $('.progress-track').setAttribute('aria-valuetext', t('progress.value', { count: completed.length }));
    $('#finish-card').hidden = completed.length !== 3;
    $$('[data-task]').forEach(card => {
      const done = completed.includes(card.dataset.task);
      card.classList.toggle('is-complete', done);
      card.querySelector('.task-status').textContent = done ? t('task.done') : '';
    });
    $('#storage-note').textContent = t(store.persistent ? 'storage.saved' : 'storage.unavailable');
  }
  function renderGreeting() {
    const { name } = store.current;
    const greeting = name ? t('greeting.named', { name }) : t('greeting.friend');
    $('#greeting-result').textContent = greeting;
    $('#mini-greeting').textContent = `👋 ${greeting}`;
    $('#greeting-code').textContent = 'const message = ' + JSON.stringify(greeting) + ';\n'
      + 'document.querySelector("#greeting-result")\n'
      + '  .textContent = message;';
    codeToggle.textContent = t(codeOpen ? 'name.hideCode' : 'name.showCode');
    if (document.activeElement !== nameInput) nameInput.value = name;
  }
  function renderDesign() {
    const { color, animal, triedColors, triedAnimals } = store.current;
    $('#design-attempts').textContent = t('design.attempts', { colors: triedColors.length, animals: triedAnimals.length });
    const preview = $('#color-preview');
    preview.className = `experiment-preview color-preview preview-${color}`;
    preview.setAttribute('aria-label', t('design.preview', {
      animal: t(`animal.${animal}`), color: t(`color.${color}Form`)
    }));
    $$('[data-animal-art]').forEach(el => el.classList.toggle('is-active', el.dataset.animalArt === animal));
    for (const type of ['color', 'animal']) {
      $$(`.${type}-choice`).forEach(el => {
        const selected = el.dataset[type] === store.current[type];
        el.classList.toggle('active', selected);
        el.setAttribute('aria-pressed', String(selected));
      });
    }
  }
  function renderTag() {
    clearTimeout(sparkTimer);
    const { tag, triedTags, completed } = store.current;
    $('#tag-attempts').textContent = completed.includes('tag') ? ''
      : triedTags.length === 4 ? t('tags.finishHint') : t('tags.attempts', { count: triedTags.length });
    const definitions = {
      strong: ['strong', 'tag.strongText'], mark: ['mark', 'tag.markText'],
      button: ['button', 'tag.buttonText'], link: ['a', 'tag.linkText']
    };
    const [element, key] = definitions[tag];
    const text = t(key);
    $('#tag-code').textContent = tag === 'link'
      ? `<a href="link.html">${text}</a>` : `<${element}>${text}</${element}>`;
    const output = document.createElement(element);
    output.textContent = tag === 'button' && buttonClicked ? t('tag.clicked') : text;
    if (tag === 'button') { output.type = 'button'; output.className = 'demo-tag-button'; }
    if (tag === 'link') { output.href = './link.html'; output.className = 'demo-tag-link'; }
    tagResult.replaceChildren(output);
    $('#tag-explanation').textContent = t(tag === 'button' && buttonClicked ? 'tag.clickedExplanation' : `tag.${tag}Explanation`);
    $$('[data-tag]').forEach(el => {
      const active = el.dataset.tag === tag;
      el.classList.toggle('active', active);
      el.setAttribute('aria-pressed', String(active));
    });
  }
  function render() {
    renderProgress(); renderGreeting(); renderDesign(); renderTag();
    if (!nameError.hidden) nameError.textContent = t('name.required');
  }
  $('#name-form').addEventListener('submit', event => {
    event.preventDefault();
    const name = store.cleanName(nameInput.value);
    if (!name) {
      nameError.textContent = t('name.required');
      nameError.hidden = false;
      nameInput.setAttribute('aria-invalid', 'true');
      nameInput.focus(); return;
    }
    nameInput.value = name;
    nameError.hidden = true;
    nameInput.removeAttribute('aria-invalid');
    codePinned = false; setCodeOpen(false);
    complete('name', { name });
    const wave = $('.wave');
    wave.classList.remove('animate');
    requestAnimationFrame(() => wave.classList.add('animate'));
  });
  nameInput.addEventListener('input', () => {
    nameError.hidden = true; nameInput.removeAttribute('aria-invalid');
  });
  for (const type of ['color', 'animal']) {
    $$(`.${type}-choice`).forEach(button => button.addEventListener('click', () => {
      store.selectChoice(type, button.dataset[type]);
    }));
  }
  $$('[data-tag]').forEach(button => button.addEventListener('click', () => {
    buttonClicked = false; store.selectChoice('tag', button.dataset.tag);
  }));
  tagResult.addEventListener('click', event => {
    const button = event.target.closest('.demo-tag-button');
    if (!button) return;
    buttonClicked = true;
    button.textContent = t('tag.clicked');
    $('#tag-explanation').textContent = t('tag.clickedExplanation');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    button.classList.remove('is-clicked');
    requestAnimationFrame(() => button.classList.add('is-clicked'));
    tagResult.querySelectorAll('.tag-spark').forEach(spark => spark.remove());
    [[-72,-44],[-28,-63],[30,-58],[72,-30],[70,34],[22,58],[-39,55],[-76,22]].forEach(([x,y],i) => {
      const spark = document.createElement('span');
      spark.className = 'tag-spark'; spark.textContent = i % 2 ? '✦' : '★';
      spark.setAttribute('aria-hidden', 'true');
      spark.style.setProperty('--spark-x', `${x}px`);
      spark.style.setProperty('--spark-y', `${y}px`);
      spark.style.setProperty('--spark-delay', `${i * 24}ms`);
      spark.style.setProperty('--spark-color', ['var(--coral)', 'var(--yellow)', 'var(--mint)'][i % 3]);
      tagResult.append(spark);
    });
    clearTimeout(sparkTimer);
    sparkTimer = setTimeout(() => {
      button.classList.remove('is-clicked');
      tagResult.querySelectorAll('.tag-spark').forEach(spark => spark.remove());
    }, 950);
  });
  // One expanded technology card at a time, with matching ARIA state.
  const cards = $$('.language-card');
  function openCard(target) {
    cards.forEach(card => {
      const open = card === target;
      card.classList.toggle('is-open', open);
      card.setAttribute('aria-expanded', String(open));
      card.querySelector('.full-description').setAttribute('aria-hidden', String(!open));
    });
  }
  cards.forEach(card => {
    card.addEventListener('click', () => openCard(card));
    card.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') openCard(card); });
    card.addEventListener('pointerleave', () => { if (document.activeElement !== card) openCard(null); });
    card.addEventListener('focus', () => openCard(card));
    card.addEventListener('blur', () => openCard(null));
    card.addEventListener('keydown', event => { if (event.key === 'Escape') openCard(null); });
  });
  document.addEventListener('click', event => { if (!event.target.closest('.language-card')) openCard(null); });
  function setCodeOpen(open) {
    codeOpen = open;
    greetingPreview.classList.toggle('code-open', open);
    codeToggle.setAttribute('aria-expanded', String(open));
    codeToggle.textContent = t(open ? 'name.hideCode' : 'name.showCode');
    $('#greeting-code-panel').setAttribute('aria-hidden', String(!open));
    $('#greeting-face').setAttribute('aria-hidden', String(open));
  }
  greetingPreview.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') setCodeOpen(true);
  });
  greetingPreview.addEventListener('pointerleave', () => { if (!codePinned) setCodeOpen(false); });
  codeToggle.addEventListener('click', () => { codePinned = !codeOpen; setCodeOpen(codePinned); });
  greetingPreview.addEventListener('keydown', event => {
    if (event.key === 'Escape') { codePinned = false; setCodeOpen(false); }
  });
  document.addEventListener('click', event => {
    if (!greetingPreview.contains(event.target)) { codePinned = false; setCodeOpen(false); }
  });
  $('#reset-button').addEventListener('click', () => {
    buttonClicked = false; codePinned = false; setCodeOpen(false); nameError.hidden = true; nameInput.removeAttribute('aria-invalid');
    store.reset(); nameInput.value = ''; nameInput.focus({ preventScroll: true });
    $('#name-form').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  });
  window.addEventListener('weblab:languagechange', render);
  window.addEventListener('weblab:statechange', render);
  render();
})();
