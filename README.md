# Kroot-Sheet: Farstalker Kinband Roster Tracker

Kroot-Sheet is a lightweight single page application for building a **Farstalker Kinband** roster and tracking every aspect of a game of *Warhammer 40,000: Kill Team*. It is entirely client side and requires no build step or server. Simply clone the repository and open `index.html` in any modern browser.

---

## Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Project Layout](#project-layout)
4. [How It Works](#how-it-works)
5. [Customising Data](#customising-data)
6. [Design and UX Philosophy](#design-and-ux-philosophy)
7. [Persistence](#persistence)

---

## Overview
This tool began as a personal reference sheet and has grown into a fully featured roster manager. It lets you:
- Select up to twelve operatives from the data file (one must be a leader).
- Choose up to four equipment items for the kill team within a ten EP budget.
- Start a game and monitor wounds, orders, activation state, command points and victory points.
- Reference faction rules, ploys and the selected equipment directly from the game screen.
Everything happens on one page: no frameworks, network calls or server storage.

## Quick Start
1. Clone or download this repository.
2. Open `index.html` directly in your browser.
3. Use the roster builder to pick operatives and equipment. When the roster is legal the **Start Game** button activates.
4. Once the game view is open, use the cards and dashboard widgets to track state. Data is stored in your browser so a refresh restores your progress.

## Project Layout
- **`index.html`** – The base HTML. It contains the containers for the roster builder and game tracker views and simply loads the CSS and JavaScript.
- **`style.css`** – The "cool retro-blue terminal" theme. It defines fonts, colours, layout grids and the styling of every card and widget.
- **`script.js`** – The application engine. It reads from `data.js`, maintains global state (`activeRoster`, `gameState`, `killTeamEquipment`) and renders or updates the DOM in response to user actions.
- **`data.js`** – The rule set. Operative profiles, weapon stats, faction rules, ploys, equipment and a glossary of keywords all live here. Editing this file lets you add or tweak units and rules without touching the logic.
- **`AGENT.md`** – Maintainer guidelines describing the design goals, coding conventions and workflow philosophy of the project.

## How It Works
1. **Roster Builder** – Selecting an operative adds an instance to `activeRoster`. The equipment grid functions in a similar way, populating `killTeamEquipment` and tracking EP spent and number of items.
2. **Validation** – `validateFullRoster()` checks that the roster contains a leader, exactly twelve operatives and legal equipment selections before enabling the game start button.
3. **Game Tracker** – When a game starts, `renderGameView()` builds the entire tracker interface:
   - `renderDashboard()` shows turn, command points, victory points and initiative.
   - `renderReferenceAccordions()` populates faction rules and ploys for quick lookup.
   - `renderChosenEquipmentCards()` displays the selected equipment datacards.
   - `renderAllOperativeCards()` generates a card for each operative with health bar, order toggle and activation status controls.
4. **Interactions** – Buttons and health bars call functions like `changeWounds()`, `toggleOrder()`, `toggleActivation()` and `readyAllAndNextTurn()` to adjust state and update card visuals through `updateCardVisualState()`.

## Customising Data
All game content is defined in `data.js`. Operatives, weapons, abilities and equipment are plain objects. You can extend the arrays or glossary to house rules or new factions. Tooltips for keywords are generated automatically whenever a matching entry exists in the glossary.

## Design and UX Philosophy
The app intentionally uses simple technologies—HTML, CSS and vanilla JavaScript—to keep it lean and easy to modify. The interface follows several principles outlined in `AGENT.md`:
- **Cool Retro‑Blue Terminal**: dark backgrounds with sharp, clean borders and no glow effects.
- **Efficient Tile Manager**: grids for selection lists and operative cards so everything fits on screen without scrolling.
- **Clarity Over Flash**: readable fonts (`VT323` for headings, `Inter` for body text) and immediate visual feedback via `.selected`, `.disabled` and state classes on cards.
- **Context Driven**: only information relevant to the current view is displayed, keeping the tracker uncluttered.

## Persistence
State is stored in the browser via `localStorage`. The functions `saveState()` and `loadState()` handle this automatically whenever the roster or game state changes. Closing and reopening the page will restore your roster and progress.

---
Enjoy building your Kroot kill team!
