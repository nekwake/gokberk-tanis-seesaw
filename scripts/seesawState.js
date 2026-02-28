const SEESAW_STATE_KEY = "openSeesawState";

export function saveSeesawState(
  plank,
  logs,
  leftWeight,
  rightWeight,
  nextWeight,
  tiltAngle,
  CONFIG,
) {
  const { maxPosition } = CONFIG;
  const boxes = Array.from(document.querySelectorAll(".weight-box"))
    .filter((box) => !box.classList.contains("preview"))
    .map((box) => {
      const storedPos = box.dataset.position;
      let position = storedPos !== undefined ? parseFloat(storedPos) : null;

      if (position === null || Number.isNaN(position)) {
        const plankRect = plank.getBoundingClientRect();
        const boxRect = box.getBoundingClientRect();
        const plankCenter = plankRect.left + plankRect.width / 2;
        const boxCenter = boxRect.left + boxRect.width / 2;
        const distanceFromCenter = boxCenter - plankCenter;
        position = (distanceFromCenter / (plankRect.width / 2)) * maxPosition;
      }

      return {
        weight: parseFloat(box.dataset.weight || box.textContent) || 0,
        position,
        classList: [...box.classList],
      };
    });

  const transform = plank.style.transform;
  const angleMatch = transform.match(/rotate\(([-\d.]+)deg\)/);
  const angle = angleMatch ? parseFloat(angleMatch[1]) : 0;

  const state = {
    boxes,
    angle,
    logs,
    leftWeight,
    rightWeight,
    nextWeight,
    tiltAngle,
  };

  localStorage.setItem(SEESAW_STATE_KEY, JSON.stringify(state));
}

export function loadSeesawState(
  plank,
  boxList,
  logsList,
  CONFIG,
  updateBoxStyle,
  appendLog,
  updateInfoCards,
  refreshPreviewForNext,
  updateSeesaw,
) {
  const saved = localStorage.getItem(SEESAW_STATE_KEY);
  if (!saved) return null;

  const state = JSON.parse(saved);
  if (!state) return null;

  const { maxWeight, baseBoxSize, maxPosition } = CONFIG;
  const { boxes, logs, leftWeight, rightWeight, nextWeight, tiltAngle } = state;

  boxList.innerHTML = "";
  (state.boxes || []).forEach((b) => {
    const box = document.createElement("div");
    box.classList.add("weight-box");

    const boxType = b.classList.includes("circle") ? "circle" : "rectangle";
    box.classList.add(boxType);

    const scale = Math.max(0.4, Math.min(3, 0.5 + b.weight / maxWeight));
    const size = baseBoxSize * scale;
    updateBoxStyle(box, b.weight, size, boxType);
    const position =
      typeof b.position === "number" ? b.position : parseFloat(b.position) || 0;

    box.dataset.position = String(position);
    box.dataset.weight = String(b.weight);

    const percentFromCenter = (position / maxPosition) * 50;
    const centerPercent = 50 + percentFromCenter;

    const plankWidth = plank.offsetWidth || 1;
    const halfBoxPercent = (size / 2 / plankWidth) * 100;
    const minPercent = halfBoxPercent;
    const maxPercent = 100 - halfBoxPercent;
    const clampedCenter = Math.max(
      minPercent,
      Math.min(maxPercent, centerPercent),
    );

    box.style.left = `${clampedCenter}%`;
    box.style.transform = "translateX(-50%)";

    boxList.appendChild(box);
  });

  logsList.innerHTML = "";
  (logs || []).forEach((log) => appendLog(log));

  updateInfoCards();
  refreshPreviewForNext();
  updateSeesaw();

  return { logs, leftWeight, rightWeight, nextWeight, tiltAngle };
}

export function clearSeesawState() {
  localStorage.removeItem(SEESAW_STATE_KEY);
}
