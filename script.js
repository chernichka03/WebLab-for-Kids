const languageCards = document.querySelectorAll(".language-card");
const NAME_STORAGE_KEY = "weblab-kid-name";
const PROGRESS_STORAGE_KEY = "weblab-completed-tasks";
const TASK_NAMES = new Set(["name", "color", "tag"]);
const translate = (key, values) => window.webLabI18n.t(key, values);

function readSavedTasks() {
  try {
    const savedTasks = JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) || "[]");
    return new Set(Array.isArray(savedTasks) ? savedTasks.filter((task) => TASK_NAMES.has(task)) : []);
  } catch {
    return new Set();
  }
}

function rememberCompletedTasks() {
  try {
    if (completedTasks.size) {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify([...completedTasks]));
    } else {
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    }
  } catch {
    // Progress still works for the current visit when browser storage is unavailable.
  }
}

const completedTasks = readSavedTasks();

const progressCount = document.querySelector("#progress-count");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector(".progress-track");
const finishCard = document.querySelector("#finish-card");

function updateProgress() {
  const count = completedTasks.size;
  progressCount.textContent = String(count);
  progressBar.style.width = `${(count / 3) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(count));
  finishCard.hidden = count !== 3;
}

function completeTask(taskName) {
  completedTasks.add(taskName);
  rememberCompletedTasks();
  updateProgress();
}

updateProgress();

languageCards.forEach((card) => {
  card.addEventListener("click", () => {
    const willOpen = !card.classList.contains("is-open");

    languageCards.forEach((otherCard) => {
      otherCard.classList.remove("is-open");
      otherCard.setAttribute("aria-expanded", "false");
    });

    if (willOpen) {
      card.classList.add("is-open");
      card.setAttribute("aria-expanded", "true");
    }
  });
});

const nameForm = document.querySelector("#name-form");
const nameInput = document.querySelector("#name-input");
const greetingResult = document.querySelector("#greeting-result");
const wave = document.querySelector(".wave");

function readSavedName() {
  try {
    return window.localStorage.getItem(NAME_STORAGE_KEY)?.trim() || "";
  } catch {
    return "";
  }
}

function rememberName(name) {
  try {
    if (name) {
      window.localStorage.setItem(NAME_STORAGE_KEY, name);
    } else {
      window.localStorage.removeItem(NAME_STORAGE_KEY);
    }
  } catch {
    // The greeting still works when browser storage is unavailable.
  }
}

const rememberedName = readSavedName();
if (rememberedName) {
  nameInput.value = rememberedName;
  greetingResult.textContent = translate("greeting.named", { name: rememberedName });
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  rememberName(name);
  greetingResult.textContent = name
    ? translate("greeting.named", { name })
    : translate("greeting.friend");

  wave.classList.remove("animate");
  requestAnimationFrame(() => wave.classList.add("animate"));
  completeTask("name");
});

const colorChoices = document.querySelectorAll(".color-choice");
const animalChoices = document.querySelectorAll(".animal-choice");
const animalDrawings = document.querySelectorAll("[data-animal-art]");
const colorPreview = document.querySelector("#color-preview");
let selectedColor = "purple";
let selectedAnimal = "lion";

const colorNameKeys = {
  purple: "color.purpleForm",
  coral: "color.coralForm",
  mint: "color.mintForm",
  yellow: "color.yellowForm"
};

const animalNameKeys = {
  lion: "animal.lion",
  capybara: "animal.capybara",
  turtle: "animal.turtle",
  dolphin: "animal.dolphin"
};

function renderCardDesign() {
  colorPreview.classList.remove("preview-purple", "preview-coral", "preview-mint", "preview-yellow");
  colorPreview.classList.add(`preview-${selectedColor}`);

  animalDrawings.forEach((animal) => {
    animal.classList.toggle("is-active", animal.dataset.animalArt === selectedAnimal);
  });

  colorPreview.setAttribute(
    "aria-label",
    translate("design.preview", {
      animal: translate(animalNameKeys[selectedAnimal]),
      color: translate(colorNameKeys[selectedColor])
    })
  );

}

renderCardDesign();

colorChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    selectedColor = choice.dataset.color;

    colorChoices.forEach((button) => {
      const isSelected = button === choice;
      button.classList.toggle("active", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    renderCardDesign();
    completeTask("color");
  });
});

animalChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    selectedAnimal = choice.dataset.animal;

    animalChoices.forEach((button) => {
      const isSelected = button === choice;
      button.classList.toggle("active", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    renderCardDesign();
    completeTask("color");
  });
});

const tagButtons = document.querySelectorAll(".tag-buttons button");
const tagCode = document.querySelector("#tag-code");
const tagResult = document.querySelector("#tag-result");
const tagExplanation = document.querySelector("#tag-explanation");

function getTagExamples() {
  const strongText = translate("tag.strongText");
  const markText = translate("tag.markText");
  const buttonText = translate("tag.buttonText");
  const linkText = translate("tag.linkText");

  return {
    strong: {
      code: `<strong>${strongText}</strong>`,
      output: `<strong>${strongText}</strong>`,
      explanation: translate("tag.strongExplanation")
    },
    mark: {
      code: `<mark>${markText}</mark>`,
      output: `<mark>${markText}</mark>`,
      explanation: translate("tag.markExplanation")
    },
    button: {
      code: `<button>${buttonText}</button>`,
      output: `<button class="demo-tag-button" type="button">${buttonText}</button>`,
      explanation: translate("tag.buttonExplanation")
    },
    link: {
      code: `<a href="link.html">${linkText}</a>`,
      output: `<a class="demo-tag-link" href="./link.html">${linkText}</a>`,
      explanation: translate("tag.linkExplanation")
    }
  };
}

function renderTagExample(tagName) {
  const example = getTagExamples()[tagName];
  tagCode.textContent = example.code;
  tagResult.innerHTML = example.output;
  tagExplanation.textContent = example.explanation;
}

renderTagExample("strong");

tagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTag = button.dataset.tag;

    tagButtons.forEach((otherButton) => {
      const isSelected = otherButton === button;
      otherButton.classList.toggle("active", isSelected);
      otherButton.setAttribute("aria-pressed", String(isSelected));
    });

    renderTagExample(selectedTag);
    completeTask("tag");
  });
});

const sparkPositions = [
  ["-72px", "-44px"],
  ["-28px", "-63px"],
  ["30px", "-58px"],
  ["72px", "-30px"],
  ["70px", "34px"],
  ["22px", "58px"],
  ["-39px", "55px"],
  ["-76px", "22px"]
];

tagResult.addEventListener("click", (event) => {
  const demoButton = event.target.closest(".demo-tag-button");
  if (!demoButton) return;

  demoButton.textContent = translate("tag.clicked");
  demoButton.classList.remove("is-clicked");
  requestAnimationFrame(() => demoButton.classList.add("is-clicked"));
  tagExplanation.textContent = translate("tag.clickedExplanation");

  tagResult.querySelectorAll(".tag-spark").forEach((spark) => spark.remove());
  sparkPositions.forEach(([x, y], index) => {
    const spark = document.createElement("span");
    spark.className = "tag-spark";
    spark.textContent = index % 2 === 0 ? "★" : "✦";
    spark.setAttribute("aria-hidden", "true");
    spark.style.setProperty("--spark-x", x);
    spark.style.setProperty("--spark-y", y);
    spark.style.setProperty("--spark-delay", `${index * 24}ms`);
    spark.style.setProperty("--spark-color", index % 3 === 0 ? "var(--coral)" : index % 3 === 1 ? "var(--yellow)" : "var(--mint)");
    tagResult.appendChild(spark);
  });

  window.setTimeout(() => {
    demoButton.classList.remove("is-clicked");
    tagResult.querySelectorAll(".tag-spark").forEach((spark) => spark.remove());
  }, 950);
});

document.querySelector("#reset-button").addEventListener("click", () => {
  completedTasks.clear();
  rememberCompletedTasks();
  updateProgress();

  rememberName("");
  nameInput.value = "";
  greetingResult.textContent = translate("greeting.friend");

  colorChoices.forEach((button) => {
    const isDefault = button.dataset.color === "purple";
    button.classList.toggle("active", isDefault);
    button.setAttribute("aria-pressed", String(isDefault));
  });
  animalChoices.forEach((button) => {
    const isDefault = button.dataset.animal === "lion";
    button.classList.toggle("active", isDefault);
    button.setAttribute("aria-pressed", String(isDefault));
  });
  selectedColor = "purple";
  selectedAnimal = "lion";
  renderCardDesign();

  tagButtons.forEach((button) => {
    const isDefault = button.dataset.tag === "strong";
    button.classList.toggle("active", isDefault);
    button.setAttribute("aria-pressed", String(isDefault));
  });
  renderTagExample("strong");

  document.querySelector("#lab-title").scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("weblab:languagechange", () => {
  const savedName = readSavedName();
  greetingResult.textContent = savedName
    ? translate("greeting.named", { name: savedName })
    : translate("greeting.friend");
  renderCardDesign();
  const activeTag = document.querySelector(".tag-buttons button.active")?.dataset.tag || "strong";
  renderTagExample(activeTag);
});
