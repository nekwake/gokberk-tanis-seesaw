const boxTypeInputs = document.querySelectorAll('input[name="boxType"]');
const BOX_TYPE_KEY = "openSeesawBoxType";

window.addEventListener("DOMContentLoaded", () => {
  const savedBoxType = localStorage.getItem(BOX_TYPE_KEY);
  if (savedBoxType) {
    const savedInput = document.querySelector(
      `input[name="boxType"][value="${savedBoxType}"]`,
    );
    if (savedInput) {
      savedInput.checked = true;

      if (typeof refreshPreviewForNext === "function") {
        refreshPreviewForNext();
      }
    }
  }
});

boxTypeInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    const selectedType = e.target.value;
    localStorage.setItem(BOX_TYPE_KEY, selectedType);

    if (typeof refreshPreviewForNext === "function") {
      refreshPreviewForNext();
    }
  });
});
