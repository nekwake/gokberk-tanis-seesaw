# ⚖️ Seesaw Physics Simulator

A simple **Seesaw (Balance Board) Simulator** built with **HTML, CSS, and JavaScript**.  
Users can add weights to both sides of the seesaw, observe balance behavior, switch between themes, and reset the simulation easily.

---

## 🧠 Overview

This project is a web-based simulation that visually demonstrates the concept of **balance and torque** using a digital seesaw.

---

## ✨ Features

- 🎨 **Multiple Themes:** Ocean, Lava, Rose, and Night modes for visual variety
- ⚙️ **Interactive Settings:** Toggle box shape (circle/rectangle), theme selection, and simulation options
- 🧱 **Dynamic Boxes:** Add boxes of different weights on the seesaw
- 🔄 **Smooth Animation:** Realistic tilting motion using CSS transitions
- 🧾 **Activity Logs:** Displays recent weight placements and balance changes
- 🧹 **Reset Button:** Instantly reset the scene to default state
- 📱 **Responsive Design:** Optimized for mobile and desktop views

---

## 🧩 Tech Stack

| Technology           | Description                     |
| -------------------- | ------------------------------- |
| **HTML5**            | Structure and layout            |
| **CSS3**             | Styling, layout, and themes     |
| **JavaScript (ES6)** | Interactivity and physics logic |
| **Outfit Font**      | Custom UI typography            |

---

## 🕹️ How It Works

1. Click anywhere on the plank area to **add a weight**.
2. Watch the seesaw tilt dynamically based on total weights on each side.
3. View **real-time logs** showing where and how much weight was added.
4. Use the settings menu to:
   - Change the **box type** (circle/rectangle)
   - Switch between **themes**
5. Press **Reset** to clear all weights and restart.

---

## 🧠 Physics Concept

The balance of the seesaw is determined by the **moment of force** principle:

Torque = Force \* Distance from Pivot

When torques on both sides are equal, the plank remains horizontal; otherwise, it tilts toward the heavier side.

---

## 🖼️ Themes

| Theme    | Description                  |
| -------- | ---------------------------- |
| 🌊 Ocean | Cool blue tones              |
| 🔥 Lava  | Warm orange-red palette      |
| 🌹 Rose  | Soft pink-mauve hues         |
| 🌙 Night | Dark mode with neutral grays |

---

## 🧩 Thought Process & Design Decisions

The goal of this project was to create a simple, interactive physics simulator that helps users visually understand the concept of torque and balance.
The focus was on clarity, usability, and performance rather than full physical realism.

- The UI layout was intentionally minimal to highlight the seesaw and its motion.

- Color-coded weights and dynamic scaling make each interaction intuitive and informative.

- The real-time logs panel reinforces learning by showing the relationship between position, weight, and tilt.

- The plank tilt animation uses CSS transforms for smooth performance on both desktop and mobile.

- The internal logic was designed in a modular way (updateSeesaw, calculateTiltAngle, etc.) for readability and maintainability.

- LocalStorage persistence was added to retain state between sessions, improving user experience.

---

## ⚖️ Trade-offs & Limitations

While the simulator visually represents balance and torque effectively, several simplifications were made for accessibility:

- Friction, inertia, and oscillation are not simulated to keep performance high and logic easy to follow.

- The system runs entirely client-side, so there’s no real-time synchronization or multi-user support.

- The visual preview of the next box is static — it doesn’t yet simulate the effect it would have if dropped.

---

## 🤝 AI Assistance

AI tools were used for code debugging suggestions, and documentation improvements.
However, all key logic, structure, and visual decisions were implemented and tested manually to ensure a full understanding of the codebase.
AI assistance acted as a supporting reviewer, not as a primary author of the project.

---

## 🧑‍💻 Author

Gökberk Tanış
Fullstack Developer
📍 Based in Turkey
