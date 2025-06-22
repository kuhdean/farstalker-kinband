// script.js

// --- GLOBAL STATE ---
let activeRoster = [];
let gameState = { turn: 1, cp: 2, vp: 0, totalEp: 10, spentEp: 0 };
let killTeamEquipment = [];
const MAX_EQUIPMENT_ITEMS = 4;

// --- DOM ELEMENT SELECTORS ---
const rosterBuilderView = document.getElementById('roster-builder-view');
const gameTrackerView = document.getElementById('game-tracker-view');
const operativeSelectionGrid = document.getElementById('operative-selection-grid');
const equipmentSelectionGrid = document.getElementById('equipment-selection-grid');
const rosterListContainer = document.getElementById('roster-list-container');
const rosterCountSpan = document.getElementById('roster-count');
const validationMessage = document.getElementById('roster-validation-message');
const startGameBtn = document.getElementById('start-game-btn');
const activeCardsContainer = document.getElementById('active-operative-cards');
const factionRulesAccordionContainer = document.getElementById('faction-rules-accordion-container');
const strategicPloysAccordionContainer = document.getElementById('strategic-ploys-accordion-container');
const firefightPloysAccordionContainer = document.getElementById('firefight-ploys-accordion-container');
const turnValueSpan = document.getElementById('turn-value');
const cpValueSpan = document.getElementById('cp-value');
const cpMessageSpan = document.getElementById('cp-message');
const vpValueSpan = document.getElementById('vp-value');
const readyAllBtn = document.getElementById('ready-all-btn');
const resetRosterBtn = document.getElementById('reset-roster-btn');
const chosenKillTeamEquipmentList = document.getElementById('chosen-kill-team-equipment-list');
const epSpentUI = document.getElementById('ep-spent-ui');
const equipmentSelectedCount = document.getElementById('equipment-selected-count');
const chosenEquipmentCardContainer = document.getElementById('chosen-equipment-card-container');

function loadState() {
    const rosterData = localStorage.getItem('activeRoster');
    const gameData = localStorage.getItem('gameState');
    const equipData = localStorage.getItem('killTeamEquipment');
    if (rosterData) {
        try { activeRoster = JSON.parse(rosterData); } catch { activeRoster = []; }
    }
    if (gameData) {
        try { gameState = JSON.parse(gameData); } catch { gameState = { turn: 1, cp: 2, vp: 0, totalEp: 10, spentEp: 0 }; }
    }
    if (equipData) {
        try { killTeamEquipment = JSON.parse(equipData); } catch { killTeamEquipment = []; }
    }
}

function saveState() {
    localStorage.setItem('activeRoster', JSON.stringify(activeRoster));
    localStorage.setItem('gameState', JSON.stringify(gameState));
    localStorage.setItem('killTeamEquipment', JSON.stringify(killTeamEquipment));
}

function resetRoster() {
    localStorage.removeItem('activeRoster');
    localStorage.removeItem('gameState');
    localStorage.removeItem('killTeamEquipment');
    location.reload();
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderOperativeSelectionGrid();
    renderEquipmentSelectionGrid();
    updateEquipmentUI();
    bindStaticEventListeners();
    renderRosterList();
    validateFullRoster();
});

// --- ROSTER BUILDER LOGIC ---
function renderOperativeSelectionGrid() {
    operativeSelectionGrid.innerHTML = '';
    operativesData.forEach(opData => {
        const tile = document.createElement('div');
        tile.classList.add('operative-tile');
        tile.innerHTML = `<strong>${opData.name}</strong>${opData.isLeader ? ' <span class="leader-tag">Leader</span>' : ''}`;
        if (activeRoster.some(op => op.id === opData.id)) {
            tile.classList.add('selected');
        }
        const validation = validateRosterAddition(opData);
        if (!validation.isValid) {
            tile.classList.add('disabled');
        } else {
            tile.addEventListener('click', () => addOperativeToRoster(opData.id));
        }
        operativeSelectionGrid.appendChild(tile);
    });
}

function renderEquipmentSelectionGrid() {
    equipmentSelectionGrid.innerHTML = '';
    const allEquip = [...factionEquipment, ...universalEquipment];
    allEquip.forEach(eq => {
        const tile = document.createElement('div');
        tile.classList.add('equipment-tile');
        tile.innerHTML = `<strong>${eq.name}</strong><span class="ep-cost-display">${eq.epCost}EP</span><div class="tile-rules-snippet">${parseKeywords(eq.flavorText)}</div>`;
        if (killTeamEquipment.some(e => e.name === eq.name)) {
            tile.classList.add('selected');
        }
        const inRoster = killTeamEquipment.some(e => e.name === eq.name);
        const epExceeded = gameState.spentEp + eq.epCost > gameState.totalEp;
        const itemLimit = killTeamEquipment.length >= MAX_EQUIPMENT_ITEMS;
        if (inRoster || epExceeded || itemLimit) {
            tile.classList.add('disabled');
        } else {
            tile.addEventListener('click', () => addKillTeamEquipment(eq.name));
        }
        equipmentSelectionGrid.appendChild(tile);
    });
}

function updateEquipmentUI() {
    epSpentUI.textContent = gameState.spentEp;
    equipmentSelectedCount.textContent = killTeamEquipment.length;
    chosenKillTeamEquipmentList.innerHTML = killTeamEquipment.map(eq => `<li>${eq.name}</li>`).join('');
    renderEquipmentSelectionGrid();
    renderChosenEquipmentCards();
}

function addKillTeamEquipment(name) {
    const item = [...factionEquipment, ...universalEquipment].find(eq => eq.name === name);
    if (!item) return;
    if (killTeamEquipment.length >= MAX_EQUIPMENT_ITEMS) return;
    if (gameState.spentEp + item.epCost > gameState.totalEp) return;
    if (killTeamEquipment.some(eq => eq.name === name)) return;
    killTeamEquipment.push(item);
    gameState.spentEp += item.epCost;
    updateEquipmentUI();
    saveState();
}

function removeKillTeamEquipment(name) {
    const index = killTeamEquipment.findIndex(eq => eq.name === name);
    if (index === -1) return;
    const [removed] = killTeamEquipment.splice(index, 1);
    gameState.spentEp = Math.max(0, gameState.spentEp - removed.epCost);
    updateEquipmentUI();
    saveState();
}

function showValidationMessage(message, isValid) {
    validationMessage.textContent = message;
    if (isValid) {
        validationMessage.classList.remove('error');
        validationMessage.classList.add('valid');
        validationMessage.style.color = 'var(--valid-message-color)';
    } else {
        validationMessage.classList.remove('valid');
        validationMessage.classList.add('error');
        validationMessage.style.color = 'var(--error-text-color)';
    }
}

function addOperativeToRoster(opId) {
    const opData = operativesData.find(op => op.id === opId);
    const validation = validateRosterAddition(opData);
    if (!validation.isValid) {
        showValidationMessage(validation.message, false);
        return;
    }
    const opInstance = {
        ...opData,
        instanceId: Date.now() + Math.random(),
        currentWounds: opData.stats.wounds,
        isActivated: false,
        order: 'Conceal'
    };
    activeRoster.push(opInstance);
    renderRosterList();
    renderOperativeSelectionGrid();
    updateEquipmentUI();
    validateFullRoster();
    showValidationMessage('Operative added.', true);
    saveState();
}

function removeOperativeFromRoster(instanceId) {
    activeRoster = activeRoster.filter(op => op.instanceId != instanceId);
    renderRosterList();
    renderOperativeSelectionGrid();
    updateEquipmentUI();
    validateFullRoster();
    saveState();
}

function renderRosterList() {
    rosterListContainer.innerHTML = '';
    activeRoster.forEach(op => {
        const item = document.createElement('div');
        item.classList.add('roster-item');
        item.innerHTML = `
            <div>
                <span>${op.name}</span>
            </div>
            <div>
                <button class="remove-op-btn" data-id="${op.instanceId}">X</button>
            </div>`;
        item.querySelector('.remove-op-btn').addEventListener('click', () => removeOperativeFromRoster(op.instanceId));
        rosterListContainer.appendChild(item);
    });
    rosterCountSpan.textContent = activeRoster.length;
}



function validateRosterAddition(opData) {
    if (activeRoster.length >= 12) return { isValid: false, message: 'Roster is full (12 operatives max).' };
    if (opData.isLeader && activeRoster.some(op => op.isLeader)) return { isValid: false, message: 'Roster can only have one Leader.' };
    if (opData.isUnique && activeRoster.some(op => op.id === opData.id)) return { isValid: false, message: `${opData.name} is a unique operative and is already in the roster.` };
    if (opData.id === 'hound' && activeRoster.filter(op => op.id === 'hound').length >= 2) return { isValid: false, message: 'You can only include a maximum of two Kroot Hounds.' };
    return { isValid: true, message: 'Operative can be added.' };
}

function validateFullRoster() {
    const hasLeader = activeRoster.some(op => op.isLeader);
    const isFull = activeRoster.length === 12;
    const eqValid = gameState.spentEp <= gameState.totalEp && killTeamEquipment.length <= MAX_EQUIPMENT_ITEMS;

    if (hasLeader && isFull && eqValid) {
        startGameBtn.disabled = false;
        showValidationMessage('Roster is valid. Ready to start!', true);
    } else {
        startGameBtn.disabled = true;
        let message = "Roster requires: ";
        if (!hasLeader) message += "1 Leader. ";
        if (!isFull) message += `${12 - activeRoster.length} more operatives.`;
        if (!eqValid) message += " Check equipment selection.";
        showValidationMessage(message.trim(), false);
    }
}

function startGame() {
    validateFullRoster();
    if (startGameBtn.disabled) {
        showValidationMessage("Cannot start game: Roster is not valid.", false);
        return;
    }
    rosterBuilderView.style.display = 'none';
    gameTrackerView.style.display = 'block';
    renderGameView();
    saveState();
}

function renderGameView() {
    renderDashboard();
    renderChosenEquipmentCards();
    renderReferenceAccordions();
    renderAllOperativeCards();
}

function renderDashboard() {
    turnValueSpan.textContent = gameState.turn;
    cpValueSpan.textContent = gameState.cp;
    vpValueSpan.textContent = gameState.vp;
}

function renderReferenceAccordions() {
    const makeSection = (title, items, isPloy) => {
        if (!items || items.length === 0) return '';
        const cards = items.map(item => {
            if (isPloy) {
                return `<div class="reference-card"><button class="ploy-button" data-ploy-name="${item.name}" data-cp-cost="${item.cp}">${item.name} (${item.cp}CP)</button><div class="reference-card-text"><small>${parseKeywords(item.text)}</small></div></div>`;
            }
            return `<div class="reference-card"><strong>${item.name}${item.cp ? ` (${item.cp}CP)` : ''}</strong><div class="reference-card-text"><small>${parseKeywords(item.text)}</small></div></div>`;
        }).join('');
        return `<button class="accordion">${title}</button><div class="accordion-content"><div class="reference-card-container">${cards}</div></div>`;
    };

    factionRulesAccordionContainer.innerHTML = makeSection('Faction Rules', factionRules);
    strategicPloysAccordionContainer.innerHTML = makeSection('Strategic Ploys', strategicPloys, true);
    firefightPloysAccordionContainer.innerHTML = makeSection('Firefight Ploys', firefightPloys, true);

    bindAccordions();
}

function renderChosenEquipmentCards() {
    if (!chosenEquipmentCardContainer) return;
    chosenEquipmentCardContainer.innerHTML = '';

    killTeamEquipment.forEach(eq => {
        const card = document.createElement('div');
        card.classList.add('chosen-equipment-card');

        const rulesHTML = (eq.rules || []).map(rule => `<p>${parseKeywords(rule)}</p>`).join('');

        const actionsHTML = (eq.uniqueActions || []).map(action => {
            return `<div class="equipment-action"><strong>${action.name}</strong><p>${parseKeywords(action.text)}</p></div>`;
        }).join('');

        const weaponsHTML = (eq.weaponProfiles || []).map(w => {
            return `<tr><td>${w.name}</td><td>${w.atk}</td><td>${w.skill}</td><td>${w.dmg}</td><td>${parseKeywords(w.rules)}</td></tr>`;
        }).join('');

        const cardHTML = `
            <strong>${eq.name} (${eq.epCost}EP)</strong>
            ${eq.flavorText ? `<em class="equipment-flavor-text">${eq.flavorText}</em>` : ''}
            <div class="equipment-rules">${rulesHTML}</div>
            ${actionsHTML ? `<h4>Actions</h4>${actionsHTML}` : ''}
            ${weaponsHTML ? `<h4>Profiles</h4><table class="weapon-table"><thead><tr><th>Name</th><th>A</th><th>HIT</th><th>D</th><th>Rules</th></tr></thead><tbody>${weaponsHTML}</tbody></table>` : ''}
        `;

        card.innerHTML = cardHTML;
        chosenEquipmentCardContainer.appendChild(card);
    });

    bindAccordions();
}

function parseKeywords(rulesString) {
    if (!rulesString || rulesString === '-') return '-';
    let processedString = rulesString;
    Object.keys(keywordGlossary).forEach(keyword => {
        const baseKeyword = keyword.split(' ')[0];
        const regex = new RegExp(`\\b${baseKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        processedString = processedString.replace(regex, `<span class="keyword">${baseKeyword}</span>`);
    });
    return processedString;
}

function renderAllOperativeCards() {
    activeCardsContainer.innerHTML = '';
    activeRoster.forEach(op => {
        const card = document.createElement('div');
        card.classList.add('operative-card');
        card.id = `op-${op.instanceId}`;

        const isInjured = op.currentWounds <= op.stats.wounds / 2;
        // Injury Stat Modifications
        const modifiedMoveVal = parseInt(op.stats.move);
        const modifiedMoveDisplay = isInjured ? `${Math.max(1, modifiedMoveVal - 2)}"` : op.stats.move;
        const modifiedAPLDisplay = isInjured ? Math.max(1, op.stats.apl - 1) : op.stats.apl;
        // Save usually doesn't change with injury. BS/WS handled per weapon.

        let tagsHTML = '';
        if (op.isLeader) tagsHTML += `<span class="operative-tag leader-tag">LEADER</span>`;
        if (op.isUnique) tagsHTML += `<span class="operative-tag unique-tag">UNIQUE</span>`;

        const weaponsHTML = op.weapons.map(w => {
            let skillDisplay = w.skill;
            if (w.skill.endsWith('+')) { // Check if it's a roll target
                const baseSkill = parseInt(w.skill);
                if (!isNaN(baseSkill)) {
                    skillDisplay = isInjured ? `<span class="stat-modifier-inline">${Math.min(6, baseSkill + 1)}+</span>` : w.skill;
                }
            }
            return `<tr><td>${w.name}</td><td>${w.atk}</td><td>${skillDisplay}</td><td>${w.dmg}</td><td>${parseKeywords(w.rules)}</td></tr>`;
        }).join('');

        const abilitiesHTML = op.abilities.map(a => `<li><strong>${a.name}:</strong> ${parseKeywords(a.text)}</li>`).join('');
        const actionsHTML = (op.uniqueActions || []).map(a => `<li><strong>${a.name}:</strong> ${parseKeywords(a.text)}</li>`).join('');

        const contextActions = [];
        killTeamEquipment.forEach(eq => {
            let eligible = true;
            if (eq.ineligible_ids && eq.ineligible_ids.includes(op.id)) eligible = false;
            if (eligible && eq.eligible_weapons) {
                const weaponNames = op.weapons.map(w => w.name);
                eligible = eq.eligible_weapons.some(w => weaponNames.includes(w));
            }
            if (eligible) contextActions.push(eq.name);
        });
        const contextButtonsHTML = contextActions.map(n => `<button class="context-btn">${n}</button>`).join('');

        const cardHTML = `
            <div class="card-header">
                <div class="card-title-area">
                    <h3>${op.name}</h3>
                    ${tagsHTML ? `<div class="operative-tags-container">${tagsHTML}</div>` : ''}
                </div>
                <div class="operative-core-stats">
                    <div class="core-stat">
                        <span class="core-stat-label">APL</span>
                        <span class="core-stat-value">${op.stats.apl}${isInjured ? `<span class="stat-modifier">(${modifiedAPLDisplay})</span>` : ''}</span>
                    </div>
                    <div class="core-stat">
                        <span class="core-stat-label">Move</span>
                        <span class="core-stat-value">${op.stats.move}${isInjured ? `<span class="stat-modifier">(${modifiedMoveDisplay})</span>` : ''}</span>
                    </div>
                    <div class="core-stat">
                        <span class="core-stat-label">Save</span>
                        <span class="core-stat-value">${op.stats.save}</span>
                    </div>
                    <div class="core-stat">
                        <span class="core-stat-label">Wounds</span>
                        <span class="core-stat-value">${op.stats.wounds}</span>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="health-bar" data-id="${op.instanceId}">
                    <div class="health-bar-fill"></div>
                    <div class="health-bar-text">${op.currentWounds} / ${op.stats.wounds}</div>
                </div>

                <div class="card-controls-area">
                    <button class="order-toggle" data-id="${op.instanceId}">Order: ${op.order}</button>
                    <button class="activation-status ready" data-id="${op.instanceId}">Ready</button>
                </div>

                ${weaponsHTML ? `<h4>Weapons</h4><table class="weapon-table"><thead><tr><th>Name</th><th>A</th><th>HIT</th><th>D</th><th>Rules</th></tr></thead><tbody>${weaponsHTML}</tbody></table>` : ''}
                ${abilitiesHTML ? `<h4>Abilities</h4><ul class="ability-list">${abilitiesHTML}</ul>` : ''}
                ${actionsHTML ? `<h4>Unique Actions</h4><ul class="action-list">${actionsHTML}</ul>` : ''}
                ${contextButtonsHTML ? `<div class="context-actions">${contextButtonsHTML}</div>` : ''}
            </div>
        `;

        card.innerHTML = cardHTML;
        activeCardsContainer.appendChild(card);
        updateCardVisualState(op.instanceId); // Ensure this is called
    });
}


function handleHealthClick(instanceId, event, barEl) {
    const bar = barEl || event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const barWidth = rect.width;
    const amount = (clickX > barWidth / 2) ? -1 : 1;
    changeWounds(instanceId, amount);
}

function changeWounds(instanceId, amount) {
    const operative = activeRoster.find(op => op.instanceId == instanceId);
    if (!operative) return;
    const wasInjured = operative.currentWounds <= operative.stats.wounds / 2;
    operative.currentWounds = Math.max(0, Math.min(operative.stats.wounds, operative.currentWounds + amount));
    const isNowInjured = operative.currentWounds <= operative.stats.wounds / 2;

    if (wasInjured !== isNowInjured || (amount !==0 && (operative.currentWounds === 0 || operative.currentWounds === operative.stats.wounds))) {
        renderAllOperativeCards();
    } else {
        updateCardVisualState(instanceId);
    }
    saveState();
}

function toggleOrder(instanceId) {
    const operative = activeRoster.find(op => op.instanceId == instanceId);
    if (!operative) return;
    operative.order = (operative.order === 'Conceal') ? 'Engage' : 'Conceal';
    updateCardVisualState(instanceId);
    saveState();
}

function toggleActivation(instanceId) {
    const operative = activeRoster.find(op => op.instanceId == instanceId);
    if (!operative) return;
    operative.isActivated = !operative.isActivated;
    updateCardVisualState(instanceId);
    saveState();
}

function updateCardVisualState(instanceId) {
    const operative = activeRoster.find(op => op.instanceId == instanceId);
    const card = document.getElementById(`op-${instanceId}`);
    if (!operative || !card) return;
    
    // Health Bar
    const healthFill = card.querySelector('.health-bar-fill');
    const healthText = card.querySelector('.health-bar-text');
    const healthPercentage = Math.max(0,(operative.currentWounds / operative.stats.wounds) * 100);
    healthFill.style.width = `${healthPercentage}%`;
    healthText.textContent = `${operative.currentWounds} / ${operative.stats.wounds}`;

    // Order Toggle Button
    const orderBtn = card.querySelector('.order-toggle');
    orderBtn.textContent = `Order: ${operative.order}`;
    orderBtn.classList.toggle('conceal', operative.order === 'Conceal');
    orderBtn.classList.toggle('engage', operative.order === 'Engage');

    // Activation Button
    const activationBtn = card.querySelector('.activation-status');
    activationBtn.classList.toggle('ready', !operative.isActivated);
    activationBtn.classList.toggle('activated', operative.isActivated);
    activationBtn.textContent = operative.isActivated ? 'Activated' : 'Ready';

    // Card State Classes (Injury, Wounded, Incapacitated, Orders)
    card.classList.remove('is-wounded', 'is-injured', 'is-activated', 'is-incapacitated', 'order-conceal', 'order-engage'); // Reset all
    
    // Health bar fill color based on state
    if (operative.currentWounds === 0) {
        healthFill.style.backgroundColor = 'var(--text-color-subtle)'; // Grey for incapacitated
        card.classList.add('is-incapacitated');
    } else if (operative.currentWounds <= operative.stats.wounds / 2) {
        healthFill.style.backgroundColor = 'var(--health-bar-injured)'; // Yellow/Orange
        card.classList.add('is-injured');
    } else if (operative.currentWounds < operative.stats.wounds) {
        healthFill.style.backgroundColor = 'var(--health-bar-full)'; // Still green but wounded
        card.classList.add('is-wounded'); // Apply wounded if not injured
    } else { // Full health
        healthFill.style.backgroundColor = 'var(--health-bar-full)';
    }

    card.classList.add(operative.order === 'Conceal' ? 'order-conceal' : 'order-engage');

    if (operative.isActivated && operative.currentWounds > 0) { // Don't add if incapacitated
        card.classList.add('is-activated');
    }
}

function readyAllAndNextTurn() {
    gameState.turn++;
    if (gameState.turn > 4) {
        alert("Game Over (End of Turning Point 4)");
        gameState.turn = 1;
    }
    gameState.cp = Math.min(6, gameState.cp + 1);
    activeRoster.forEach(op => {
        op.isActivated = false;
        // updateCardVisualState(op.instanceId); // This will be handled by renderAllOperativeCards
    });
    renderAllOperativeCards();
    renderDashboard();
    saveState();
}

function modifyStateValue(key, amount) {
    gameState[key] += amount;
    if (key === 'cp' && gameState[key] > 6) gameState[key] = 6;
    if (gameState[key] < 0) gameState[key] = 0;
    renderDashboard();
    saveState();
}

function usePloy(name, cpCost, buttonEl) {
    if (gameState.cp < cpCost) return;
    gameState.cp -= cpCost;
    renderDashboard();
    saveState();
    if (buttonEl) {
        buttonEl.disabled = true;
        buttonEl.classList.add('ploy-flash');
        setTimeout(() => {
            buttonEl.classList.remove('ploy-flash');
            buttonEl.disabled = false;
        }, 500);
    }
    if (cpMessageSpan) {
        cpMessageSpan.textContent = `-${cpCost}CP`;
        cpMessageSpan.classList.add('flash');
        setTimeout(() => {
            cpMessageSpan.classList.remove('flash');
            cpMessageSpan.textContent = '';
        }, 600);
    }
}

function showTooltip(keyword, event) {
    removeTooltip();
    let definition = 'Definition not found.';
    const foundKey = Object.keys(keywordGlossary)
        .find(k => keyword.toLowerCase().includes(k.split(' ')[0].toLowerCase()));
    if (foundKey) definition = keywordGlossary[foundKey];
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = definition;
    document.body.appendChild(tooltip);
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
}

function removeTooltip() {
    const existing = document.querySelector('.tooltip');
    if (existing) existing.remove();
}


function bindStaticEventListeners() {
    startGameBtn.addEventListener('click', startGame);
    readyAllBtn.addEventListener('click', readyAllAndNextTurn);
    resetRosterBtn.addEventListener('click', resetRoster);
    
    document.body.addEventListener('click', e => {
        const target = e.target;
        if (target.matches('.cp-mod')) modifyStateValue('cp', parseInt(target.dataset.amount));
        else if (target.matches('.vp-mod')) modifyStateValue('vp', parseInt(target.dataset.amount));
        else if (target.matches('.order-toggle')) toggleOrder(target.dataset.id);
        else if (target.matches('.activation-status')) toggleActivation(target.dataset.id);
        else if (target.closest('.health-bar')) {
            const bar = target.closest('.health-bar');
            handleHealthClick(bar.dataset.id, e, bar);
        }
        
        else if (target.matches('.ploy-button')) usePloy(target.dataset.ployName, parseInt(target.dataset.cpCost), target);
        else if (target.matches('.keyword')) showTooltip(target.textContent, e);
        else if (!target.closest('.keyword')) removeTooltip();
    });

}

function bindAccordions() {
    document.querySelectorAll('.accordion').forEach(btn => {
        const content = btn.nextElementSibling;
        if (!content) return;
        btn.onclick = () => {
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                const finalize = () => {
                    content.style.maxHeight = 'none';
                    content.removeEventListener('transitionend', finalize);
                };
                content.addEventListener('transitionend', finalize);
            } else {
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    requestAnimationFrame(() => {
                        content.style.maxHeight = '0';
                    });
                }
            }
        };
    });
}
