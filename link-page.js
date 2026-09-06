const NAME_STORAGE_KEY = "weblab-kid-name";
const greeting = document.querySelector("#lion-greeting");
const translate = (key, values) => window.webLabI18n.t(key, values);

let savedName = "";

try {
  savedName = window.localStorage.getItem(NAME_STORAGE_KEY)?.trim() || "";
} catch {
  savedName = "";
}

function updateLionGreeting() {
  greeting.textContent = savedName
    ? translate("greeting.named", { name: savedName })
    : translate("greeting.friend");
}

updateLionGreeting();
window.addEventListener("weblab:languagechange", updateLionGreeting);
