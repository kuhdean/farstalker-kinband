# Farstalker Kinband Datasheets

This repository contains a small single‑page web app for building and tracking a **Farstalker Kinband** roster in *Warhammer 40,000: Kill Team*. It is entirely client side—open `index.html` in any modern browser to use it. The app lets you assemble a roster of operatives, view their rules, track wounds, orders, activation state and common in‑game counters.

## Repository layout

- **`index.html`** – the HTML entry point. It sets up the layout for two main views:
  - the **roster builder**, where you select operatives and equipment
  - the **game tracker**, which shows cards for each operative, a control panel for turn/command/victory points and reference accordions for faction rules and ploys.
  This file simply loads `style.css`, `data.js` and `script.js`.
- **`style.css`** – styling for the whole page. It defines colours, fonts and layout for operative cards, accordions and dashboard widgets.
- **`script.js`** – JavaScript controlling the roster logic and in‑game interface. It manages global state such as turn number, command points and a list of active operatives. It renders and updates the dashboard, operative cards and health bars, and handles interactions like adding or removing operatives, modifying wounds or toggling their orders.
- **`data.js`** – a large data file describing all operatives, weapon profiles, faction abilities, ploys and equipment. It also includes a small glossary of keywords used across the rules so they can be highlighted in tooltips.
- **`README.md`** – this documentation file.

## Basic usage

1. Clone or download this repository.
2. Open `index.html` in a browser.
3. Use the roster builder on the left to select up to 12 operatives (one must be a leader). Once the roster is valid, the **Start Game** button enables.
4. During the game the tracker view displays each operative with controls for wounds, orders and activation status. The dashboard lets you advance turns and adjust command/victory points.

All data is stored in the browser only—refreshing the page resets the roster and game state.

## Customisation

The data in `data.js` is structured so that you can extend it with your own operatives, weapons or rules. New keyword definitions will automatically be highlighted on operative cards and in the reference accordions.

## Purpose

This tool began as a personal reference to keep track of all things Kroot during Kill Team games. It is intentionally lightweight and does not require any server or build step. Feel free to modify or adapt it for your own roster management needs.

