const WEBLAB_LANGUAGE_KEY = "weblab-language";
const WEBLAB_LANGUAGES = new Set(["ru", "ro"]);

const WEBLAB_COPY = {
  ru: {
    "meta.indexTitle": "WebLab for Kids — создавай сайты играючи",
    "meta.indexDescription": "WebLab for Kids — интерактивная лаборатория, где дети знакомятся с HTML, CSS и JavaScript.",
    "meta.linkTitle": "Я — ссылка | WebLab for Kids",
    "meta.linkDescription": "Интерактивный пример HTML-ссылки в WebLab for Kids.",
    "language.label": "Выбор языка",
    "skip.tasks": "Перейти к заданиям",
    "skip.example": "Перейти к примеру",
    "brand.home": "WebLab for Kids — на главную",
    "brand.back": "WebLab for Kids — вернуться на главную",
    "hero.eyebrow": "<span aria-hidden=\"true\">✦</span> Твоя первая веб-лаборатория",
    "hero.title": "Узнай, из чего<br>сделаны <span>сайты</span>",
    "hero.text": "Сайт похож на маленького робота: HTML собирает его тело, CSS выбирает внешний вид, а JavaScript учит двигаться и отвечать на действия.",
    "hero.cta": "Посмотреть поближе <span aria-hidden=\"true\">↓</span>",
    "hero.visual": "Иллюстрация окна сайта",
    "hero.codeHello": "<h1>Привет!</h1>",
    "hero.miniGreeting": "<span aria-hidden=\"true\">👋</span> Привет, друг!",
    "hero.play": "Играть",
    "languages.eyebrow": "Три главных помощника",
    "languages.title": "Наведи курсор или нажми на карточку",
    "languages.label": "HTML, CSS и JavaScript",
    "html.short": "Строит основу",
    "html.full": "Расставляет на странице заголовки, картинки, кнопки и всё остальное — как детали конструктора.",
    "css.short": "Добавляет стиль",
    "css.full": "Выбирает цвета, размеры и расположение деталей — словно дизайнер комнаты или одежды.",
    "js.short": "Оживляет страницу",
    "js.full": "Замечает клики и ввод текста, меняет страницу и делает её похожей на настоящую игру.",
    "lab.eyebrow": "<span aria-hidden=\"true\">⚗</span> Пора экспериментировать",
    "lab.title": "Попробуй сам",
    "lab.intro": "Выполни три коротких опыта. Здесь ничего нельзя сломать!",
    "progress.label": "Прогресс заданий",
    "progress.done": "Готово заданий",
    "name.title": "Научи сайт здороваться",
    "name.text": "Напиши имя — и страница ответит лично тебе.",
    "name.label": "Твоё имя",
    "name.placeholder": "Например, Маша",
    "name.submit": "Поздороваться",
    "preview.result": "Результат",
    "greeting.friend": "Привет, друг!",
    "greeting.named": "Привет, {name}!",
    "greeting.welcome": "Рад видеть тебя в WebLab.",
    "design.title": "Стань дизайнером",
    "design.text": "Выбери цвет и животное — CSS мгновенно изменит карточку.",
    "design.colorLegend": "Выбери цвет карточки",
    "color.purple": "Фиолетовый",
    "color.coral": "Коралловый",
    "color.mint": "Мятный",
    "color.yellow": "Жёлтый",
    "color.purpleForm": "фиолетовой",
    "color.coralForm": "коралловой",
    "color.mintForm": "мятной",
    "color.yellowForm": "жёлтой",
    "design.animalLegend": "Выбери животное",
    "animal.lion": "Лев",
    "animal.capybara": "Капибара",
    "animal.turtle": "Черепаха",
    "animal.dolphin": "Дельфин",
    "design.preview": "{animal} на {color} карточке",
    "tags.title": "Испытай HTML-теги",
    "tags.text": "Выбери тег и посмотри, что он делает на странице.",
    "tags.label": "HTML-теги",
    "tags.beforeAfter": "Было → стало",
    "tag.strongText": "Я важный текст!",
    "tag.markText": "Я выделенный текст!",
    "tag.buttonText": "Нажми меня",
    "tag.linkText": "Открыть страницу",
    "tag.strongExplanation": "Тег <strong> показывает, что текст важный.",
    "tag.markExplanation": "Тег <mark> выделяет текст, как яркий маркер.",
    "tag.buttonExplanation": "Тег <button> создаёт кнопку. Нажми на неё и проверь!",
    "tag.linkExplanation": "Тег <a> создаёт ссылку. Нажми — и она перенесёт тебя на отдельную страницу!",
    "tag.clicked": "Ура! ✨",
    "tag.clickedExplanation": "HTML создал кнопку, а JavaScript ответил на твой клик!",
    "finish.title": "Лаборатория пройдена!",
    "finish.text": "Теперь ты знаешь, как HTML, CSS и JavaScript работают вместе.",
    "finish.reset": "Пройти ещё раз",
    "footer.text": "Учимся создавать, пробуя своими руками.",
    "link.eyebrow": "Ты перешёл на новую страницу",
    "link.title": "Вот как работает <span>ссылка</span>",
    "link.text": "Тег <code>&lt;a&gt;</code> помогает перейти в другое место: на новую страницу, к картинке или к полезному сайту.",
    "link.back": "← Вернуться к опытам",
    "link.speech": "Я — ссылка 👋",
    "link.lion": "Лев машет лапой"
  },
  ro: {
    "meta.indexTitle": "WebLab for Kids — creează site-uri prin joacă",
    "meta.indexDescription": "WebLab for Kids este un laborator interactiv în care copiii descoperă HTML, CSS și JavaScript.",
    "meta.linkTitle": "Eu sunt un link | WebLab for Kids",
    "meta.linkDescription": "Un exemplu interactiv despre linkurile HTML în WebLab for Kids.",
    "language.label": "Alege limba",
    "skip.tasks": "Mergi la exerciții",
    "skip.example": "Mergi la exemplu",
    "brand.home": "WebLab for Kids — pagina principală",
    "brand.back": "WebLab for Kids — înapoi la pagina principală",
    "hero.eyebrow": "<span aria-hidden=\"true\">✦</span> Primul tău laborator web",
    "hero.title": "Află din ce<br>sunt făcute <span>site-urile</span>",
    "hero.text": "Un site seamănă cu un roboțel: HTML îi construiește corpul, CSS îi alege înfățișarea, iar JavaScript îl învață să se miște și să răspundă la acțiuni.",
    "hero.cta": "Privește mai de aproape <span aria-hidden=\"true\">↓</span>",
    "hero.visual": "Ilustrația unei ferestre de site",
    "hero.codeHello": "<h1>Salut!</h1>",
    "hero.miniGreeting": "<span aria-hidden=\"true\">👋</span> Salut, prietene!",
    "hero.play": "Joacă-te",
    "languages.eyebrow": "Trei ajutoare importante",
    "languages.title": "Treci cu cursorul sau apasă pe un card",
    "languages.label": "HTML, CSS și JavaScript",
    "html.short": "Construiește baza",
    "html.full": "Așază pe pagină titluri, imagini, butoane și toate celelalte elemente — ca piesele unui constructor.",
    "css.short": "Adaugă stil",
    "css.full": "Alege culorile, dimensiunile și locul elementelor — ca un designer de camere sau haine.",
    "js.short": "Dă viață paginii",
    "js.full": "Observă clicurile și textul introdus, schimbă pagina și o face să semene cu un joc adevărat.",
    "lab.eyebrow": "<span aria-hidden=\"true\">⚗</span> E timpul pentru experimente",
    "lab.title": "Încearcă singur",
    "lab.intro": "Rezolvă trei experimente scurte. Aici nu poți strica nimic!",
    "progress.label": "Progresul exercițiilor",
    "progress.done": "Exerciții finalizate",
    "name.title": "Învață site-ul să salute",
    "name.text": "Scrie un nume, iar pagina îți va răspunde personal.",
    "name.label": "Numele tău",
    "name.placeholder": "De exemplu, Maria",
    "name.submit": "Salută",
    "preview.result": "Rezultat",
    "greeting.friend": "Salut, prietene!",
    "greeting.named": "Salut, {name}!",
    "greeting.welcome": "Mă bucur să te văd în WebLab.",
    "design.title": "Devino designer",
    "design.text": "Alege o culoare și un animal — CSS va schimba imediat cardul.",
    "design.colorLegend": "Alege culoarea cardului",
    "color.purple": "Mov",
    "color.coral": "Coral",
    "color.mint": "Mentă",
    "color.yellow": "Galben",
    "color.purpleForm": "mov",
    "color.coralForm": "coral",
    "color.mintForm": "mentă",
    "color.yellowForm": "galben",
    "design.animalLegend": "Alege animalul",
    "animal.lion": "Leu",
    "animal.capybara": "Capibara",
    "animal.turtle": "Țestoasă",
    "animal.dolphin": "Delfin",
    "design.preview": "{animal}. Culoarea cardului: {color}.",
    "tags.title": "Testează tagurile HTML",
    "tags.text": "Alege un tag și vezi ce face el pe pagină.",
    "tags.label": "Taguri HTML",
    "tags.beforeAfter": "Înainte → după",
    "tag.strongText": "Sunt un text important!",
    "tag.markText": "Sunt un text evidențiat!",
    "tag.buttonText": "Apasă-mă",
    "tag.linkText": "Deschide pagina",
    "tag.strongExplanation": "Tagul <strong> arată că textul este important.",
    "tag.markExplanation": "Tagul <mark> evidențiază textul ca un marker colorat.",
    "tag.buttonExplanation": "Tagul <button> creează un buton. Apasă-l și verifică!",
    "tag.linkExplanation": "Tagul <a> creează un link. Apasă-l și vei ajunge pe o pagină separată!",
    "tag.clicked": "Ura! ✨",
    "tag.clickedExplanation": "HTML a creat butonul, iar JavaScript a răspuns la clicul tău!",
    "finish.title": "Ai terminat laboratorul!",
    "finish.text": "Acum știi cum lucrează împreună HTML, CSS și JavaScript.",
    "finish.reset": "Începe din nou",
    "footer.text": "Învățăm să creăm, încercând singuri.",
    "link.eyebrow": "Ai ajuns pe o pagină nouă",
    "link.title": "Așa funcționează un <span>link</span>",
    "link.text": "Tagul <code>&lt;a&gt;</code> te ajută să mergi în alt loc: pe o pagină nouă, la o imagine sau la un site util.",
    "link.back": "← Înapoi la experimente",
    "link.speech": "Eu sunt un link 👋",
    "link.lion": "Un leu face cu lăbuța"
  }
};

function readWebLabLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem(WEBLAB_LANGUAGE_KEY);
    return WEBLAB_LANGUAGES.has(savedLanguage) ? savedLanguage : "ru";
  } catch {
    return "ru";
  }
}

let webLabLanguage = readWebLabLanguage();

function webLabTranslate(key, values = {}) {
  const template = WEBLAB_COPY[webLabLanguage][key] ?? WEBLAB_COPY.ru[key] ?? key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function applyWebLabLanguage() {
  document.documentElement.lang = webLabLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = webLabTranslate(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = webLabTranslate(element.dataset.i18nHtml);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", webLabTranslate(element.dataset.i18nAria));
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", webLabTranslate(element.dataset.i18nPlaceholder));
  });

  const page = document.body.dataset.page || "index";
  document.title = webLabTranslate(`meta.${page}Title`);
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", webLabTranslate(`meta.${page}Description`));

  document.querySelectorAll(".language-option").forEach((button) => {
    const isActive = button.dataset.language === webLabLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function selectWebLabLanguage(language) {
  if (!WEBLAB_LANGUAGES.has(language) || language === webLabLanguage) return;
  webLabLanguage = language;

  try {
    window.localStorage.setItem(WEBLAB_LANGUAGE_KEY, language);
  } catch {
    // The language still changes for the current visit when storage is unavailable.
  }

  applyWebLabLanguage();
  window.dispatchEvent(new CustomEvent("weblab:languagechange", { detail: { language } }));
}

window.webLabI18n = {
  get language() {
    return webLabLanguage;
  },
  t: webLabTranslate,
  apply: applyWebLabLanguage
};

applyWebLabLanguage();

document.querySelectorAll(".language-option").forEach((button) => {
  button.addEventListener("click", () => selectWebLabLanguage(button.dataset.language));
});
