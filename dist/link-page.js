(() => {
  // Complete the HTML lesson on arrival, after all four tags have been tried.
  window.webLabState.visitTagLink();
  window.addEventListener('pageshow', event => {
    if (event.persisted) window.webLabState.visitTagLink();
  });
  function renderLinkPage() {
    const { name, completed } = window.webLabState.current;
    const t = window.webLabI18n.t;
    document.querySelector('#lion-greeting').textContent = name
      ? t('greeting.named', { name }) : t('greeting.friend');
    document.querySelector('#link-progress').textContent = t('progress.value', { count: completed.length });
  }
  renderLinkPage();
  window.addEventListener('weblab:languagechange', renderLinkPage);
  window.addEventListener('weblab:statechange', renderLinkPage);
})();
