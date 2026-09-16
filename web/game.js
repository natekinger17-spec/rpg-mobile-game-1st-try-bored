const TILE_SIZE = 32;
const SAVE_KEY = 'ashenfall-rpg-save-v3';
const LOG_LIMIT = 12;

const QUEST_ORDER = ['cellar_sweep', 'wolf_hunt', 'orc_threat', 'troll_hunt', 'crypt_ward'];
const QUEST_LABELS = {
  cellar_sweep: 'Cellar Sweep',
  wolf_hunt: 'Wolf Hunt',
  orc_threat: 'Orc Threat',
  troll_hunt: 'Troll Hollow',
  crypt_ward: 'Sunken Crypt'
};

const WEAPONS = {
  club: { name: 'Rough Club', minDamage: 3, maxDamage: 5, crit: 0.05, icon: 'club' },
  knife: { name: 'Rusty Knife', minDamage: 4, maxDamage: 6, crit: 0.15, icon: 'knife' },
  iron_sword: { name: 'Iron Sword', minDamage: 6, maxDamage: 9, crit: 0.12, icon: 'sword' },
  spiked_mace: { name: 'Spiked Mace', minDamage: 8, maxDamage: 12, crit: 0.1, icon: 'mace' }
};

const ARMOR = {
  tattered_tunic: { name: 'Tattered Tunic', defense: 1, icon: 'tattered_tunic', slot: 'body' },
  worn_boots: { name: 'Worn Boots', defense: 1, icon: 'worn_boots', slot: 'feet' },
  buckler: { name: 'Buckler', defense: 2, icon: 'buckler', slot: 'offhand' },
  leather_vest: { name: 'Leather Vest', defense: 3, icon: 'leather_vest', slot: 'body' },
  chainmail: { name: 'Chainmail Coat', defense: 4, icon: 'chainmail', slot: 'body' }
};

const CHARMS = {
  sun_amulet: { name: 'Sun Amulet', icon: 'amulet', manaBonus: 6, spellPower: 2 }
};

const ITEMS = {
  small_potion: { name: 'Small Potion', heal: 10, icon: 'small_potion' },
  mana_potion: { name: 'Mana Potion', mana: 8, icon: 'mana_potion' },
  rat_tail: { name: 'Rat Tail Trophy' },
  bat_wing: { name: 'Bat Wing Trophy' },
  wolf_pelt: { name: 'Wolf Pelt' },
  dire_pelt: { name: 'Dire Wolf Pelt' },
  orc_badge: { name: 'Orc Badge' },
  troll_tusk: { name: 'Troll Tusk' },
  troll_iron: { name: 'Troll Iron Cache' },
  bone_token: { name: 'Bone Token' },
  crypt_relic: { name: 'Crypt Relic' },
  stolen_banner: { name: 'Stolen Banner', icon: 'stolen_banner' }
};

const SPELLS = {
  minor_heal: { name: 'Cast Heal', cost: 4 },
  arcane_burst: { name: 'Arcane Burst', cost: 6 }
};

const ENEMIES = {
  rat: { name: 'Cave Rat', maxHp: 8, attack: 2, icon: 'rat', exp: 3, gold: [2, 4], drop: 'rat_tail' },
  bat: { name: 'Cave Bat', maxHp: 6, attack: 3, icon: 'bat', exp: 4, gold: [2, 4], drop: 'bat_wing' },
  wolf: { name: 'Wolf', maxHp: 12, attack: 4, icon: 'wolf', exp: 7, gold: [5, 8], drop: 'wolf_pelt' },
  dire_wolf: { name: 'Dire Wolf', maxHp: 18, attack: 6, icon: 'wolf', exp: 11, gold: [8, 12], drop: 'dire_pelt' },
  orc: { name: 'Orc Raider', maxHp: 16, attack: 5, icon: 'orc', exp: 10, gold: [7, 12], drop: 'orc_badge' },
  orc_chieftain: { name: 'Orc Chieftain', maxHp: 28, attack: 8, icon: 'orc', exp: 20, gold: [18, 26], drop: 'orc_badge' },
  troll: { name: 'Troll', maxHp: 24, attack: 7, icon: 'troll', exp: 16, gold: [12, 18], drop: 'troll_tusk' },
  troll_champion: { name: 'Troll Champion', maxHp: 34, attack: 10, icon: 'troll', exp: 28, gold: [24, 34], drop: 'troll_iron' },
  skeleton: { name: 'Skeleton', maxHp: 22, attack: 7, icon: 'skeleton', exp: 18, gold: [10, 16], drop: 'bone_token' },
  bone_guard: { name: 'Bone Guard', maxHp: 32, attack: 11, icon: 'skeleton', exp: 32, gold: [28, 38], drop: 'crypt_relic' }
};

const MAP_DEFS = {
  town: {
    name: 'Ashenfall',
    story: 'Town hub with healing, trade, forging, and spell lore.',
    layout: [
      '################',
      '#,,,,,::::,,,,,#',
      '#,,...:..:...,,#',
      '#,,....:.....,,#',
      '#,,....::....,,#',
      '#:............:#',
      '#:....,,,,....:#',
      '#,,....::....,,#',
      '#,,..........,,#',
      '#,,...:<....>,,#',
      '#,,,,,::::,,,,,#',
      '################'
    ],
    npcs: [
      { id: 'healer', name: 'Sister Hale', pos: [4, 3] },
      { id: 'smith', name: 'Forgehand Bram', pos: [8, 3] },
      { id: 'captain', name: 'Captain Ivo', pos: [11, 3] },
      { id: 'acolyte', name: 'Acolyte Nera', pos: [4, 5] },
      { id: 'hunter', name: 'Brann the Hunter', pos: [8, 5] },
      { id: 'elder', name: 'Elder Mara', pos: [4, 8] },
      { id: 'trader', name: 'Trader Sela', pos: [11, 8] }
    ],
    exits: [
      { pos: [7, 9], targetMap: 'cellar', targetPos: [2, 10], message: 'You descend into the old cellar.' },
      { pos: [12, 9], targetMap: 'meadow', targetPos: [1, 5], message: 'You follow the road toward the meadow.' }
    ],
    enemies: [],
    items: []
  },
  cellar: {
    name: 'Old Cellar',
    story: 'Starter dungeon full of vermin and scrap gear.',
    layout: [
      '################',
      '#..............#',
      '#..##.....##...#',
      '#..............#',
      '#......##......#',
      '#..............#',
      '#..##......##..#',
      '#..............#',
      '#......##......#',
      '#..............#',
      '#.<.##......#..#',
      '################'
    ],
    npcs: [],
    exits: [
      { pos: [2, 10], targetMap: 'town', targetPos: [7, 8], message: 'You climb back into town.' }
    ],
    enemies: [
      { kind: 'rat', pos: [6, 2] },
      { kind: 'rat', pos: [10, 3] },
      { kind: 'rat', pos: [12, 9] },
      { kind: 'bat', pos: [8, 7] },
      { kind: 'bat', pos: [13, 5] }
    ],
    items: [
      { id: 'knife', pos: [4, 5] },
      { id: 'worn_boots', pos: [11, 7] },
      { id: 'small_potion', pos: [5, 9] }
    ]
  },
  meadow: {
    name: 'Briar Meadow',
    story: 'Roadside fields where wolves and raiders roam.',
    layout: [
      '################',
      '#,,,,,,,,,,,,,,#',
      '#,,~~~,,...>.,,#',
      '#,,~~~~,......,#',
      '#,:::::,,..,,.,#',
      '#<:....,,,,...:#',
      '#,:....,,,,...:#',
      '#,:..,,....,..:#',
      '#,:..,,....,>..#',
      '#,:::::...,,..,#',
      '#,,,,,,,,,,,,,,#',
      '################'
    ],
    npcs: [],
    exits: [
      { pos: [1, 5], targetMap: 'town', targetPos: [11, 9], message: 'You head back through the town road.' },
      { pos: [11, 2], targetMap: 'orc_den', targetPos: [2, 10], message: 'You enter the cracked cave mouth.' },
      { pos: [12, 8], targetMap: 'troll_hollow', targetPos: [2, 10], message: 'You push through the briars into troll country.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' }
    ],
    enemies: [
      { kind: 'wolf', pos: [5, 5] },
      { kind: 'wolf', pos: [9, 7] },
      { kind: 'dire_wolf', pos: [12, 4] },
      { kind: 'orc', pos: [10, 6] }
    ],
    items: [
      { id: 'small_potion', pos: [4, 8] },
      { id: 'buckler', pos: [10, 8] },
      { id: 'mana_potion', pos: [6, 7] }
    ]
  },
  orc_den: {
    name: 'Orc Den',
    story: 'Dark cave ending in the chieftain fight.',
    layout: [
      '################',
      '#..............#',
      '#..##...##.....#',
      '#...........#..#',
      '#.####.........#',
      '#......##......#',
      '#.........##...#',
      '#..##..........#',
      '#......####....#',
      '#..............#',
      '#.<.....##.....#',
      '################'
    ],
    npcs: [],
    exits: [
      { pos: [2, 10], targetMap: 'meadow', targetPos: [10, 2], message: 'You backtrack into the meadow air.' }
    ],
    enemies: [
      { kind: 'orc', pos: [7, 3] },
      { kind: 'orc', pos: [11, 6] },
      { kind: 'orc_chieftain', pos: [12, 8] }
    ],
    items: [
      { id: 'small_potion', pos: [5, 8] }
    ]
  },
  troll_hollow: {
    name: 'Troll Hollow',
    story: 'A rocky sinkhole where trolls hoard stolen iron.',
    layout: [
      '################',
      '#,,,,....,,,,,,#',
      '#,~~~....~~~...#',
      '#,~~..##..~~...#',
      '#,..,....,.....#',
      '#...,...,,..##.#',
      '#...,,..,,.....#',
      '#..##....##....#',
      '#......,.......#',
      '#......,....>..#',
      '#.<....,,,,....#',
      '################'
    ],
    npcs: [],
    exits: [
      { pos: [2, 10], targetMap: 'meadow', targetPos: [12, 8], message: 'You slip back out to the meadow road.' }
    ],
    enemies: [
      { kind: 'troll', pos: [6, 4] },
      { kind: 'troll', pos: [10, 6] },
      { kind: 'troll_champion', pos: [11, 9] }
    ],
    items: [
      { id: 'small_potion', pos: [4, 7] },
      { id: 'mana_potion', pos: [8, 8] }
    ]
  },
  sunken_crypt: {
    name: 'Sunken Crypt',
    story: 'Flooded tomb passages haunted by old bones.',
    layout: [
      '################',
      '#..~~~~....,...#',
      '#..~~~.....,...#',
      '#....##..##....#',
      '#..............#',
      '#..,,......,,..#',
      '#..,,..##..,,..#',
      '#..............#',
      '#....##.....,..#',
      '#.........>....#',
      '#.<....,,......#',
      '################'
    ],
    npcs: [],
    exits: [
      { pos: [2, 10], targetMap: 'meadow', targetPos: [3, 9], message: 'You climb from the crypt back to the meadow.' }
    ],
    enemies: [
      { kind: 'skeleton', pos: [6, 4] },
      { kind: 'skeleton', pos: [11, 5] },
      { kind: 'bone_guard', pos: [10, 9] }
    ],
    items: [
      { id: 'mana_potion', pos: [4, 8] }
    ]
  }
};

const TILE_ASSETS = {
  floor: 'assets/tiles/floor.svg',
  wall: 'assets/tiles/wall.svg',
  grass: 'assets/tiles/grass.svg',
  path: 'assets/tiles/path.svg',
  stairs: 'assets/tiles/stairs.svg',
  water: 'assets/tiles/water.svg',
  player: 'assets/actors/player.svg',
  npc: 'assets/actors/npc.svg',
  rat: 'assets/actors/rat.svg',
  bat: 'assets/actors/bat.svg',
  wolf: 'assets/actors/wolf.svg',
  orc: 'assets/actors/orc.svg',
  troll: 'assets/actors/troll.svg',
  skeleton: 'assets/actors/skeleton.svg',
  club: 'assets/items/club.svg',
  knife: 'assets/items/knife.svg',
  sword: 'assets/items/sword.svg',
  mace: 'assets/items/mace.svg',
  tattered_tunic: 'assets/items/tunic.svg',
  worn_boots: 'assets/items/boots.svg',
  leather_vest: 'assets/items/vest.svg',
  buckler: 'assets/items/shield.svg',
  chainmail: 'assets/items/chainmail.svg',
  small_potion: 'assets/items/potion.svg',
  mana_potion: 'assets/items/mana_potion.svg',
  stolen_banner: 'assets/items/banner.svg',
  amulet: 'assets/items/amulet.svg'
};

const MERCHANT_STOCK = [
  { id: 'buckler', type: 'armor', price: 18, seller: 'Trader Sela' },
  { id: 'knife', type: 'weapon', price: 12, seller: 'Trader Sela' },
  { id: 'small_potion', type: 'item', price: 8, seller: 'Trader Sela' },
  { id: 'mana_potion', type: 'item', price: 10, seller: 'Trader Sela' }
];

const DIRECTIONS = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0]
};

const refs = {};
let ctx;
let minimapCtx;
let deferredPrompt = null;
let images = {};
let state = null;
let touchStart = null;

async function boot() {
  collectRefs();
  bindEvents();
  ctx = refs.canvas.getContext('2d');
  minimapCtx = refs.minimapCanvas.getContext('2d');
  images = await loadImages();
  registerServiceWorker();
  startNewGame();
}

function collectRefs() {
  refs.canvas = document.getElementById('gameCanvas');
  refs.minimapCanvas = document.getElementById('minimapCanvas');
  refs.zoneName = document.getElementById('zoneName');
  refs.zoneStory = document.getElementById('zoneStory');
  refs.objectiveText = document.getElementById('objectiveText');
  refs.nearbyText = document.getElementById('nearbyText');
  refs.playerLevel = document.getElementById('playerLevel');
  refs.playerHp = document.getElementById('playerHp');
  refs.playerMana = document.getElementById('playerMana');
  refs.playerXp = document.getElementById('playerXp');
  refs.playerGold = document.getElementById('playerGold');
  refs.playerWeapon = document.getElementById('playerWeapon');
  refs.playerDefense = document.getElementById('playerDefense');
  refs.playerMagic = document.getElementById('playerMagic');
  refs.inventoryArmor = document.getElementById('inventoryArmor');
  refs.inventoryWeapons = document.getElementById('inventoryWeapons');
  refs.inventoryPotions = document.getElementById('inventoryPotions');
  refs.inventoryLoot = document.getElementById('inventoryLoot');
  refs.questList = document.getElementById('questList');
  refs.equipmentSlots = document.getElementById('equipmentSlots');
  refs.merchantStock = document.getElementById('merchantStock');
  refs.dialogSpeaker = document.getElementById('dialogSpeaker');
  refs.dialogText = document.getElementById('dialogText');
  refs.closeDialogueButton = document.getElementById('closeDialogueButton');
  refs.interactButton = document.getElementById('interactButton');
  refs.swapWeaponButton = document.getElementById('swapWeaponButton');
  refs.usePotionButton = document.getElementById('usePotionButton');
  refs.useManaPotionButton = document.getElementById('useManaPotionButton');
  refs.castHealButton = document.getElementById('castHealButton');
  refs.castBurstButton = document.getElementById('castBurstButton');
  refs.saveButton = document.getElementById('saveButton');
  refs.loadButton = document.getElementById('loadButton');
  refs.newRunButton = document.getElementById('newRunButton');
  refs.logOutput = document.getElementById('logOutput');
  refs.installButton = document.getElementById('installButton');
}

function bindEvents() {
  refs.interactButton.addEventListener('click', tryInteract);
  refs.swapWeaponButton.addEventListener('click', swapWeapon);
  refs.usePotionButton.addEventListener('click', usePotion);
  refs.useManaPotionButton.addEventListener('click', useManaPotion);
  refs.castHealButton.addEventListener('click', castMinorHeal);
  refs.castBurstButton.addEventListener('click', castArcaneBurst);
  refs.saveButton.addEventListener('click', saveGame);
  refs.loadButton.addEventListener('click', loadGame);
  refs.newRunButton.addEventListener('click', startNewGame);
  refs.closeDialogueButton.addEventListener('click', clearDialogue);
  document.querySelectorAll('[data-move]').forEach((button) => button.addEventListener('click', () => playerTurn(DIRECTIONS[button.dataset.move])));
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') playerTurn(DIRECTIONS.up);
    else if (key === 'arrowdown' || key === 's') playerTurn(DIRECTIONS.down);
    else if (key === 'arrowleft' || key === 'a') playerTurn(DIRECTIONS.left);
    else if (key === 'arrowright' || key === 'd') playerTurn(DIRECTIONS.right);
    else if (key === 'q') swapWeapon();
    else if (key === 'e') usePotion();
    else if (key === 'r') useManaPotion();
    else if (key === '1') castMinorHeal();
    else if (key === '2') castArcaneBurst();
    else if (key === 'f') tryInteract();
  });
  refs.canvas.addEventListener('touchstart', (event) => { touchStart = getTouchPoint(event); }, { passive: true });
  refs.canvas.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    handleSwipe(getTouchPoint(event.changedTouches[0]), touchStart);
    touchStart = null;
  }, { passive: true });
  refs.canvas.addEventListener('mousedown', (event) => { touchStart = { x: event.clientX, y: event.clientY }; });
  refs.canvas.addEventListener('mouseup', (event) => {
    if (!touchStart) return;
    handleSwipe({ x: event.clientX, y: event.clientY }, touchStart);
    touchStart = null;
  });
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    refs.installButton.classList.remove('hidden');
  });
  refs.installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    deferredPrompt = null;
    refs.installButton.classList.add('hidden');
  });
}

function getTouchPoint(source) {
  const touch = source.touches ? source.touches[0] : source;
  return { x: touch.clientX, y: touch.clientY };
}

function handleSwipe(end, start) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (Math.hypot(dx, dy) < 24) return;
  if (Math.abs(dx) > Math.abs(dy)) playerTurn(dx > 0 ? DIRECTIONS.right : DIRECTIONS.left);
  else playerTurn(dy > 0 ? DIRECTIONS.down : DIRECTIONS.up);
}

function startNewGame() {
  state = {
    currentMapId: 'town',
    player: {
      pos: [7, 8],
      hp: 28,
      maxHp: 28,
      mana: 10,
      maxMana: 10,
      level: 1,
      exp: 0,
      nextExp: 12,
      gold: 10,
      weapon: 'club',
      weapons: ['club'],
      armorOwned: ['tattered_tunic', 'worn_boots'],
      charmsOwned: [],
      equipment: { body: 'tattered_tunic', feet: 'worn_boots', offhand: null, charm: null },
      potions: 1,
      manaPotions: 0,
      spells: ['minor_heal'],
      inventory: { rat_tail: 0, bat_wing: 0, wolf_pelt: 0, dire_pelt: 0, orc_badge: 0, troll_tusk: 0, troll_iron: 0, bone_token: 0, crypt_relic: 0, stolen_banner: 0 }
    },
    quests: {
      cellar_sweep: { status: 'available', rat: 0, bat: 0 },
      wolf_hunt: { status: 'locked', wolf: 0, dire_wolf: 0 },
      orc_threat: { status: 'locked', chieftain_defeated: false, banner_collected: false },
      troll_hunt: { status: 'locked', troll: 0, troll_champion: 0 },
      crypt_ward: { status: 'locked', skeleton: 0, bone_guard: 0, relic_collected: false }
    },
    worldState: Object.fromEntries(Object.keys(MAP_DEFS).map((mapId) => [mapId, {
      enemies: MAP_DEFS[mapId].enemies.map((entry) => makeEnemy(entry.kind, entry.pos)),
      items: MAP_DEFS[mapId].items.map((item) => ({ ...item, pos: [...item.pos] }))
    }])),
    logLines: [],
    dialogue: { speaker: 'Guide', text: 'Talk to Elder Mara first. Ashenfall now supports weapons, magic, and deeper questing.' }
  };
  message('Ashenfall now has mana, spells, equipment slots, and a sunken crypt.');
  message('Clear the quests in order and watch for Acolyte Nera after the troll hunt.');
  refresh();
}

function makeEnemy(kind, pos) {
  const data = ENEMIES[kind];
  return { kind, name: data.name, pos: [...pos], hp: data.maxHp, maxHp: data.maxHp, attack: data.attack, icon: data.icon, exp: data.exp, gold: [...data.gold], drop: data.drop };
}

function currentMap() { return MAP_DEFS[state.currentMapId]; }
function currentEnemies() { return state.worldState[state.currentMapId].enemies; }
function currentItems() { return state.worldState[state.currentMapId].items; }

function playerTurn(direction) {
  clearDialogue();
  const target = [state.player.pos[0] + direction[0], state.player.pos[1] + direction[1]];
  if (!inBounds(target)) return;
  const npc = npcAt(target);
  if (npc) {
    interactWithNpc(npc);
    return;
  }
  const enemyIndex = enemyAt(target);
  if (enemyIndex !== -1) {
    attackEnemy(enemyIndex);
    endPlayerAction();
    return;
  }
  if (!isWalkable(target)) {
    message('That path is blocked.');
    refresh();
    return;
  }
  state.player.pos = target;
  collectGroundItem(target);
  checkExit(target);
  endPlayerAction();
}

function endPlayerAction() {
  enemyTurn();
  regenerateMana(1);
  refresh();
}

function attackEnemy(index) {
  const enemy = currentEnemies()[index];
  const weapon = WEAPONS[state.player.weapon];
  let damage = randInt(weapon.minDamage, weapon.maxDamage) + Math.max(0, Math.floor((state.player.level - 1) / 2));
  const crit = Math.random() < weapon.crit;
  if (crit) damage += 2;
  enemy.hp -= damage;
  message(`You hit ${enemy.name} with ${weapon.name} for ${damage} damage${crit ? ' (crit)' : ''}.`);
  if (enemy.hp <= 0) defeatEnemy(index, enemy);
}

function defeatEnemy(index, enemy) {
  const gold = randInt(enemy.gold[0], enemy.gold[1]);
  state.player.gold += gold;
  message(`${enemy.name} drops ${gold} gold.`);
  addInventoryItem(enemy.drop);
  gainExperience(enemy.exp);
  currentEnemies().splice(index, 1);
  recordEnemyDefeat(enemy.kind, enemy.pos);
}

function enemyTurn() {
  for (let i = 0; i < currentEnemies().length; i += 1) {
    const enemy = currentEnemies()[i];
    const distance = manhattan(enemy.pos, state.player.pos);
    if (distance === 1) {
      const damage = Math.max(1, enemy.attack - totalDefense());
      state.player.hp -= damage;
      message(`${enemy.name} hits you for ${damage} damage.`);
      if (state.player.hp <= 0) {
        handleDefeat();
        return;
      }
    } else if (distance <= 6) {
      const nextStep = bestStepToward(enemy.pos, state.player.pos, i);
      if (!samePos(nextStep, enemy.pos)) enemy.pos = nextStep;
    }
  }
}

function bestStepToward(start, goal, skipIndex) {
  const xStep = Math.sign(goal[0] - start[0]);
  const yStep = Math.sign(goal[1] - start[1]);
  const candidates = [];
  if (Math.abs(goal[0] - start[0]) >= Math.abs(goal[1] - start[1])) {
    if (xStep) candidates.push([start[0] + xStep, start[1]]);
    if (yStep) candidates.push([start[0], start[1] + yStep]);
  } else {
    if (yStep) candidates.push([start[0], start[1] + yStep]);
    if (xStep) candidates.push([start[0] + xStep, start[1]]);
  }
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => candidates.push([start[0] + dx, start[1] + dy]));
  return candidates.find((candidate) => !samePos(candidate, state.player.pos) && isWalkable(candidate) && !npcAt(candidate) && enemyAt(candidate, skipIndex) === -1) || start;
}

function handleDefeat() {
  const goldLoss = Math.min(state.player.gold, Math.max(5, Math.floor(state.player.gold / 4)));
  state.player.gold -= goldLoss;
  state.player.hp = state.player.maxHp;
  state.player.mana = state.player.maxMana;
  state.currentMapId = 'town';
  state.player.pos = [7, 8];
  say('Sister Hale', `You collapse, lose ${goldLoss} gold, and wake back in Ashenfall.`);
}

function collectGroundItem(pos) {
  for (let i = currentItems().length - 1; i >= 0; i -= 1) {
    if (!samePos(currentItems()[i].pos, pos)) continue;
    const [item] = currentItems().splice(i, 1);
    collectItemById(item.id);
  }
}

function collectItemById(itemId) {
  if (WEAPONS[itemId]) {
    if (!state.player.weapons.includes(itemId)) {
      state.player.weapons.push(itemId);
      message(`You claim ${WEAPONS[itemId].name}.`);
    }
    if (weaponScore(itemId) > weaponScore(state.player.weapon)) {
      state.player.weapon = itemId;
      message(`You equip ${WEAPONS[itemId].name}.`);
    }
    return;
  }
  if (ARMOR[itemId]) {
    if (!state.player.armorOwned.includes(itemId)) {
      state.player.armorOwned.push(itemId);
      message(`You claim ${ARMOR[itemId].name}.`);
    }
    equipArmor(itemId);
    return;
  }
  if (CHARMS[itemId]) {
    if (!state.player.charmsOwned.includes(itemId)) state.player.charmsOwned.push(itemId);
    state.player.equipment.charm = itemId;
    state.player.maxMana = 10 + charmManaBonus();
    state.player.mana = Math.min(state.player.maxMana, state.player.mana + 4);
    message(`You equip ${CHARMS[itemId].name}.`);
    return;
  }
  if (itemId === 'small_potion') {
    state.player.potions += 1;
    message('You stash a Small Potion.');
    return;
  }
  if (itemId === 'mana_potion') {
    state.player.manaPotions += 1;
    message('You stash a Mana Potion.');
    return;
  }
  addInventoryItem(itemId);
  if (itemId === 'stolen_banner') {
    state.quests.orc_threat.banner_collected = true;
    message('You recovered the Stolen Banner.');
    updateOrcQuestState();
  }
  if (itemId === 'crypt_relic') {
    state.quests.crypt_ward.relic_collected = true;
    message('You recovered the Crypt Relic.');
    updateCryptQuestState();
  }
}

function equipArmor(itemId) {
  const slot = ARMOR[itemId].slot;
  const equipped = state.player.equipment[slot];
  if (!equipped || ARMOR[itemId].defense >= ARMOR[equipped].defense) {
    state.player.equipment[slot] = itemId;
    message(`You equip ${ARMOR[itemId].name}.`);
  }
}

function addInventoryItem(itemId) {
  state.player.inventory[itemId] = (state.player.inventory[itemId] || 0) + 1;
  message(`Looted ${ITEMS[itemId].name}.`);
}

function recordEnemyDefeat(kind, pos) {
  if (state.quests.cellar_sweep.status === 'active') {
    if (kind === 'rat') state.quests.cellar_sweep.rat += 1;
    if (kind === 'bat') state.quests.cellar_sweep.bat += 1;
    if (state.quests.cellar_sweep.rat >= 3 && state.quests.cellar_sweep.bat >= 2) {
      state.quests.cellar_sweep.status = 'turnin';
      message('Cellar Sweep is complete. Return to Elder Mara.');
    }
  }
  if (state.quests.wolf_hunt.status === 'active') {
    if (kind === 'wolf') state.quests.wolf_hunt.wolf += 1;
    if (kind === 'dire_wolf') state.quests.wolf_hunt.dire_wolf += 1;
    if (state.quests.wolf_hunt.wolf >= 2 && state.quests.wolf_hunt.dire_wolf >= 1) {
      state.quests.wolf_hunt.status = 'turnin';
      message('Wolf Hunt is complete. Report back to Brann.');
    }
  }
  if (state.quests.orc_threat.status === 'active' && kind === 'orc_chieftain') {
    state.quests.orc_threat.chieftain_defeated = true;
    dropItem(pos, 'stolen_banner');
    message('The Orc Chieftain falls and drops the stolen banner.');
    updateOrcQuestState();
  }
  if (state.quests.troll_hunt.status === 'active') {
    if (kind === 'troll') state.quests.troll_hunt.troll += 1;
    if (kind === 'troll_champion') state.quests.troll_hunt.troll_champion += 1;
    if (state.quests.troll_hunt.troll >= 2 && state.quests.troll_hunt.troll_champion >= 1) {
      state.quests.troll_hunt.status = 'turnin';
      message('Troll Hollow is clear. Return to Forgehand Bram.');
    }
  }
  if (state.quests.crypt_ward.status === 'active') {
    if (kind === 'skeleton') state.quests.crypt_ward.skeleton += 1;
    if (kind === 'bone_guard') {
      state.quests.crypt_ward.bone_guard += 1;
      dropItem(pos, 'sun_amulet');
      message('The Bone Guard falls and reveals a Sun Amulet.');
    }
    updateCryptQuestState();
  }
}

function updateOrcQuestState() {
  if (state.quests.orc_threat.status !== 'active') return;
  if (state.quests.orc_threat.chieftain_defeated && state.quests.orc_threat.banner_collected) {
    state.quests.orc_threat.status = 'turnin';
    message('Return the banner to Captain Ivo.');
  }
}

function updateCryptQuestState() {
  if (state.quests.crypt_ward.status !== 'active') return;
  if (state.quests.crypt_ward.skeleton >= 2 && state.quests.crypt_ward.bone_guard >= 1 && state.quests.crypt_ward.relic_collected) {
    state.quests.crypt_ward.status = 'turnin';
    message('Sunken Crypt is cleansed. Return to Acolyte Nera.');
  }
}

function dropItem(pos, itemId) {
  currentItems().push({ id: itemId, pos: [...pos] });
}

function gainExperience(amount) {
  state.player.exp += amount;
  while (state.player.exp >= state.player.nextExp) {
    state.player.exp -= state.player.nextExp;
    state.player.level += 1;
    state.player.nextExp += 6;
    state.player.maxHp += 5;
    state.player.maxMana += 2;
    state.player.hp = state.player.maxHp;
    state.player.mana = state.player.maxMana;
    say('Guide', `Level up! You are now level ${state.player.level}.`);
  }
}

function regenerateMana(amount) {
  state.player.mana = Math.min(state.player.maxMana, state.player.mana + amount);
}

function swapWeapon() {
  clearDialogue();
  if (state.player.weapons.length <= 1) {
    message('You have no alternate weapon yet.');
    refresh();
    return;
  }
  const index = state.player.weapons.indexOf(state.player.weapon);
  state.player.weapon = state.player.weapons[(index + 1) % state.player.weapons.length];
  message(`Equipped ${WEAPONS[state.player.weapon].name}.`);
  refresh();
}

function usePotion() {
  clearDialogue();
  if (state.player.potions <= 0) {
    message('No potion available.');
    refresh();
    return;
  }
  if (state.player.hp >= state.player.maxHp) {
    message('You are already at full health.');
    refresh();
    return;
  }
  state.player.potions -= 1;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + ITEMS.small_potion.heal);
  message('You drink a Small Potion.');
  endPlayerAction();
}

function useManaPotion() {
  clearDialogue();
  if (state.player.manaPotions <= 0) {
    message('No mana potion available.');
    refresh();
    return;
  }
  if (state.player.mana >= state.player.maxMana) {
    message('Your mana is already full.');
    refresh();
    return;
  }
  state.player.manaPotions -= 1;
  state.player.mana = Math.min(state.player.maxMana, state.player.mana + ITEMS.mana_potion.mana);
  message('You drink a Mana Potion.');
  endPlayerAction();
}

function castMinorHeal() {
  clearDialogue();
  if (!state.player.spells.includes('minor_heal')) {
    message('You do not know that spell.');
    refresh();
    return;
  }
  if (state.player.mana < SPELLS.minor_heal.cost) {
    message('Not enough mana for Cast Heal.');
    refresh();
    return;
  }
  if (state.player.hp >= state.player.maxHp) {
    message('You are already at full health.');
    refresh();
    return;
  }
  state.player.mana -= SPELLS.minor_heal.cost;
  const heal = 8 + spellPowerBonus();
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
  say('Acolyte Nera', `Warm light seals your wounds for ${heal} health.`);
  endPlayerAction();
}

function castArcaneBurst() {
  clearDialogue();
  if (!state.player.spells.includes('arcane_burst')) {
    message('You have not learned Arcane Burst yet.');
    refresh();
    return;
  }
  if (state.player.mana < SPELLS.arcane_burst.cost) {
    message('Not enough mana for Arcane Burst.');
    refresh();
    return;
  }
  const targets = adjacentEnemyIndexes();
  if (targets.length === 0) {
    message('No adjacent enemies for Arcane Burst.');
    refresh();
    return;
  }
  state.player.mana -= SPELLS.arcane_burst.cost;
  const damage = 7 + spellPowerBonus();
  const sorted = [...targets].sort((a, b) => b - a);
  sorted.forEach((index) => {
    const enemy = currentEnemies()[index];
    if (!enemy) return;
    enemy.hp -= damage;
    message(`Arcane Burst hits ${enemy.name} for ${damage} damage.`);
    if (enemy.hp <= 0) defeatEnemy(index, enemy);
  });
  endPlayerAction();
}

function adjacentEnemyIndexes() {
  return Object.values(DIRECTIONS)
    .map(([dx, dy]) => enemyAt([state.player.pos[0] + dx, state.player.pos[1] + dy]))
    .filter((index, position, arr) => index !== -1 && arr.indexOf(index) === position);
}

function spellPowerBonus() {
  const charm = state.player.equipment.charm;
  return charm ? CHARMS[charm].spellPower : 0;
}

function charmManaBonus() {
  const charm = state.player.equipment.charm;
  return charm ? CHARMS[charm].manaBonus : 0;
}

function tryInteract() {
  const npc = adjacentNpc();
  if (!npc) {
    message('No one is close enough to talk to.');
    refresh();
    return;
  }
  interactWithNpc(npc);
}

function interactWithNpc(npc) {
  switch (npc.id) {
    case 'elder': interactElder(); break;
    case 'hunter': interactHunter(); break;
    case 'captain': interactCaptain(); break;
    case 'trader': interactTrader(); break;
    case 'healer': interactHealer(); break;
    case 'smith': interactSmith(); break;
    case 'acolyte': interactAcolyte(); break;
    default: break;
  }
  refresh();
}

function interactElder() {
  const quest = state.quests.cellar_sweep;
  if (quest.status === 'available') {
    quest.status = 'active';
    say('Elder Mara', 'Clear the cellar. Bring me proof the rats and bats are gone.');
  } else if (quest.status === 'active') {
    say('Elder Mara', 'The cellar still needs 3 rats and 2 bats cleared.');
  } else if (quest.status === 'turnin') {
    quest.status = 'done';
    state.quests.wolf_hunt.status = 'available';
    state.player.gold += 12;
    state.player.potions += 1;
    if (!state.player.spells.includes('minor_heal')) state.player.spells.push('minor_heal');
    say('Elder Mara', 'Good work. Take 12 gold and a potion, then speak to Nera and Brann.');
  } else {
    say('Elder Mara', 'Ashenfall is steadier now. Keep pushing outward.');
  }
}

function interactHunter() {
  const quest = state.quests.wolf_hunt;
  if (quest.status === 'locked') {
    say('Brann the Hunter', 'Help the elder first. The meadow can wait.');
  } else if (quest.status === 'available') {
    quest.status = 'active';
    say('Brann the Hunter', 'Thin the meadow pack. I need 2 wolves and the dire alpha gone.');
  } else if (quest.status === 'active') {
    say('Brann the Hunter', 'The road is still unsafe. Finish the pack.');
  } else if (quest.status === 'turnin') {
    quest.status = 'done';
    state.quests.orc_threat.status = 'available';
    state.player.gold += 20;
    state.player.potions += 1;
    collectItemById('leather_vest');
    say('Brann the Hunter', 'Take this leather vest, 20 gold, and a potion. Captain Ivo has a harder job next.');
  } else {
    say('Brann the Hunter', 'The cave beyond the meadow is where the raiders gather.');
  }
}

function interactCaptain() {
  const quest = state.quests.orc_threat;
  if (quest.status === 'locked') {
    say('Captain Ivo', 'Earn Brann\'s trust first.');
  } else if (quest.status === 'available') {
    quest.status = 'active';
    say('Captain Ivo', 'Enter the orc den, kill the chieftain, and recover our banner.');
  } else if (quest.status === 'active') {
    say('Captain Ivo', quest.chieftain_defeated ? 'Find the banner before you return.' : 'The chieftain still lives.');
  } else if (quest.status === 'turnin') {
    quest.status = 'done';
    state.quests.troll_hunt.status = 'available';
    state.player.gold += 40;
    if (!state.player.weapons.includes('iron_sword')) state.player.weapons.push('iron_sword');
    state.player.weapon = 'iron_sword';
    say('Captain Ivo', 'Ashenfall is safe for now. Take this Iron Sword and see Bram about the trolls.');
  } else {
    say('Captain Ivo', 'The trolls and old crypt are the last dangers near the road.');
  }
}

function interactTrader() {
  const nextStock = nextMerchantOffer();
  if (!nextStock) {
    if (state.player.gold >= 10) {
      state.player.gold -= 10;
      state.player.manaPotions += 1;
      say('Trader Sela', 'Mana Potion for 10 gold. Come again.');
    } else {
      say('Trader Sela', 'Best stock is sold out. I can still part with a mana potion for 10 gold.');
    }
    return;
  }
  if (state.player.gold < nextStock.price) {
    say('Trader Sela', `${merchantItemName(nextStock)} costs ${nextStock.price} gold.`);
    return;
  }
  state.player.gold -= nextStock.price;
  grantMerchantOffer(nextStock);
  say('Trader Sela', `${merchantItemName(nextStock)} is yours for ${nextStock.price} gold.`);
}

function interactHealer() {
  state.player.hp = state.player.maxHp;
  state.player.mana = state.player.maxMana;
  say('Sister Hale', 'You are mended in body and mind.');
}

function interactSmith() {
  const quest = state.quests.troll_hunt;
  if (quest.status === 'locked') {
    say('Forgehand Bram', 'Bring me proof the orcs are dealt with and I will speak of better iron.');
  } else if (quest.status === 'available') {
    quest.status = 'active';
    say('Forgehand Bram', 'Trolls stole my iron from the hollow. Kill 2 trolls and their champion, then return what they took.');
  } else if (quest.status === 'active') {
    say('Forgehand Bram', 'The hollow still stinks of troll blood and stolen iron. Finish it.');
  } else if (quest.status === 'turnin') {
    quest.status = 'done';
    state.quests.crypt_ward.status = 'available';
    state.player.gold += 60;
    if (!state.player.weapons.includes('spiked_mace')) state.player.weapons.push('spiked_mace');
    state.player.weapon = 'spiked_mace';
    collectItemById('chainmail');
    say('Forgehand Bram', 'Here. Spiked Mace, Chainmail Coat, and 60 gold. Nera wants a word about the crypt.');
  } else {
    say('Forgehand Bram', 'Best steel in town is already on your back.');
  }
}

function interactAcolyte() {
  const quest = state.quests.crypt_ward;
  if (state.quests.cellar_sweep.status === 'available') {
    say('Acolyte Nera', 'Elder Mara needs the cellar purged first.');
  } else if (state.quests.cellar_sweep.status !== 'done') {
    say('Acolyte Nera', 'When the cellar is safe, I will teach you how to mend yourself with mana.');
  } else if (quest.status === 'locked') {
    if (!state.player.spells.includes('minor_heal')) state.player.spells.push('minor_heal');
    say('Acolyte Nera', 'I have shown you Cast Heal. Return after Bram\'s troll trouble is settled for a deeper rite.');
  } else if (quest.status === 'available') {
    quest.status = 'active';
    say('Acolyte Nera', 'Descend into the Sunken Crypt. Break 2 skeletons, destroy the Bone Guard, and recover the relic below.');
  } else if (quest.status === 'active') {
    say('Acolyte Nera', quest.relic_collected ? 'The relic is in your pack. Finish cleansing the dead if any remain.' : 'The dead below still stir.');
  } else if (quest.status === 'turnin') {
    quest.status = 'done';
    if (!state.player.spells.includes('arcane_burst')) state.player.spells.push('arcane_burst');
    collectItemById('sun_amulet');
    state.player.gold += 70;
    say('Acolyte Nera', 'Take the Sun Amulet, 70 gold, and the rite of Arcane Burst.');
  } else {
    say('Acolyte Nera', 'You carry Ashenfall\'s blessing now.');
  }
}

function nextMerchantOffer() {
  return MERCHANT_STOCK.find((offer) => {
    if (offer.type === 'weapon') return !state.player.weapons.includes(offer.id);
    if (offer.type === 'armor') return !state.player.armorOwned.includes(offer.id);
    if (offer.id === 'small_potion') return state.player.potions < 3;
    if (offer.id === 'mana_potion') return state.player.manaPotions < 3;
    return true;
  }) || null;
}

function grantMerchantOffer(offer) {
  if (offer.type === 'weapon' || offer.type === 'armor' || CHARMS[offer.id]) {
    collectItemById(offer.id);
  } else if (offer.id === 'small_potion') {
    state.player.potions += 1;
  } else if (offer.id === 'mana_potion') {
    state.player.manaPotions += 1;
  }
}

function merchantItemName(offer) {
  if (offer.type === 'weapon') return WEAPONS[offer.id].name;
  if (offer.type === 'armor') return ARMOR[offer.id].name;
  return ITEMS[offer.id].name;
}

function checkExit(pos) {
  const exit = currentMap().exits.find((entry) => samePos(entry.pos, pos));
  if (!exit) return;
  state.currentMapId = exit.targetMap;
  state.player.pos = [...exit.targetPos];
  message(exit.message);
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  say('Guide', 'Game saved on this device.');
  refresh();
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    say('Guide', 'No save file found on this device.');
    refresh();
    return;
  }
  try {
    state = JSON.parse(raw);
    ensureSaveShape();
    say('Guide', 'Save loaded.');
  } catch {
    say('Guide', 'Save file is invalid.');
  }
  refresh();
}

function ensureSaveShape() {
  state.player.mana ??= 10;
  state.player.maxMana ??= 10;
  state.player.armorOwned ??= state.player.armor ?? ['tattered_tunic', 'worn_boots'];
  state.player.charmsOwned ??= [];
  state.player.equipment ??= { body: 'tattered_tunic', feet: 'worn_boots', offhand: state.player.armorOwned.includes('buckler') ? 'buckler' : null, charm: null };
  state.player.manaPotions ??= 0;
  state.player.spells ??= ['minor_heal'];
  state.player.inventory.bone_token ??= 0;
  state.player.inventory.crypt_relic ??= 0;
  state.quests.troll_hunt ??= { status: 'locked', troll: 0, troll_champion: 0 };
  state.quests.crypt_ward ??= { status: 'locked', skeleton: 0, bone_guard: 0, relic_collected: false };
  state.dialogue ??= { speaker: 'Guide', text: 'Save loaded.' };
  if (!state.worldState.sunken_crypt) {
    state.worldState.sunken_crypt = {
      enemies: MAP_DEFS.sunken_crypt.enemies.map((entry) => makeEnemy(entry.kind, entry.pos)),
      items: MAP_DEFS.sunken_crypt.items.map((item) => ({ ...item, pos: [...item.pos] }))
    };
  }
}

function render() {
  const layout = currentMap().layout;
  ctx.clearRect(0, 0, refs.canvas.width, refs.canvas.height);
  layout.forEach((row, y) => {
    [...row].forEach((tile, x) => {
      drawImage(tileTextureKey(tile), x, y);
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });
  });
  currentItems().forEach((item) => drawImage(iconKeyForItem(item.id), item.pos[0], item.pos[1], 8, 8, 16, 16));
  currentMap().npcs.forEach((npc) => drawImage('npc', npc.pos[0], npc.pos[1]));
  currentEnemies().forEach((enemy) => {
    drawImage(enemy.icon, enemy.pos[0], enemy.pos[1]);
    drawHpBar(enemy.pos, enemy.hp, enemy.maxHp);
  });
  drawImage('player', state.player.pos[0], state.player.pos[1]);
  drawHpBar(state.player.pos, state.player.hp, state.player.maxHp, state.player.mana, state.player.maxMana);
  renderMinimap();
}

function renderMinimap() {
  const layout = currentMap().layout;
  minimapCtx.clearRect(0, 0, refs.minimapCanvas.width, refs.minimapCanvas.height);
  const scale = 8;
  layout.forEach((row, y) => {
    [...row].forEach((tile, x) => {
      minimapCtx.fillStyle = minimapTileColor(tile);
      minimapCtx.fillRect(x * scale, y * scale, scale, scale);
    });
  });
  currentMap().npcs.forEach((npc) => { minimapCtx.fillStyle = '#e0ba79'; minimapCtx.fillRect(npc.pos[0] * scale + 2, npc.pos[1] * scale + 2, 4, 4); });
  currentEnemies().forEach((enemy) => { minimapCtx.fillStyle = '#b34343'; minimapCtx.fillRect(enemy.pos[0] * scale + 1, enemy.pos[1] * scale + 1, 6, 6); });
  minimapCtx.fillStyle = '#5be087';
  minimapCtx.fillRect(state.player.pos[0] * scale + 1, state.player.pos[1] * scale + 1, 6, 6);
}

function drawImage(key, tileX, tileY, offsetX = 0, offsetY = 0, width = TILE_SIZE, height = TILE_SIZE) {
  const image = images[key];
  if (!image) return;
  ctx.drawImage(image, tileX * TILE_SIZE + offsetX, tileY * TILE_SIZE + offsetY, width, height);
}

function drawHpBar(pos, hp, maxHp, mana = null, maxMana = null) {
  const ratio = Math.max(0, hp / maxHp);
  ctx.fillStyle = '#331212';
  ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 2, 24, 4);
  ctx.fillStyle = '#4ed97d';
  ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 2, 24 * ratio, 4);
  if (mana !== null && maxMana !== null) {
    ctx.fillStyle = '#14233e';
    ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 7, 24, 3);
    ctx.fillStyle = '#63a5ff';
    ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 7, 24 * Math.max(0, mana / maxMana), 3);
  }
}

function refresh() {
  render();
  refs.zoneName.textContent = currentMap().name;
  refs.zoneStory.textContent = currentMap().story;
  refs.objectiveText.textContent = objectiveText();
  refs.nearbyText.textContent = nearbyText();
  refs.playerLevel.textContent = String(state.player.level);
  refs.playerHp.textContent = `${state.player.hp}/${state.player.maxHp}`;
  refs.playerMana.textContent = `${state.player.mana}/${state.player.maxMana}`;
  refs.playerXp.textContent = `${state.player.exp}/${state.player.nextExp}`;
  refs.playerGold.textContent = String(state.player.gold);
  refs.playerWeapon.textContent = WEAPONS[state.player.weapon].name;
  refs.playerDefense.textContent = String(totalDefense());
  refs.playerMagic.textContent = state.player.spells.map((spellId) => SPELLS[spellId].name).join(', ');
  refs.inventoryArmor.textContent = `Armor: ${state.player.armorOwned.map((id) => ARMOR[id].name).join(', ')}`;
  refs.inventoryWeapons.textContent = `Weapons: ${state.player.weapons.map((id) => WEAPONS[id].name).join(', ')}`;
  refs.inventoryPotions.textContent = `Potions: ${state.player.potions} | Mana Potions: ${state.player.manaPotions}`;
  refs.inventoryLoot.textContent = `Loot: Rat tails ${countItem('rat_tail')}, Bat wings ${countItem('bat_wing')}, Wolf pelts ${countItem('wolf_pelt')}, Dire pelts ${countItem('dire_pelt')}, Orc badges ${countItem('orc_badge')}, Troll tusks ${countItem('troll_tusk')}, Troll iron ${countItem('troll_iron')}, Bone tokens ${countItem('bone_token')}`;
  refs.equipmentSlots.textContent = `Weapon: ${WEAPONS[state.player.weapon].name}\nBody: ${slotName('body')}\nFeet: ${slotName('feet')}\nOffhand: ${slotName('offhand')}\nCharm: ${slotName('charm')}`;
  refs.merchantStock.textContent = merchantStockText();
  renderQuestList();
  refs.dialogSpeaker.textContent = state.dialogue?.speaker || 'Guide';
  refs.dialogText.textContent = state.dialogue?.text || 'Explore Ashenfall.';
  const npc = adjacentNpc();
  refs.interactButton.disabled = !npc;
  refs.interactButton.textContent = npc ? `Talk: ${npc.name}` : 'Interact';
  refs.swapWeaponButton.disabled = state.player.weapons.length <= 1;
  refs.usePotionButton.disabled = state.player.potions <= 0 || state.player.hp >= state.player.maxHp;
  refs.useManaPotionButton.disabled = state.player.manaPotions <= 0 || state.player.mana >= state.player.maxMana;
  refs.castHealButton.disabled = !state.player.spells.includes('minor_heal') || state.player.mana < SPELLS.minor_heal.cost || state.player.hp >= state.player.maxHp;
  refs.castBurstButton.disabled = !state.player.spells.includes('arcane_burst') || state.player.mana < SPELLS.arcane_burst.cost;
  refs.logOutput.innerHTML = state.logLines.map((line) => `<div class="log-entry">${escapeHtml(line)}</div>`).join('');
}

function renderQuestList() {
  refs.questList.innerHTML = QUEST_ORDER.map((questId) => `<div class="quest-row"><strong>${QUEST_LABELS[questId]}</strong><span>${escapeHtml(questStatusText(questId))}</span></div>`).join('');
}

function objectiveText() {
  const quests = state.quests;
  if (quests.cellar_sweep.status === 'available') return 'Objective: Talk to Elder Mara to start the cellar sweep.';
  if (quests.cellar_sweep.status === 'active') return `Objective: Cellar Sweep — Rats ${quests.cellar_sweep.rat}/3, Bats ${quests.cellar_sweep.bat}/2.`;
  if (quests.cellar_sweep.status === 'turnin') return 'Objective: Return to Elder Mara for your cellar reward.';
  if (quests.wolf_hunt.status === 'available') return 'Objective: Talk to Brann for the meadow contract.';
  if (quests.wolf_hunt.status === 'active') return `Objective: Wolf Hunt — Wolves ${quests.wolf_hunt.wolf}/2, Dire Wolves ${quests.wolf_hunt.dire_wolf}/1.`;
  if (quests.wolf_hunt.status === 'turnin') return 'Objective: Report back to Brann for the wolf reward.';
  if (quests.orc_threat.status === 'available') return 'Objective: Talk to Captain Ivo to begin the orc strike.';
  if (quests.orc_threat.status === 'active') return `Objective: Orc Threat — ${quests.orc_threat.chieftain_defeated ? 'chieftain down' : 'chieftain alive'}, ${quests.orc_threat.banner_collected ? 'banner recovered' : 'banner missing'}.`;
  if (quests.orc_threat.status === 'turnin') return 'Objective: Return the banner to Captain Ivo.';
  if (quests.troll_hunt.status === 'available') return 'Objective: Talk to Bram for the troll hollow contract.';
  if (quests.troll_hunt.status === 'active') return `Objective: Troll Hollow — Trolls ${quests.troll_hunt.troll}/2, Champion ${quests.troll_hunt.troll_champion}/1.`;
  if (quests.troll_hunt.status === 'turnin') return 'Objective: Return to Bram for your forged reward.';
  if (quests.crypt_ward.status === 'available') return 'Objective: Talk to Acolyte Nera for the Sunken Crypt rite.';
  if (quests.crypt_ward.status === 'active') return `Objective: Sunken Crypt — Skeletons ${quests.crypt_ward.skeleton}/2, Bone Guard ${quests.crypt_ward.bone_guard}/1, Relic ${quests.crypt_ward.relic_collected ? 'found' : 'missing'}.`;
  if (quests.crypt_ward.status === 'turnin') return 'Objective: Return the relic to Acolyte Nera.';
  return 'Objective complete: you finished the current expanded vertical slice.';
}

function questStatusText(questId) {
  const quest = state.quests[questId];
  switch (questId) {
    case 'cellar_sweep': if (quest.status === 'active') return `Active — Rats ${quest.rat}/3, Bats ${quest.bat}/2`; break;
    case 'wolf_hunt': if (quest.status === 'active') return `Active — Wolves ${quest.wolf}/2, Dire Wolves ${quest.dire_wolf}/1`; break;
    case 'orc_threat': if (quest.status === 'active') return `Active — ${quest.chieftain_defeated ? 'chieftain down' : 'chieftain alive'}, ${quest.banner_collected ? 'banner recovered' : 'banner missing'}`; break;
    case 'troll_hunt': if (quest.status === 'active') return `Active — Trolls ${quest.troll}/2, Champion ${quest.troll_champion}/1`; break;
    case 'crypt_ward': if (quest.status === 'active') return `Active — Skeletons ${quest.skeleton}/2, Bone Guard ${quest.bone_guard}/1, Relic ${quest.relic_collected ? 'found' : 'missing'}`; break;
    default: break;
  }
  return statusLabel(quest.status);
}

function statusLabel(status) {
  return { locked: 'Locked', available: 'Available', active: 'Active', turnin: 'Ready to turn in', done: 'Complete' }[status] || 'Unknown';
}

function nearbyText() {
  const npc = adjacentNpc();
  if (npc) return `Nearby: ${npc.name} is ready to talk.`;
  const exit = currentMap().exits.find((entry) => samePos(entry.pos, state.player.pos));
  if (exit) return `Traveling to ${MAP_DEFS[exit.targetMap].name}.`;
  return 'Nearby: explore, gather upgrades, cast wisely, and clear the next quest objective.';
}

function totalDefense() {
  return ['body', 'feet', 'offhand'].reduce((sum, slot) => {
    const itemId = state.player.equipment[slot];
    return itemId ? sum + ARMOR[itemId].defense : sum;
  }, 0);
}

function merchantStockText() {
  const lines = MERCHANT_STOCK.map((offer) => {
    const owned = offer.type === 'weapon' ? state.player.weapons.includes(offer.id)
      : offer.type === 'armor' ? state.player.armorOwned.includes(offer.id)
      : false;
    return `${merchantItemName(offer)} — ${offer.price}g${owned ? ' (owned)' : ''}`;
  });
  return lines.join('\n');
}

function slotName(slot) {
  if (slot === 'charm') {
    const charm = state.player.equipment.charm;
    return charm ? CHARMS[charm].name : 'None';
  }
  const itemId = state.player.equipment[slot];
  return itemId ? ARMOR[itemId].name : 'None';
}

function countItem(itemId) {
  return state.player.inventory[itemId] || 0;
}

function message(text) {
  state.logLines.push(text);
  if (state.logLines.length > LOG_LIMIT) state.logLines.shift();
}

function say(speaker, text) {
  state.dialogue = { speaker, text };
  message(`${speaker}: ${text}`);
}

function clearDialogue() {
  if (!state) return;
  state.dialogue = { speaker: 'Guide', text: 'Explore Ashenfall.' };
}

function enemyAt(pos, skipIndex = -1) {
  return currentEnemies().findIndex((enemy, index) => index !== skipIndex && samePos(enemy.pos, pos));
}

function npcAt(pos) {
  return currentMap().npcs.find((npc) => samePos(npc.pos, pos));
}

function adjacentNpc() {
  return Object.values(DIRECTIONS).map(([dx, dy]) => npcAt([state.player.pos[0] + dx, state.player.pos[1] + dy])).find(Boolean) || null;
}

function inBounds(pos) {
  const layout = currentMap().layout;
  return pos[0] >= 0 && pos[1] >= 0 && pos[1] < layout.length && pos[0] < layout[0].length;
}

function tileAt(pos) {
  if (!inBounds(pos)) return '#';
  return currentMap().layout[pos[1]][pos[0]];
}

function tileTextureKey(tile) {
  if (tile === '#') return 'wall';
  if (tile === ',') return 'grass';
  if (tile === ':') return 'path';
  if (tile === '<' || tile === '>') return 'stairs';
  if (tile === '~') return 'water';
  return 'floor';
}

function minimapTileColor(tile) {
  if (tile === '#') return '#4f3b2a';
  if (tile === ',') return '#4b6e37';
  if (tile === ':') return '#8a704c';
  if (tile === '<' || tile === '>') return '#b0aba0';
  if (tile === '~') return '#315b7f';
  return '#695a47';
}

function isWalkable(pos) {
  const tile = tileAt(pos);
  return tile !== '#' && tile !== '~';
}

function iconKeyForItem(itemId) {
  if (WEAPONS[itemId]) return WEAPONS[itemId].icon;
  if (ARMOR[itemId]) return ARMOR[itemId].icon;
  if (CHARMS[itemId]) return CHARMS[itemId].icon;
  return ITEMS[itemId].icon;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function manhattan(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function samePos(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function weaponScore(id) {
  return WEAPONS[id].minDamage + WEAPONS[id].maxDamage;
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

async function loadImages() {
  const entries = await Promise.all(Object.entries(TILE_ASSETS).map(([key, src]) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve([key, image]);
    image.onerror = () => resolve([key, null]);
    image.src = src;
  })));
  return Object.fromEntries(entries);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}

boot();
