const themeInputs = document.querySelectorAll('input[name="theme"]');
const body = document.body;

const THEME_CLASSES = [
  "theme-ocean",
  "theme-lava",
  "theme-rose",
  "theme-night",
];

const themeMigration = { sky: "ocean", sun: "lava", forest: "rose" };
let savedTheme = localStorage.getItem("selectedTheme");
if (themeMigration[savedTheme]) {
  savedTheme = themeMigration[savedTheme];
  localStorage.setItem("selectedTheme", savedTheme);
}

if (savedTheme && THEME_CLASSES.includes(`theme-${savedTheme}`)) {
  body.classList.add(`theme-${savedTheme}`);
  const savedInput = document.querySelector(`input[value="${savedTheme}"]`);
  if (savedInput) savedInput.checked = true;
} else {
  body.classList.add("theme-ocean");
  localStorage.setItem("selectedTheme", "ocean");
}

themeInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    const selectedTheme = e.target.value;

    body.classList.remove(...THEME_CLASSES);
    body.classList.add(`theme-${selectedTheme}`);

    localStorage.setItem("selectedTheme", selectedTheme);
  });
});
