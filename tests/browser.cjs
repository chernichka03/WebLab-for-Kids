/* Optional browser checks: npm install --no-save playwright && npx playwright install chromium */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '../dist');
const shots = path.resolve(__dirname, '../docs/screenshots');
fs.mkdirSync(shots, { recursive: true });
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html')));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' }[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  let args = [];
  if (process.env.WEBLAB_CHROMIUM_MODULE) args = (await import(process.env.WEBLAB_CHROMIUM_MODULE)).default.args;
  args = args.filter(arg => !['--single-process', '--disable-web-security', '--allow-running-insecure-content', '--disable-site-isolation-trials'].includes(arg));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.WEBLAB_CHROMIUM_PATH || undefined, args });
  const cases = [];
  const failures = [];
  try {
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: width >= 768 ? 1000 : 844 }, isMobile: width < 768, hasTouch: width < 768, deviceScaleFactor: 1 });
      const page = await context.newPage();
      page.on('pageerror', error => failures.push(error.message));
      page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
      const requests = [];
      page.on('request', request => requests.push(request.url()));
      const click = async selector => { if (width < 768) await page.locator(selector).tap(); else await page.locator(selector).click(); };
      const text = selector => page.locator(selector).textContent();
      const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}, ${page.url()}`);
      await page.goto(url);
      assert.equal(await text('#progress-count'), '0');
      assert.equal(await page.locator('.badge-spark').count(), 0);
      assert.equal(await page.locator('.browser-top > span').count(), 0);
      assert.equal(await page.locator('.badge-code').count(), 1);
      await noOverflow();
      if (width === 1440) await page.screenshot({ animations: 'disabled', path: path.join(shots, 'home.png') });
      if (width === 390) await page.screenshot({ animations: 'disabled', path: path.join(shots, 'mobile-home.png') });
      await click('#name-form button');
      assert.equal(await text('#progress-count'), '0');
      assert.equal(await page.locator('#name-error').isVisible(), true);
      await page.locator('#name-input').fill('  Ștefan  ');
      await page.locator('#name-input').press('Enter');
      assert.equal(await text('#greeting-result'), 'Привет, Ștefan!');
      assert.equal(await text('#progress-count'), '1');
      assert.equal(await page.locator('#design-attempts').count(), 0);
      assert.equal(await page.locator('#tag-attempts').count(), 0);
      await page.locator('#greeting-code-toggle').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#greeting-code-toggle').getAttribute('aria-expanded'), 'true');
      assert.match(await text('#greeting-code'), /Ștefan/);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#greeting-code-toggle').getAttribute('aria-expanded'), 'false');
      if (width < 768) {
        await page.locator('#greeting-code-toggle').tap();
        assert.equal(await page.locator('#greeting-code-toggle').getAttribute('aria-expanded'), 'true');
        await page.locator('#greeting-code-toggle').tap();
      } else {
        await page.locator('#greeting-preview').hover();
        assert.equal(await page.locator('#greeting-code-toggle').getAttribute('aria-expanded'), 'true');
        await page.locator('#name-input').hover();
      }
      if (width < 768) {
        await page.locator('#color-code-toggle').tap();
        assert.equal(await page.locator('#color-code-toggle').getAttribute('aria-expanded'), 'true');
        assert.match(await text('#color-code'), /\.preview-purple/);
        await page.locator('#color-code-toggle').tap();
      } else {
        await page.locator('#color-preview').hover();
        assert.equal(await page.locator('#color-code-toggle').getAttribute('aria-expanded'), 'true');
        assert.match(await text('#color-code'), /\.preview-purple/);
        await page.locator('#name-input').hover();
      }
      for (const lang of ['ro', 'ru']) {
        await click(`[data-language="${lang}"]`);
        assert.equal(await page.locator('html').getAttribute('lang'), lang);
        for (const card of ['.html-card', '.css-card', '.js-card']) {
          await click(card);
          assert.equal(await page.locator(card).getAttribute('aria-expanded'), 'true');
          assert.equal(await page.locator(`${card} .full-description`).evaluate(el => el.scrollHeight <= el.clientHeight + 1), true, `clipped ${lang} card ${width}`);
        }
        await noOverflow();
      }
      await page.locator('#name-input').focus();
      if (width === 1440) await page.locator('.language-area').screenshot({ animations: 'disabled', path: path.join(shots, 'language-cards.png') });
      if (width === 1440) await page.locator('[data-task="name"]').screenshot({ animations: 'disabled', path: path.join(shots, 'name-task.png') });
      for (const color of ['purple', 'coral', 'yellow', 'mint']) {
        await click(`[data-color="${color}"]`);
        for (const animal of ['lion', 'capybara', 'dolphin', 'turtle']) {
          await click(`[data-animal="${animal}"]`);
          assert.equal(await page.locator(`[data-animal-art="${animal}"]`).evaluate(el => getComputedStyle(el).opacity), '1');
          assert.equal(await page.locator('#color-preview').evaluate(el => el.classList.contains('preview-' + window.webLabState.current.color)), true);
          if (animal !== 'lion') assert.match(await page.locator(`[data-animal-art="${animal}"] .animal-ref-shape`).evaluate(el => getComputedStyle(el).maskImage), /^url\("data:image\/webp;base64,/);
        }
        assert.equal(await text('#progress-count'), color === 'mint' ? '2' : '1');
      }
      assert.equal(await text('#progress-count'), '2');
      if (width === 1440) await page.locator('[data-task="color"]').screenshot({ animations: 'disabled', path: path.join(shots, 'design-task.png') });
      await click('[data-tag="link"]');
      await click('.demo-tag-link');
      await page.waitForURL('**/link.html');
      assert.match(await text('#link-progress'), /2 из 3/);
      await click('.back-to-lab');
      await page.waitForURL('**/index.html#lab');
      for (const tag of ['strong', 'mark', 'button']) {
        await click(`[data-tag="${tag}"]`);
        assert.equal(await page.locator(`#tag-result > ${tag}`).count(), 1);
        assert.equal(await text('#progress-count'), '2');
        if (tag === 'mark') await page.reload();
      }
      await click('.demo-tag-button');
      assert.equal(await text('.demo-tag-button'), 'Ура! ✨');
      assert.equal(await text('#progress-count'), '2');
      assert.equal(await page.locator('#finish-card').isVisible(), false);
      if (width === 1440) {
        await page.locator('[data-task="tag"]').screenshot({ animations: 'disabled', path: path.join(shots, 'html-tags.png') });
      }
      await click('[data-tag="link"]');
      await click('[data-language="ro"]');
      assert.equal(await text('#progress-count'), '2');
      await click('.demo-tag-link');
      await page.waitForURL('**/link.html');
      assert.equal(await text('#lion-greeting'), 'Salut, Ștefan!');
      assert.match(await text('#link-progress'), /3 din 3/);
      await noOverflow();
      assert.equal(await page.locator('.link-lesson-copy h1').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true, `clipped link heading at ${width}`);
      if (width === 390) await page.screenshot({ animations: 'disabled', path: path.join(shots, 'mobile-link-ro.png'), fullPage: true });
      if (width === 1440) await page.screenshot({ animations: 'disabled', path: path.join(shots, 'link-page.png') });
      await click('.back-to-lab');
      await page.waitForURL('**/index.html#lab');
      await page.reload();
      assert.equal(await text('#progress-count'), '3');
      assert.equal(await text('[data-task="tag"] .task-status'), 'Gata');
      if (width === 1440) {
        await page.locator('.progress-wrap').screenshot({ animations: 'disabled', path: path.join(shots, 'progress.png') });
        await page.locator('#finish-card').screenshot({ animations: 'disabled', path: path.join(shots, 'finish.png') });
      }
      assert.equal(await page.locator('[data-color="mint"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('[data-animal="turtle"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('[data-tag="link"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await text('#greeting-result'), 'Salut, Ștefan!');
      await noOverflow();
      if (width === 390) await page.locator('[data-task="color"]').screenshot({ animations: 'disabled', path: path.join(shots, 'mobile-design-ro.png') });
      await click('#reset-button');
      assert.equal(await text('#progress-count'), '0');
      assert.equal(await page.locator('#name-input').inputValue(), '');
      assert.equal(await page.locator('html').getAttribute('lang'), 'ro');
      await page.reload();
      assert.equal(await text('#progress-count'), '0');
      assert.equal(await page.evaluate(() => window.webLabState.current.triedColors.length + window.webLabState.current.triedAnimals.length + window.webLabState.current.triedTags.length), 0);
      assert.equal(await text('#greeting-result'), 'Salut, prietene!');
      await page.locator('#name-input').fill('<b>Ana</b>');
      await page.locator('#name-input').press('Enter');
      assert.equal(await page.locator('#greeting-result b').count(), 0);
      assert.equal(await text('#greeting-result'), 'Salut, <b>Ana</b>!');
      assert.equal(requests.some(request => !request.startsWith(url)), false, 'external site dependency');
      assert.equal(requests.some(request => /\.png|\.webp/.test(request)), false, 'animal change requested image');
      if (width === 1440) {
        const second = await context.newPage(); await second.goto(url + '/link.html');
        await page.locator('#name-input').fill('Ana'); await page.locator('#name-input').press('Enter');
        await second.waitForFunction(() => document.querySelector('#lion-greeting').textContent === 'Salut, Ana!');
        await click('[data-language="ru"]');
        await second.waitForFunction(() => document.documentElement.lang === 'ru');
        await second.close();
      }
      cases.push({ width, status: 'passed', scenarios: 'RU/RO, 16 designs, tags, empty/name submit, return/reload, reset, safe text, layout, no external requests' });
      console.log(`PASS viewport ${width}: all main scenarios, RU/RO`);
      await context.close();
    }
    for (const mode of ['blocked', 'corrupt', 'legacy']) {
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      await context.addInitScript(mode => {
        if (mode === 'blocked') {
          Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
          Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
        } else if (mode === 'corrupt') localStorage.setItem('weblab-state-v1', '{broken');
        else { localStorage.setItem('weblab-kid-name', 'Maria'); localStorage.setItem('weblab-completed-tasks', '["name","color"]'); }
      }, mode);
      const page = await context.newPage(); page.on('pageerror', error => failures.push(error.message));
      await page.goto(url);
      if (mode === 'legacy') assert.equal(await page.locator('#progress-count').textContent(), '1');
      else assert.equal(await page.locator('#progress-count').textContent(), '0');
      await page.locator('#name-input').fill('Ana'); await page.locator('#name-input').press('Enter');
      await page.locator('[data-language="ro"]').click();
      assert.equal(await page.locator('#greeting-result').textContent(), 'Salut, Ana!');
      await page.locator('[data-tag="button"]').click(); await page.locator('.demo-tag-button').click();
      assert.equal(await page.locator('.tag-spark').count(), 0);
      if (mode === 'blocked') assert.match(await page.locator('#storage-note').textContent(), /nu permite/);
      cases.push({ mode, status: 'passed' }); console.log(`PASS ${mode} storage + reduced motion`);
      await context.close();
    }
    assert.deepEqual(failures, []);
    fs.writeFileSync(path.resolve(__dirname, '../docs/qa-results.json'), JSON.stringify({ date: new Date().toISOString(), browser: browser.version(), emulatedViewports: true, cases, errors: failures }, null, 2) + '\n');
    console.log('PASS: no browser errors or failed assets.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
