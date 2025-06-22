# Kroot-Sheet: The Definitive Developer & Modding Guide

Welcome to the comprehensive guide for the **Kroot-Sheet**, a dynamic, client-side application for managing your Warhammer 40,000: Kill Team roster for the Farstalker Kinband. This document is designed to make you an expert on the inner workings of the application, empowering you to make any change with confidence—from simple data corrections to significant feature modifications.

## 1. Project Philosophy & Overview

Kroot-Sheet is a lightweight, single-page application built with the "vanilla" web stack (HTML, CSS, JavaScript). It has no server-side component, no build step, and no external frameworks. This ensures it is fast, portable, and incredibly easy to modify. The user experience is paramount, guided by three core principles:

*   **Retro-Blue Terminal:** A specific aesthetic that is clean, sharp, and readable, avoiding distracting visual effects like glows in favor of crisp lines and a clear color hierarchy.
*   **Efficient Tile Manager:** A compact, grid-based layout that presents a high density of information without feeling cluttered. The goal is to minimize scrolling and give the player a complete overview of their team at a glance.
*   **Data Accuracy & Trust:** The application must be a reliable source of truth during a game. All rules, stats, and abilities should precisely match the official source material.

## 2. Application Architecture

The application is composed of four critical files that work in concert. Understanding their roles is the first step to mastering the codebase.

| File | Analogy | Role & Responsibilities |
| :--- | :--- | :--- |
| **`index.html`** | The Chassis | Provides the foundational structure of the application. It contains the empty containers and elements (e.g., `<div id="operative-selection-grid">`) that the JavaScript engine will populate with dynamic content. It's the skeleton waiting for the engine to bring it to life. |
| **`style.css`** | The Paint & Bodywork | Controls the entire visual presentation. It implements the "Cool Retro-Blue Terminal" aesthetic through a well-organized set of CSS variables and rules. It dictates layout, typography, color, and the appearance of all interactive elements. |
| **`data.js`** | The Database | The single source of truth for all game rules. This file contains JavaScript objects and arrays that store every stat, weapon profile, ability, ploy, and equipment option for the Farstalker Kinband. **This is the primary file you will edit to update rules.** |
| **`script.js`** | The Engine | The heart of the application. It reads from `data.js`, manages the application's state (who is in your roster, current turn, CP, etc.), handles all user interactions (button clicks, selections), and dynamically generates the HTML content that is displayed to the user. |

**Application Flow:**
1.  A user opens `index.html`.
2.  `script.js` loads the rules from `data.js`.
3.  It then renders the initial "Roster Builder" view by creating HTML elements and injecting them into the containers defined in `index.html`.
4.  As the user selects operatives and equipment, functions in `script.js` update the application's state and re-render the UI to reflect these changes.
5.  All changes are saved to the browser's `localStorage` via the `saveState()` function.
6.  When the user starts the game, `script.js` hides the Roster Builder view and renders the "Game Tracker" view, again using the state and data to build the interface dynamically.

---

## 3. How to Make Common Changes

This section provides step-by-step instructions for the most common modifications you might want to make.

### **Scenario A: Correcting a Rule or Stat**

**Goal:** The "Prey" Strategic Ploy in the app is incorrect according to the latest rules update. Let's fix it.

*   **Analysis:** The provided OCR image for the "Farstalker Kinband: Update Log" shows the `Prey` ploy was changed.
    *   **Old Rule (currently in `data.js`):** `Select one enemy operative. Until the end of the turning point, friendly operatives' ranged weapons have the Balanced and Severe rules against that target...`
    *   **New Rule (from update log):** `[...] its ranged weapons have the Balanced and Severe weapon rules; if the weapon already has the Balanced weapon rule, it has the Ceaseless and Severe weapon rules instead.` The trigger condition was also changed.
*   **Step-by-Step Instructions:**
    1.  **Locate the Data:** Open the `data.js` file.
    2.  **Find the Ploy:** Search for the `strategicPloys` constant. Inside this array, find the object where `name: 'Prey'`.
    3.  **Update the Text:** Replace the entire value of the `text` property for the 'Prey' ploy with the corrected text from the rulebook update.

    **Before:**
    ```javascript
    // in data.js
    const strategicPloys = [
        // ... other ploys
        { name: 'Prey', cp: 1, text: "Select one enemy operative. Until the end of the turning point, friendly operatives' ranged weapons have the Balanced and Severe rules against that target. If a weapon already has Balanced, it gains Ceaseless and Severe instead." },
        // ... other ploys
    ];
    ```

    **After:**
    ```javascript
    // in data.js
    const strategicPloys = [
        // ... other ploys
        { name: 'Prey', cp: 1, text: "Until the end of the turning point, a friendly FARSTALKER KINBAND operative's ranged weapons have the Balanced and Severe weapon rules; if the weapon already has the Balanced weapon rule, it has the Ceaseless and Severe weapon rules instead." },
        // ... other ploys
    ];
    ```
    4.  **Save and Verify:** Save the `data.js` file and reload `index.html`. The text for the Prey ploy in the reference section will now be correct.

### **Scenario B: Adding a Missing Keyword**

**Goal:** A new errata introduces the keyword "Super-Silent" but it doesn't have a tooltip in the app.

*   **Analysis:** Tooltips are generated automatically by the `parseKeywords` function in `script.js`. It searches for words in rule descriptions that match a key in the `keywordGlossary` object in `data.js` and wraps them in a special `<span class="keyword">`.
*   **Step-by-Step Instructions:**
    1.  **Locate the Glossary:** Open the `data.js` file.
    2.  **Find the Glossary Object:** The first constant in the file is `keywordGlossary`.
    3.  **Add the New Entry:** Add a new key-value pair to the object. The key is the keyword (e.g., `"Super-Silent"`) and the value is its official rules definition.

    **Example:**
    ```javascript
    // in data.js
    const keywordGlossary = {
        "Balanced": "You can re-roll one of your attack dice.",
        "Blast X\"": "The target you select is the primary target...",
        // ... other keywords
        "Super-Silent": "This weapon can be fired even from outside the killzone.", // Your new definition here
        "Severe": "If you don’t retain any critical successes, you can change one of your normal successes to a critical success."
    };
    ```
    4.  **Save and Verify:** Save `data.js` and reload the page. Any instance of "Super-Silent" in ability text will now be a highlighted, clickable keyword with the correct tooltip.

### **Scenario C: Changing the Visual Theme**

**Goal:** You want to change the primary accent color from cyan to a vibrant green.

*   **Analysis:** The entire color scheme is controlled by CSS variables defined in the `:root` pseudo-class at the top of `style.css`.
*   **Step-by-Step Instructions:**
    1.  **Locate the Variables:** Open the `style.css` file.
    2.  **Find the `:root` block:** It's at the very top of the file.
    3.  **Modify the Color:** Find the `--accent-color-primary` variable and change its hex code. You should also update the corresponding `--accent-color-primary-rgb` variable, which is used for transparent backgrounds on hover effects.

    **Before:**
    ```css
    /* in style.css */
    :root {
        /* ... */
        --accent-color-primary: #00FFFF; /* Electric Cyan */
        --accent-color-primary-rgb: 0,255,255;
        /* ... */
    }
    ```

    **After:**
    ```css
    /* in style.css */
    :root {
        /* ... */
        --accent-color-primary: #00FF7F; /* Vibrant Green */
        --accent-color-primary-rgb: 0,255,127;
        /* ... */
    }
    ```
    4.  **Save and Verify:** Save `style.css` and reload the page. All primary borders, buttons, and highlights will now use your new color.

---

## 4. Deep Dive: Key Systems

### The State Management (`script.js`)

The application's memory resides in three global variables:
*   `activeRoster`: An array containing the operative objects you have selected for your team. Each object is a copy of the base data from `operativesData` but with additional properties for tracking game state (e.g., `currentWounds`, `isActivated`).
*   `killTeamEquipment`: An array containing the equipment objects you've chosen for your kill team.
*   `gameState`: An object that tracks game-wide values like the current turning point (`turn`), command points (`cp`), and victory points (`vp`).

### The Rendering Pipeline (`script.js`)

The UI is built by a series of `render` functions. The most important is `renderAllOperativeCards()`. This function iterates through the `activeRoster` array and constructs a large HTML string for each operative's card. It dynamically inserts stats, builds the weapon table, and checks for injury effects on-the-fly. To change the layout of an operative card, you must edit the HTML string inside this function.

For performance, minor updates (like changing wounds or toggling activation) don't re-render everything. They call the more efficient `updateCardVisualState(instanceId)` function, which targets a single card's DOM elements and updates its styles and text directly.

### Data Persistence (`script.js` & `localStorage`)

Every time you take an action that changes the state (add/remove an operative, change wounds, use a ploy), the `saveState()` function is called. This function converts the `activeRoster`, `killTeamEquipment`, and `gameState` variables into JSON strings and saves them in the browser's `localStorage`. When the page is loaded, `loadState()` reads this data, parses it, and repopulates the global state variables, ensuring your game is exactly as you left it. To reset everything, use the "Reset Roster" button, which calls `resetRoster()` to clear the data from `localStorage` and reload the page.