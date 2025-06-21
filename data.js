// data.js

const keywordGlossary = {
    "Balanced": "You can re-roll one of your attack dice.",
    "Blast X\"": "The target you select is the primary target. After shooting the primary target, shoot with this weapon against each secondary target in an order of your choice (roll each sequence separately). Secondary targets are other operatives visible to and within X of the primary target, e.g. Blast 2\" (they are all valid targets, regardless of a Conceal order). Secondary targets are in cover and obscured if the primary target was.",
    "Ceaseless": "You can re-roll any of your attack dice results of one result (e.g. results of 2).",
    "Devastating X": "Each retained critical success immediately inflicts X damage on the operative this weapon is being used against. If the rule starts with a distance (e.g. 1\" Devastating X), inflict X damage on that operative and each other operative visible to and within that distance of it. Note that success isn’t discarded after doing so – it can still be resolved later in the sequence.",
    "Heavy": "An operative cannot use this weapon in an activation or counteraction in which it moved, and it cannot move in an activation or counteraction in which it used this weapon.",
    "Heavy (Reposition only)": "An operative cannot use this weapon in an activation or counteraction in which it performed any action other than Reposition. An operative cannot perform any action other than Reposition in an activation or counteraction in which it used this weapon.",
    "Lethal X+": "Your attack dice results of X+ are critical hits (e.g., Lethal 5+ means 5s and 6s are crits).",
    "Piercing X": "The defender collects X less defence dice (to a minimum of 0). E.g., with Piercing 1, if the defender would normally roll 3 defence dice, they instead roll 2.",
    "Rending": "If you score any critical hits, you can convert one of your normal hits into a critical hit.",
    "Salvo": "Select up to two valid targets. Shoot with this weapon against both of them in an order of your choice (roll each sequence separately).",
    "Silent": "An operative can perform a Shoot action with this weapon while it has a Conceal order.",
    "Stun": "If you score any critical hits, subtract 1 from the target's APL for its next activation.",
    "Torrent X\"": "This weapon makes a shooting attack against the primary target and every other operative within X\" of it and within this weapon's range.",
    "Relentless": "You can re-roll any of your attack dice.",
    "Seek": "When selecting a valid target, operatives with a Conceal order cannot use terrain for cover. If the rule is Seek Light, they cannot use Light terrain for cover. While this can allow operatives to be targeted (if visible), it doesn’t remove their cover save.",
    "Seek Light": "Operatives with a Conceal order cannot use Light terrain for cover when selected as a valid target.",
    "Severe": "If you don’t retain any critical successes, you can change one of your normal successes to a critical success. Any rules that take effect as a result of retaining a critical success still do."
};

const factionRules = [
    { name: 'Farstalker', text: 'In the Ready step of each Strategy phase, you can change the order of up to three friendly FARSTALKER KINBAND operatives that are not within control range of enemy operatives.' },
    { name: 'Counteract', text: 'Whenever it’s your turn to counteract, you can change the order of one friendly FARSTALKER KINBAND operative that’s not within control range of enemy operatives instead. This still counts as you counteracting, but doesn’t count as that friendly operative’s counteraction for this turning point.' }
];

const strategicPloys = [
    { name: 'Cut-Throats', cp: 1, text: "Until the end of the turning point, add 1 to the Attacks characteristic of friendly FARSTALKER KINBAND operatives’ melee weapons (to a maximum of 5)." },
    { name: 'Prey', cp: 1, text: "Select one enemy operative. Until the end of the turning point, friendly operatives' ranged weapons have the Balanced and Severe rules against that target. If a weapon already has Balanced, it gains Ceaseless and Severe instead." },
    { name: 'Bound', cp: 1, text: "During each friendly FARSTALKER KINBAND operative’s activation, you can ignore the first vertical distance of 2\" they move during one climb up." }
];

const firefightPloys = [
    { name: 'Savage Ambush', cp: 1, text: "Use during a Fight action when a ready friendly operative (with Light/Heavy terrain in its control range) is selected to fight against. In the Resolve Attack Dice step of that sequence, you resolve the first attack dice (i.e. defender instead of attacker)." },
    { name: 'Slip Away', cp: 1, text: "Use during a friendly operative's activation, before or after it performs an action. That operative can perform the Fall Back action for 1 less AP." },
    { name: 'Poach', cp: 1, text: "Use during a friendly operative's activation. Until the end of that activation, that operative only needs to contest a marker to perform Pick Up Marker or mission actions (instead of controlling it)." },
    { name: 'Vengeance for the Kinband', cp: 1, text: "Use when a friendly operative is incapacitated. Select the enemy that did it. Until the end of the battle, friendly operatives gain the Relentless weapon rule when attacking that enemy. You cannot use this ploy again during the battle until that enemy operative is incapacitated." }
];

const factionEquipment = [
    {
        name: 'Piercing Shot',
        epCost: 1,
        flavorText: 'The Kroot make use of many forms of specially crafted ammunition. Bullets tipped with hardened alloys can punch through cover and armour alike.',
        rules: [
            "Once per turning point, when a friendly FARSTALKER KINBAND operative is performing the Shoot action and you select a Kroot rifle, Kroot scattergun or dual Kroot pistols (focused), you can use this rule. If you do, until the end of that action, that weapon has the Piercing 1 weapon rule. You cannot use the Piercing Shot and Toxin Shot rule during the same action."
        ],
        eligible_weapons: ['Kroot rifle', 'Kroot scattergun', 'Dual Kroot pistols (focused)']
    },
    {
        name: 'Toxin Shot',
        epCost: 1,
        flavorText: 'Kroot toxin bullets contain reservoirs of venom extracted from various alien fauna, all of which is incredibly lethal.',
        rules: [
            "Once per turning point, when a friendly FARSTALKER KINBAND operative is performing the Shoot action and you select a Kroot rifle, Kroot scattergun or dual Kroot pistols (focused), you can use this rule. If you do, until the end of that action, that weapon has the Lethal 5+ and Stun weapon rules. You cannot use the Piercing Shot and Toxin Shot rule during the same action."
        ],
        eligible_weapons: ['Kroot rifle', 'Kroot scattergun', 'Dual Kroot pistols (focused)']
    },
    {
        name: 'Meat',
        epCost: 1,
        flavorText: 'Kroot physiologies are far more resilient than their wiry frames suggest. The ingestion of raw meat only serves to bolster their regenerative abilities.',
        rules: [
            "Once per turning point, when a friendly FARSTALKER KINBAND operative (excluding HOUND) is activated, if it's not within control range of enemy operatives, you can use this rule. If you do, that friendly operative regains D3+1 lost wounds."
        ],
        ineligible_ids: ['hound']
    },
    {
        name: 'Trophy',
        epCost: 2,
        flavorText: 'Kroot Farstalkers seek to cut down the most powerful of foes. They will aggressively pursue any enemy they judge worthy and harvest trophies from the corpse.',
        rules: [
            "Once per battle, during a friendly FARSTALKER KINBAND operative's activation (excluding HOUND), before or after it performs an action, if it's not within control range of enemy operatives, you can use this rule. If you do, add 1 to that friendly operative's APL stat until the end of its activation."
        ],
        ineligible_ids: ['hound']
    }
];


const universalEquipment = [
    {
        name: 'Portable Barricade',
        epCost: 2,
        flavorText: 'Little more than a suppression shield with armoured feet, these barricades can be hefted and borne forwards to provide mobile cover.',
        rules: [
            'A portable barricade is Light, Protective and Portable terrain. Before the battle, you can set it up wholly within your territory, on the killzone floor and more than 2" from other equipment terrain features, access points and Accessible terrain.',
            'Protective: While an operative is in cover from this terrain feature, improve its Save stat by 1 (to a maximum of 2+).',
            'Portable: This terrain feature only provides cover while an operative is connected to it and if the shield is intervening (ignore its feet). Operatives connected to the inside of it can perform the following unique action during the battle.'
        ],
        uniqueActions: [
            {
                name: 'MOVE WITH BARRICADE (1AP)',
                text: "The same as the Reposition action, except the active operative can move no more than its Move stat minus 2\" and cannot climb, drop, jump or use any kill team’s rules that remove it and set it back up again (e.g. HEARTHKYN SALVAGER FLY, MANDRAKE SHADOW PASSAGE). Before this operative moves, remove the portable barricade it’s connected to. After it moves, set up the portable barricade so it’s connected again, but the portable barricade cannot be set up within 2\" of other equipment terrain features, access points or Accessible terrain. If this is not possible, the portable barricade is not set up again. This action is treated as a Reposition action. An operative cannot perform this action while within control range of an enemy operative, or during the same activation in which it performed the Fall Back or Charge action."
            }
        ]
    },
    {
        name: 'Utility Grenades',
        epCost: 3,
        flavorText: 'From neuro-suppressant psybombs to smoke-belching chemical charges, grenades of this sort can suppress the enemy and be the difference between life and death.',
        rules: [
            'When you select this equipment, select two utility grenades (2 smoke, 2 stun, or 1 smoke and 1 stun). Each selection is a unique action your operatives can perform, but your kill team can only perform that action a total number of times during the battle equal to your selection.'
        ],
        uniqueActions: [
            {
                name: 'SMOKE GRENADE (1AP)',
                text: 'Place one of your Smoke Grenade markers within 6" of this operative. It must be visible to this operative, or on Vantage terrain of a terrain feature that’s visible to this operative. The marker creates an area of smoke 1" horizontally and unlimited height vertically from (but not below) it. While an operative is wholly within an area of smoke, it’s obscured to operatives more than 2" from it, and vice versa. In addition, whenever an operative is shooting an enemy operative wholly within an area of smoke, ignore the Piercing weapon rule unless they are within 2" of each other. In the Ready step of the next Strategy phase, roll one D3. Remove that Smoke Grenade marker after a number of activations equal to that D3 have been completed or at the end of the turning point (whichever comes first). An operative cannot perform this action while within control range of an enemy operative, or if you have reached the total number of times your kill team can perform it.'
            },
            {
                name: 'STUN GRENADE (1AP)',
                text: 'Select one enemy operative visible to and within 6" of this operative. That operative and each other operative within 1" of it takes a stun test. For an operative to take a stun test, roll one D6: on a 3+, subtract 1 from its APL stat until the end of its next activation. An operative cannot perform this action while within control range of an enemy operative, or if you have reached the total number of times your kill team can perform it.'
            }
        ]
    },
    {
        name: 'Explosive Grenades',
        epCost: 3,
        flavorText: 'A variety of offensive grenades are employed by the forces of the 41st Millennium. These range from simple fragmentation grenades to plasma and gravitic concussion grenades, while even more exotic devices are used to crack open enemy armour.',
        rules: [
            'When you select this equipment, select two explosive grenades (2 frag, 2 krak, or 1 frag and 1 krak). Each selection is a ranged weapon your operatives can use, but your kill team can only use that weapon a total number of times during the battle equal to your selection.'
        ],
        weaponProfiles: [
            { name: 'Frag grenade', atk: 4, skill: '4+', dmg: '2/4', rules: 'Range 6", Blast 2", Saturate' },
            { name: 'Krak grenade', atk: 4, skill: '4+', dmg: '4/5', rules: 'Range 6", Piercing 1, Saturate' }
        ]
    },
    {
        name: 'Climbing Gear',
        epCost: 1,
        flavorText: 'Essential for gaining a vertical advantage in dense terrain.',
        rules: [
            'This operative does not increase distance for climbing.'
        ]
    }
];
const operativesData = [
    {
        id: 'kill_broker',
        name: 'Kroot Kill-Broker',
        isLeader: true, isUnique: true,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 9 },
        weapons: [
            { name: 'Kroot rifle', atk: 4, skill: '3+', dmg: '3/4', rules: '-' },
            { name: 'Pulse weapon', atk: 4, skill: '4+', dmg: '4/5', rules: '-' },
            { name: 'Ritual blade', atk: 4, skill: '3+', dmg: '4/5', rules: '-' }
        ],
        abilities: [
            { name: 'Call The Kill: STRATEGIC GAMBIT', text: "Select one enemy operative to be your mark for the turning point. Whenever a friendly FARSTALKER KINBAND operative is shooting against, fighting against or retaliating against your mark, that friendly operative's weapons have the Balanced weapon rule. Whenever your mark is incapacitated, you can select a new enemy operative to be your mark for the turning point (and can continue to do so during this turning point)." },
            { name: 'Victory Shriek', text: "Whenever your mark is incapacitated, you can select one friendly FARSTALKER KINBAND operative within 6\" of this operative. Until the end of the battle, that operative's weapons have the Balanced weapon rule. Each friendly operative can only be selected for this rule once per battle." }
        ]
    },
    {
        id: 'bow_hunter',
        name: 'Kroot Bow-hunter',
        isUnique: true,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 8 },
        weapons: [
            { name: 'Accelerator bow (fused arrow)', atk: 4, skill: '3+', dmg: '4/5', rules: 'Piercing 1' },
            { name: 'Accelerator bow (glide arrow)', atk: 4, skill: '3+', dmg: '3/4', rules: 'Silent' },
            { name: 'Accelerator bow (voltaic arrow)', atk: 4, skill: '3+', dmg: '3/5', rules: 'Blast 1"' },
            { name: 'Blade', atk: 3, skill: '3+', dmg: '3/4', rules: '-' }
        ],
        abilities: [],
        uniqueActions: [
            { name: 'ENERGISE (1AP)', text: "Until the end of the turning point or until this operative has shot with its accelerator bow (whichever comes first), all profiles of its accelerator bow have the Lethal 5+ weapon rule. This operative cannot perform this action while within control range of an enemy operative." }
        ]
    },
    {
        id: 'cut_skin',
        name: 'Kroot Cut-skin',
        isUnique: true,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 8 },
        weapons: [
            { name: 'Cut-skin\'s blades', atk: 4, skill: '3+', dmg: '3/4', rules: 'Ceaseless, Lethal 5+' }
        ],
        abilities: [
            { name: 'Vicious Duellist', text: 'Whenever this operative is fighting or retaliating, for each attack dice your opponent discards as a fail, inflict 1 damage on the enemy operative in that sequence.' },
            { name: 'Savage Assault', text: 'The first time this operative performs the Fight action during each of its activations, if neither it nor the enemy operative in that sequence is incapacitated, this operative can immediately perform a free Fight action afterwards, but you cannot select any other enemy operative to fight against during that action (and only if it’s still valid to fight against). This takes precedence over action restrictions.' }
        ]
    },
    {
        id: 'hound',
        name: 'Kroot Hound',
        isUnique: false,
        stats: { apl: 2, move: '8"', save: '5+', wounds: 7 },
        weapons: [
            { name: 'Ripping fangs', atk: 4, skill: '3+', dmg: '3/4', rules: 'Rending' }
        ],
        abilities: [
            { name: 'Beast', text: 'Cannot perform actions other than Charge, Dash, Fall Back, Fight, Gather, Guard, Reposition, Pick Up Marker and Place Marker. It cannot use any weapons that aren’t on its datacard.' },
            { name: 'Bad-tempered', text: 'Whenever an enemy operative performs the Fight action, if this operative is a valid operative to fight against, you can force them to select this operative to fight against instead. Whenever an enemy operative ends the Charge action within control range of another friendly FARSTALKER KINBAND operative within 3" of this operative, if this operative isn’t within control range of enemy operatives, this operative can immediately perform a free Charge action, but must end that move within control range of that enemy operative.' }
        ],
        uniqueActions: [
            { name: 'GATHER (1AP)', text: 'Perform a free Dash or Reposition action with this operative. During that move, you can perform a free Pick Up Marker or Place Marker action with this operative (you can determine control during that action to do so), and any remaining move distance it had from the Dash or Reposition action can be used after it does so.' }
        ]
    },
    {
        id: 'cold_blood',
        name: 'Kroot Cold-blood',
        isUnique: true,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 9 },
        weapons: [
            { name: 'Kroot rifle', atk: 4, skill: '3+', dmg: '3/4', rules: '-' },
            { name: 'Blade', atk: 3, skill: '3+', dmg: '3/4', rules: '-' }
        ],
        abilities: [
            { name: 'Hardy', text: 'Whenever an attack dice would inflict Critical Dmg on this operative, you can choose for that attack dice to inflict Normal Dmg instead.' },
            { name: 'Cold-blooded', text: "Whenever this operative is shooting against, fighting against or retaliating against a wounded enemy operative, this operative’s weapons have the Lethal 5+ weapon rule; if that enemy operative is also injured, this operative’s weapons also have the Rending weapon rule." }
        ]
    },
    {
        id: 'heavy_gunner',
        name: 'Kroot Heavy Gunner',
        isUnique: true,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 8 },
        weapons: [
            { name: 'Dvorgite skinner', atk: 5, skill: '2+', dmg: '3/3', rules: 'Range 6", Heavy (Reposition only), Piercing 2, Torrent 2"' },
            { name: 'Londaxi tribalest', atk: 5, skill: '4+', dmg: '4/5', rules: 'Heavy (Reposition only), Piercing 1, Rending' },
            { name: 'Blade', atk: 3, skill: '3+', dmg: '3/4', rules: '-' }
        ],
        abilities: []
    },
    {
        id: 'long_sight',
        name: 'Kroot Long-sight',
        isUnique: true,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 8 },
        weapons: [
            { name: 'Kroot hunting rifle (concealed)', atk: 4, skill: '2+', dmg: '3/3', rules: 'Heavy, Devastating 3, Silent, Concealed Position*' },
            { name: 'Kroot hunting rifle (mobile)', atk: 4, skill: '3+', dmg: '3/4', rules: '-' },
            { name: 'Kroot hunting rifle (stationary)', atk: 4, skill: '2+', dmg: '3/3', rules: 'Heavy, Devastating 3' },
            { name: 'Blade', atk: 3, skill: '3+', dmg: '3/4', rules: '-' }
        ],
        abilities: [
            { name: '*Concealed Position', text: 'This operative can only use this weapon the first time it performs the Shoot action during the battle.' }
        ],
        uniqueActions: [
            { name: 'LONG-SIGHT (1AP)', text: "Until the start of this operative's next activation:\n• The concealed and stationary profiles of its Kroot hunting rifle have the Lethal 5+ weapon rule.\n• Whenever it's shooting with its Kroot hunting rifle, enemy operatives cannot be obscured.\nThis operative cannot perform this action while within control range of an enemy operative." }
        ]
    },
    {
        id: 'pistolier',
        name: 'Kroot Pistolier',
        isUnique: true,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 8 },
        weapons: [
            { name: 'Dual Kroot pistols (focused)', atk: 4, skill: '3+', dmg: '3/4', rules: 'Range 8", Ceaseless, Lethal 5+' },
            { name: 'Dual Kroot pistols (salvo)', atk: 4, skill: '3+', dmg: '3/4', rules: 'Range 8", Salvo*' }, // *Salvo notes it's in glossary
            { name: 'Blade', atk: 3, skill: '3+', dmg: '3/4', rules: '-' }
        ],
        abilities: [
            { name: 'Quick Draw', text: 'Once per turning point, when an enemy operative is performing the Shoot action and this operative is selected as the valid target (or if it will be a secondary target from the Blast weapon rule), if this operative is ready, you can interrupt that action to use this rule. If you do, this operative can immediately perform a free Shoot action with its dual Kroot pistols (focused) against that enemy operative (you can change its order to Engage to do so), but that enemy operative must be a valid target.' }
            // *Salvo is a weapon rule, correctly handled by the glossary.
        ]
    },
    {
        id: 'stalker',
        name: 'Kroot Stalker',
        isUnique: true,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 8 },
        weapons: [
            { name: 'Kroot scattergun', atk: 4, skill: '3+', dmg: '3/3', rules: 'Range 6"' },
            { name: 'Stalker\'s blade', atk: 4, skill: '3+', dmg: '3/4', rules: 'Balanced, Rending' }
        ],
        abilities: [
            { name: 'Stalker', text: 'This operative can perform the Charge action while it has a Conceal order.' }
        ],
        uniqueActions: [
            { name: 'STEALTH ATTACK (2AP)', text: "Perform a free Charge action with this operative, but don’t exceed its Move stat (i.e. don’t add 2\"). Then immediately perform a free Fight action with this operative. The first time you strike during that action, you can immediately resolve another of your successes as a strike (before your opponent). This operative cannot perform this action while it has an Engage order, while within control range of an enemy operative, or if it isn’t within 1\" of Light or Heavy terrain." }
        ]
    },
    {
        id: 'tracker',
        name: 'Kroot Tracker',
        isUnique: true,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 8 },
        weapons: [
            { name: 'Kroot rifle', atk: 4, skill: '4+', dmg: '3/4', rules: '-' },
            { name: 'Blade', atk: 3, skill: '3+', dmg: '3/4', rules: '-' }
        ],
        abilities: [],
        uniqueActions: [
            { name: 'MARKED FOR THE HUNT (1AP)', text: "Remove your Pech’ra marker from the killzone (if any). Then place your Pech’ra marker visible to this operative, or on Vantage terrain of a terrain feature that’s visible to this operative. Whenever a friendly FARSTALKER KINBAND operative is shooting an enemy operative that has that marker within its control range, that friendly operative’s ranged weapons have the Seek Light weapon rule. This operative cannot perform this action while within control range of an enemy operative." },
            { name: 'FROM THE EYE ABOVE (1AP)', text: "SUPPORT. Select one other friendly FARSTALKER KINBAND operative visible to and within 6\" of this operative. Until the end of that operative’s next activation, add 1 to its APL stat. This operative cannot perform this action while within control range of an enemy operative." }
        ]
    },
    {
        id: 'warrior',
        name: 'Kroot Warrior',
        isUnique: false,
        stats: { apl: 2, move: '6"', save: '5+', wounds: 8 },
        weapons: [
            { name: 'Kroot rifle', atk: 4, skill: '4+', dmg: '3/4', rules: '-' },
            { name: 'Kroot scattergun', atk: 4, skill: '3+', dmg: '3/3', rules: 'Range 6"' },
            { name: 'Blade', atk: 3, skill: '3+', dmg: '3/4', rules: '-' }
        ],
        abilities: [
            { name: 'Ready for Anything', text: "Once per turning point, during a friendly WARRIOR operative’s activation, you can use the Meat, Piercing Shot or Toxin Shot rule (see faction equipment) for that operative. Doing so doesn’t count for its once per turning point limit." }
        ]
    }
];