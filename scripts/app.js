import {
  saveSeesawState,
  loadSeesawState,
  clearSeesawState,
} from "./seesawState.js";

const canvas = document.querySelector(".seesaw-canvas");
const plank = document.querySelector(".seesaw-plank");
const plankClickArea = document.querySelector(".plank-clickable-area");
const pivot = document.querySelector(".seesaw-pivot");
const resetButton = document.querySelector(".seesaw-reset-button");

const leftWeightInfo = document.querySelector(
  ".left-weight-info-card .info-card-content",
);
const rightWeightInfo = document.querySelector(
  ".right-weight-info-card .info-card-content",
);
const nextWeightInfo = document.querySelector(
  ".next-weight-info-card .info-card-content",
);
const tiltAngleInfo = document.querySelector(
  ".tilt-angle-info-card .info-card-content",
);

const logsList = document.querySelector(".seesaw-logs-list");
const boxList = document.querySelector(".box-list");
const boxTypeInputs = document.querySelectorAll('input[name="boxType"]');

let logs = [];
let weights = [];

const WEIGHT_COLORS = {
  1: "#0d6b7a",
  2: "#087d6f",
  3: "#028a63",
  4: "#2e8b57",
  5: "#4a9c4a",
  6: "#c17f3a",
  7: "#c96b2c",
  8: "#c45522",
  9: "#b83d1a",
  10: "#a52a2a",
};

const CONFIG = {
  plankHeight: 20,
  maxAngle: 30,
  baseBoxSize: 45,
  maxTorque: 250,
  minWeight: 1,
  maxWeight: 10,
  maxPosition: 90,
};

let leftWeight = 0;
let rightWeight = 0;
let nextWeight = 0;
let tiltAngle = 0;

let displayedTilt = 0;
let tiltAnimId = null;

const updateInfoCards = () => {
  if (leftWeightInfo)
    leftWeightInfo.textContent = `${leftWeight.toFixed(1)} kg`;
  if (rightWeightInfo)
    rightWeightInfo.textContent = `${rightWeight.toFixed(1)} kg`;
  if (nextWeightInfo)
    nextWeightInfo.textContent = `${nextWeight.toFixed(1)} kg`;
  animateTiltDisplay(displayedTilt, tiltAngle);
};

const easeInCubic = (t) => t * t * t;

const animateTiltDisplay = (from, to, duration = 400) => {
  if (tiltAnimId) cancelAnimationFrame(tiltAnimId);
  const start = performance.now();
  const delta = to - from;

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeInCubic(progress);
    const value = from + delta * eased;
    if (tiltAngleInfo) tiltAngleInfo.textContent = `${value.toFixed(1)}°`;

    if (progress < 1) {
      tiltAnimId = requestAnimationFrame(step);
    } else {
      tiltAnimId = null;
      displayedTilt = to;
      if (tiltAngleInfo) {
        tiltAngleInfo.classList.remove("tilt-animate");
        void tiltAngleInfo.offsetWidth;
        tiltAngleInfo.classList.add("tilt-animate");
      }
    }
  };

  tiltAnimId = requestAnimationFrame(step);
};

const addWeight = (weight, direction, position) => {
  direction === "left" ? (leftWeight += weight) : (rightWeight += weight);

  const boxType =
    Array.from(boxTypeInputs).find((input) => input.checked)?.value ||
    "rectangle";

  const newLog = {
    timestamp: new Date().toLocaleTimeString(),
    weight: weight,
    position: position,
    direction: direction,
    boxType,
  };

  logs.unshift(newLog);
  appendLog(newLog);

  const weightBox = createWeightBox(weight, position);
  boxList.appendChild(weightBox);

  updateSeesaw();

  saveSeesawState(
    plank,
    logs,
    leftWeight,
    rightWeight,
    nextWeight,
    tiltAngle,
    CONFIG,
  );
};

const createWeightBox = (weight, position) => {
  const { baseBoxSize, maxPosition } = CONFIG;
  const box = document.createElement("div");
  box.classList.add("weight-box");

  const boxType =
    Array.from(boxTypeInputs).find((input) => input.checked)?.value ||
    "rectangle";
  box.classList.add(boxType);
  const maxWeight = 10;
  const scale = Math.max(0.4, Math.min(3, 0.5 + weight / maxWeight));
  const size = baseBoxSize * scale;

  updateBoxStyle(box, weight, size, boxType);

  box.dataset.position = String(position);
  box.dataset.weight = String(weight);

  let percentFromCenter = (position / maxPosition) * 50;
  let centerPercent = 50 + percentFromCenter;

  const plankWidth = plank.offsetWidth || 1;
  const halfBoxPercent = (size / 2 / plankWidth) * 100;
  const minPercent = halfBoxPercent;
  const maxPercent = 100 - halfBoxPercent;
  centerPercent = Math.max(minPercent, Math.min(maxPercent, centerPercent));

  box.style.left = `${centerPercent}%`;
  box.style.transform = `translateX(-50%)`;

  return box;
};

const appendLog = (log) => {
  const logItem = document.createElement("div");
  logItem.classList.add("seesaw-log", "enter");
  const weightClass =
    log.boxType === "circle" ? "log-weigth circle" : "log-weigth";
  logItem.innerHTML = `
    <div class="seesaw-log-info">
      <div class="${weightClass}">
        <p>${log.weight}</p>
      </div>
      <p class="log-text">
        kg dropped on the <span>${log.direction}</span> side at 
        <span>${Math.abs(log.position.toFixed(2))}</span> units from pivot
      </p>
    </div>
    <div class="seesaw-log-time">
      <p>${log.timestamp}</p>
    </div>
  `;

  const delay = logs.indexOf(log) * 60;
  logItem.style.animationDelay = `${delay}ms`;

  logsList.prepend(logItem);

  logItem.addEventListener("animationend", () => {
    logItem.classList.remove("enter");
    logItem.style.animationDelay = "";
  });
};

const calculateTiltAngle = () => {
  const { maxTorque, maxAngle } = CONFIG;
  const leftTorque = logs
    .filter((log) => log.direction === "left")
    .reduce((total, log) => total + log.weight * Math.abs(log.position), 0);

  const rightTorque = logs
    .filter((log) => log.direction === "right")
    .reduce((total, log) => total + log.weight * Math.abs(log.position), 0);

  const netTorque = rightTorque - leftTorque;

  tiltAngle = (netTorque / maxTorque) * maxAngle;

  return Math.max(Math.min(tiltAngle, maxAngle), -maxAngle);
};

const updateSeesaw = () => {
  tiltAngle = calculateTiltAngle();
  plank.style.transform = `translate(-50%, 50%) rotate(${tiltAngle}deg)`;
};

resetButton.addEventListener("click", resetSeesaw);

const getRandomWeight = () => {
  const { maxWeight, minWeight } = CONFIG;
  return Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
};

const calculateClickPosition = (event) => {
  const { maxPosition } = CONFIG;
  const plankRect = plank.getBoundingClientRect();
  const plankCenter = plankRect.left + plankRect.width / 2;
  const clickX = event.clientX;
  const distanceFromCenter = clickX - plankCenter;
  const position = (distanceFromCenter / (plankRect.width / 2)) * maxPosition;
  const direction = position < 0 ? "left" : "right";
  return { position, direction };
};

let previewBox = null;
let lastHoverPosition = 0;

const createOrUpdatePreview = (weight, position) => {
  const { maxPosition, maxWeight, baseBoxSize } = CONFIG;
  const pos = Math.max(-maxPosition, Math.min(maxPosition, position || 0));
  lastHoverPosition = pos;

  const boxType =
    Array.from(boxTypeInputs).find((i) => i.checked)?.value || "rectangle";

  const scale = Math.max(0.4, Math.min(3, 0.5 + weight / maxWeight));
  const size = baseBoxSize * scale;

  if (!previewBox) {
    previewBox = document.createElement("div");
    previewBox.classList.add("weight-box", "preview");
    boxList.appendChild(previewBox);
  } else {
    previewBox.classList.remove("rectangle", "circle");
  }

  updateBoxStyle(previewBox, weight, size, boxType);

  const plankWidth = plank.offsetWidth || 1;
  const halfPlank = plankWidth / 2;
  const pixelPosition = (pos / maxPosition) * halfPlank;

  previewBox.style.left = `50%`;
  previewBox.style.transform = `translateX(calc(-50% + ${pixelPosition}px))`;
};

const updateBoxStyle = (box, weight, size, boxType) => {
  const { plankHeight } = CONFIG;
  const boxColor = WEIGHT_COLORS[weight];
  box.classList.add(boxType);
  box.style.bottom = `${plankHeight}px`;
  box.textContent = `${weight}kg`;
  box.style.width = `${size}px`;
  box.style.height = `${size}px`;
  box.style.backgroundColor = boxColor;
};

const hidePreview = () => {
  if (previewBox) previewBox.style.display = "none";
};

const showPreview = () => {
  if (previewBox) previewBox.style.display = "";
};

plankClickArea.addEventListener("mousemove", (e) => {
  const { position } = calculateClickPosition(e);
  createOrUpdatePreview(nextWeight, position);
  showPreview();
});

plankClickArea.addEventListener("mouseleave", () => {
  hidePreview();
});

const refreshPreviewForNext = () => {
  if (!previewBox) return;
  createOrUpdatePreview(nextWeight, lastHoverPosition);
};
window.refreshPreviewForNext = refreshPreviewForNext;

plankClickArea.addEventListener("click", (event) => {
  const { position, direction } = calculateClickPosition(event);
  addWeight(nextWeight, direction, position);
  nextWeight = getRandomWeight();
  updateInfoCards();
  refreshPreviewForNext();
});

const settingsToggle = document.querySelector(".seesaw-settings-toggle-button");
const settingsContainer = document.querySelector(".seesaw-settings-container");

if (settingsToggle && settingsContainer) {
  settingsToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsContainer.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (
      !settingsContainer.contains(e.target) &&
      !settingsToggle.contains(e.target)
    ) {
      settingsContainer.classList.remove("open");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const loadedState = loadSeesawState(
    plank,
    boxList,
    logsList,
    CONFIG,
    updateBoxStyle,
    appendLog,
    updateInfoCards,
    refreshPreviewForNext,
    updateSeesaw,
  );

  if (loadedState) {
    logs = loadedState.logs;
    leftWeight = loadedState.leftWeight;
    rightWeight = loadedState.rightWeight;
    nextWeight = loadedState.nextWeight;
    tiltAngle = loadedState.tiltAngle;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!nextWeight) nextWeight = getRandomWeight();
      updateInfoCards();

      requestAnimationFrame(() => {
        updateSeesaw();
        createOrUpdatePreview(nextWeight, 0);
        hidePreview();
      });
    });
  });
});

window.addEventListener("beforeunload", () => {
  saveSeesawState(
    plank,
    logs,
    leftWeight,
    rightWeight,
    nextWeight,
    tiltAngle,
    CONFIG,
  );
});

function resetSeesaw() {
  leftWeight = 0;
  rightWeight = 0;
  tiltAngle = 0;
  logs = [];
  logsList.innerHTML = "";
  boxList.innerHTML = "";

  if (previewBox) {
    previewBox.remove();
    previewBox = null;
  }
  updateSeesaw();
  updateInfoCards();
  clearSeesawState();
}

window.addEventListener("resize", () => {
  const { maxWeight, baseBoxSize, maxPosition } = CONFIG;
  Array.from(document.querySelectorAll(".weight-box:not(.preview)")).forEach(
    (box) => {
      const weight =
        parseFloat(box.dataset.weight) || parseFloat(box.textContent) || 0;
      const position = parseFloat(box.dataset.position) || 0;
      const scale = Math.max(0.4, Math.min(3, 0.5 + weight / maxWeight));
      const size = baseBoxSize * scale;

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
    },
  );
});
