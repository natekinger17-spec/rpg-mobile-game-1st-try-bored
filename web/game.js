const TILE_SIZE = 32;
const SAVE_KEY = 'ashenfall-rpg-save-v2';
const LOG_LIMIT = 10;

const QUEST_ORDER = ['cellar_sweep', 'wolf_hunt', 'orc_threat', 'troll_hunt'];
const QUEST_LABELS = {
  cellar_sweep: 'Cellar Sweep',
  wolf_hunt: 'Wolf Hunt',
  orc_threat: 'Orc Threat',
  troll_hunt: 'Troll Hollow'
};

const MAP_DEFS = {
  town: {
    name: 'Ashenfall',
    story: 'Town hub with healing, trading, and contracts.',
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
      { pos: [12, 8], targetMap: 'troll_hollow', targetPos: [2, 10], message: 'You push through the briars into troll country.' }
    ],
    enemies: [
      { kind: 'wolf', pos: [5, 5] },
      { kind: 'wolf', pos: [9, 7] },
      { kind: 'dire_wolf', pos: [12, 4] },
      { kind: 'orc', pos: [10, 6] }
    ],
    items: [
      { id: 'small_potion', pos: [4, 8] },
      { id: 'buckler', pos: [10, 8] }
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
      { id: 'small_potion', pos: [4, 7] }
    ]
  }
};

const WEAPONS = {
  club: { name: 'Rough Club', minDamage: 3, maxDamage: 5, crit: 0.05, icon: 'club' },
  knife: { name: 'Rusty Knife', minDamage: 4, maxDamage: 6, crit: 0.15, icon: 'knife' },
  iron_sword: { name: 'Iron Sword', minDamage: 6, maxDamage: 9, crit: 0.12, icon: 'sword' },
  spiked_mace: { name: 'Spiked Mace', minDamage: 8, maxDamage: 12, crit: 0.1, icon: 'mace' }
};

const ARMOR = {
  tattered_tunic: { name: 'Tattered Tunic', defense: 1, icon: 'tattered_tunic' },
  worn_boots: { name: 'Worn Boots', defense: 1, icon: 'worn_boots' },
  buckler: { name: 'Buckler', defense: 2, icon: 'buckler' },
  leather_vest: { name: 'Leather Vest', defense: 3, icon: 'leather_vest' },
  chainmail: { name: 'Chainmail Coat', defense: 4, icon: 'chainmail' }
};

const ITEMS = {
  small_potion: { name: 'Small Potion', heal: 10, icon: 'small_potion' },
  rat_tail: { name: 'Rat Tail Trophy' },
  bat_wing: { name: 'Bat Wing Trophy' },
  wolf_pelt: { name: 'Wolf Pelt' },
  dire_pelt: { name: 'Dire Wolf Pelt' },
  orc_badge: { name: 'Orc Badge' },
  troll_tusk: { name: 'Troll Tusk' },
  troll_iron: { name: 'Troll Iron Cache' },
  stolen_banner: { name: 'Stolen Banner', icon: 'stolen_banner' }
};

const ENEMIES = {
  rat: { name: 'Cave Rat', maxHp: 8, attack: 2, icon: 'rat', exp: 3, gold: [2, 4], drop: 'rat_tail' },
  bat: { name: 'Cave Bat', maxHp: 6, attack: 3, icon: 'bat', exp: 4, gold: [2, 4], drop: 'bat_wing' },
  wolf: { name: 'Wolf', maxHp: 12, attack: 4, icon: 'wolf', exp: 7, gold: [5, 8], drop: 'wolf_pelt' },
  dire_wolf: { name: 'Dire Wolf', maxHp: 18, attack: 6, icon: 'wolf', exp: 11, gold: [8, 12], drop: 'dire_pelt' },
  orc: { name: 'Orc Raider', maxHp: 16, attack: 5, icon: 'orc', exp: 10, gold: [7, 12], drop: 'orc_badge' },
  orc_chieftain: { name: 'Orc Chieftain', maxHp: 28, attack: 8, icon: 'orc', exp: 20, gold: [18, 26], drop: 'orc_badge' },
  troll: { name: 'Troll', maxHp: 24, attack: 7, icon: 'troll', exp: 16, gold: [12, 18], drop: 'troll_tusk' },
  troll_champion: { name: 'Troll Champion', maxHp: 34, attack: 10, icon: 'troll', exp: 28, gold: [24, 34], drop: 'troll_iron' }
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
  stolen_banner: 'assets/items/banner.svg'
};

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
  refs.playerXp = document.getElementById('playerXp');
  refs.playerGold = document.getElementById('playerGold');
  refs.playerWeapon = document.getElementById('playerWeapon');
  refs.playerDefense = document.getElementById('playerDefense');
  refs.inventoryArmor = document.getElementById('inventoryArmor');
  refs.inventoryWeapons = document.getElementById('inventoryWeapons');
  refs.inventoryPotions = document.getElementById('inventoryPotions');
  refs.inventoryLoot = document.getElementById('inventoryLoot');
  refs.questList = document.getElementById('questList');
  refs.dialogSpeaker = document.getElementById('dialogSpeaker');
  refs.dialogText = document.getElementById('dialogText');
  refs.closeDialogueButton = document.getElementById('closeDialogueButton');
  refs.interactButton = document.getElementById('interactButton');
  refs.swapWeaponButton = document.getElementById('swapWeaponButton');
  refs.usePotionButton = document.getElementById('usePotionButton');
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
      pos: [7, 8], hp: 28, maxHp: 28, level: 1, exp: 0, nextExp: 12, gold: 10,
      weapon: 'club', weapons: ['club'], armor: ['tattered_tunic', 'worn_boots'], potions: 1,
      inventory: { rat_tail: 0, bat_wing: 0, wolf_pelt: 0, dire_pelt: 0, orc_badge: 0, troll_tusk: 0, troll_iron: 0, stolen_banner: 0 }
    },
    quests: {
      cellar_sweep: { status: 'available', rat: 0, bat: 0 },
      wolf_hunt: { status: 'locked', wolf: 0, dire_wolf: 0 },
      orc_threat: { status: 'locked', chieftain_defeated: false, banner_collected: false },
      troll_hunt: { status: 'locked', troll: 0, troll_champion: 0 }
    },
    worldState: Object.fromEntries(Object.keys(MAP_DEFS).map((mapId) => [mapId, {
      enemies: MAP_DEFS[mapId].enemies.map((entry) => makeEnemy(entry.kind, entry.pos)),
      items: MAP_DEFS[mapId].items.map((item) => ({ ...item, pos: [...item.pos] }))
    }])),
    logLines: [],
    dialogue: { speaker: 'Guide', text: 'Talk to Elder Mara first. Ashenfall keeps growing from there.' }
  };
  message('Ashenfall now has a retro HUD, minimap, and expanded quest line.');
  message('Start with Elder Mara, then move through wolves, orcs, and trolls.');
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
    enemyTurn();
    refresh();
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
  enemyTurn();
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
  if (enemy.hp <= 0) {
    const gold = randInt(enemy.gold[0], enemy.gold[1]);
    state.player.gold += gold;
    message(`${enemy.name} drops ${gold} gold.`);
    addInventoryItem(enemy.drop);
    gainExperience(enemy.exp);
    currentEnemies().splice(index, 1);
    recordEnemyDefeat(enemy.kind, enemy.pos);
  }
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
    if (!state.player.armor.includes(itemId)) {
      state.player.armor.push(itemId);
      message(`You equip ${ARMOR[itemId].name}.`);
    }
    return;
  }
  if (itemId === 'small_potion') {
    state.player.potions += 1;
    message('You stash a Small Potion.');
    return;
  }
  addInventoryItem(itemId);
  if (itemId === 'stolen_banner') {
    state.quests.orc_threat.banner_collected = true;
    message('You recovered the Stolen Banner.');
    updateOrcQuestState();
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
}

function updateOrcQuestState() {
  if (state.quests.orc_threat.status !== 'active') return;
  if (state.quests.orc_threat.chieftain_defeated && state.quests.orc_threat.banner_collected) {
    state.quests.orc_threat.status = 'turnin';
    message('Return the banner to Captain Ivo.');
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
    state.player.hp = state.player.maxHp;
    say('Guide', `Level up! You are now level ${state.player.level}.`);
  }
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
  enemyTurn();
  refresh();
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
    say('Elder Mara', 'Good work. Take 12 gold and a potion, then see Brann for the meadow road.');
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
    if (!state.player.armor.includes('leather_vest')) state.player.armor.push('leather_vest');
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
    say('Captain Ivo', 'Ashenfall is safe for now. Take this Iron Sword and see Bram about the troll hollow.');
  } else {
    say('Captain Ivo', 'The road is yours, but the trolls still hoard iron to the east.');
  }
}

function interactTrader() {
  if (!state.player.armor.includes('buckler')) {
    if (state.player.gold >= 18) {
      state.player.gold -= 18;
      state.player.armor.push('buckler');
      say('Trader Sela', 'A buckler for 18 gold. Keep your shield high.');
    } else {
      say('Trader Sela', 'Buckler costs 18 gold.');
    }
    return;
  }
  if (!state.player.weapons.includes('knife')) {
    if (state.player.gold >= 12) {
      state.player.gold -= 12;
      state.player.weapons.push('knife');
      say('Trader Sela', 'Rusty Knife for 12 gold. Not pretty, but it bites.');
    } else {
      say('Trader Sela', 'Rusty Knife costs 12 gold.');
    }
    return;
  }
  if (state.player.gold >= 8) {
    state.player.gold -= 8;
    state.player.potions += 1;
    say('Trader Sela', 'Small Potion for 8 gold.');
  } else {
    say('Trader Sela', 'Come back with 8 gold for another potion.');
  }
}

function interactHealer() {
  state.player.hp = state.player.maxHp;
  say('Sister Hale', 'You are mended. Go carefully.');
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
    state.player.gold += 60;
    if (!state.player.weapons.includes('spiked_mace')) state.player.weapons.push('spiked_mace');
    if (!state.player.armor.includes('chainmail')) state.player.armor.push('chainmail');
    state.player.weapon = 'spiked_mace';
    say('Forgehand Bram', 'Here. Spiked Mace, Chainmail Coat, and 60 gold. You have a proper adventurer\'s kit now.');
  } else {
    say('Forgehand Bram', 'This is the strongest loop in the current build. Next comes a larger world.');
  }
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
    if (!state.dialogue) state.dialogue = { speaker: 'Guide', text: 'Save loaded.' };
    ensureSaveShape();
    say('Guide', 'Save loaded.');
  } catch {
    say('Guide', 'Save file is invalid.');
  }
  refresh();
}

function ensureSaveShape() {
  state.player.inventory.troll_tusk ??= 0;
  state.player.inventory.troll_iron ??= 0;
  state.quests.troll_hunt ??= { status: 'locked', troll: 0, troll_champion: 0 };
  if (!state.worldState.troll_hollow) {
    state.worldState.troll_hollow = {
      enemies: MAP_DEFS.troll_hollow.enemies.map((entry) => makeEnemy(entry.kind, entry.pos)),
      items: MAP_DEFS.troll_hollow.items.map((item) => ({ ...item, pos: [...item.pos] }))
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
  drawHpBar(state.player.pos, state.player.hp, state.player.maxHp);
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

function drawHpBar(pos, hp, maxHp) {
  const ratio = Math.max(0, hp / maxHp);
  ctx.fillStyle = '#331212';
  ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 2, 24, 4);
  ctx.fillStyle = '#4ed97d';
  ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 2, 24 * ratio, 4);
}

function refresh() {
  render();
  refs.zoneName.textContent = currentMap().name;
  refs.zoneStory.textContent = currentMap().story;
  refs.objectiveText.textContent = objectiveText();
  refs.nearbyText.textContent = nearbyText();
  refs.playerLevel.textContent = String(state.player.level);
  refs.playerHp.textContent = `${state.player.hp}/${state.player.maxHp}`;
  refs.playerXp.textContent = `${state.player.exp}/${state.player.nextExp}`;
  refs.playerGold.textContent = String(state.player.gold);
  refs.playerWeapon.textContent = WEAPONS[state.player.weapon].name;
  refs.playerDefense.textContent = String(totalDefense());
  refs.inventoryArmor.textContent = `Armor: ${state.player.armor.map((id) => ARMOR[id].name).join(', ')}`;
  refs.inventoryWeapons.textContent = `Weapons: ${state.player.weapons.map((id) => WEAPONS[id].name).join(', ')}`;
  refs.inventoryPotions.textContent = `Potions: ${state.player.potions}`;
  refs.inventoryLoot.textContent = `Loot: Rat tails ${countItem('rat_tail')}, Bat wings ${countItem('bat_wing')}, Wolf pelts ${countItem('wolf_pelt')}, Dire pelts ${countItem('dire_pelt')}, Orc badges ${countItem('orc_badge')}, Troll tusks ${countItem('troll_tusk')}, Troll iron ${countItem('troll_iron')}`;
  renderQuestList();
  refs.dialogSpeaker.textContent = state.dialogue?.speaker || 'Guide';
  refs.dialogText.textContent = state.dialogue?.text || 'Explore Ashenfall.';
  const npc = adjacentNpc();
  refs.interactButton.disabled = !npc;
  refs.interactButton.textContent = npc ? `Talk: ${npc.name}` : 'Interact';
  refs.swapWeaponButton.disabled = state.player.weapons.length <= 1;
  refs.usePotionButton.disabled = state.player.potions <= 0 || state.player.hp >= state.player.maxHp;
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
  if (quests.troll_hunt.status === 'available') return 'Objective: Talk to Forgehand Bram for the troll hollow contract.';
  if (quests.troll_hunt.status === 'active') return `Objective: Troll Hollow — Trolls ${quests.troll_hunt.troll}/2, Champion ${quests.troll_hunt.troll_champion}/1.`;
  if (quests.troll_hunt.status === 'turnin') return 'Objective: Return to Bram for your forged reward.';
  return 'Objective complete: you finished the current expanded vertical slice.';
}

function questStatusText(questId) {
  const quest = state.quests[questId];
  switch (questId) {
    case 'cellar_sweep':
      if (quest.status === 'active') return `Active — Rats ${quest.rat}/3, Bats ${quest.bat}/2`;
      break;
    case 'wolf_hunt':
      if (quest.status === 'active') return `Active — Wolves ${quest.wolf}/2, Dire Wolves ${quest.dire_wolf}/1`;
      break;
    case 'orc_threat':
      if (quest.status === 'active') return `Active — ${quest.chieftain_defeated ? 'chieftain down' : 'chieftain alive'}, ${quest.banner_collected ? 'banner recovered' : 'banner missing'}`;
      break;
    case 'troll_hunt':
      if (quest.status === 'active') return `Active — Trolls ${quest.troll}/2, Champion ${quest.troll_champion}/1`;
      break;
    default:
      break;
  }
  return statusLabel(quest.status);
}

function statusLabel(status) {
  return {
    locked: 'Locked',
    available: 'Available',
    active: 'Active',
    turnin: 'Ready to turn in',
    done: 'Complete'
  }[status] || 'Unknown';
}

function nearbyText() {
  const npc = adjacentNpc();
  if (npc) return `Nearby: ${npc.name} is ready to talk.`;
  const exit = currentMap().exits.find((entry) => samePos(entry.pos, state.player.pos));
  if (exit) return `Traveling to ${MAP_DEFS[exit.targetMap].name}.`;
  return 'Nearby: explore, gather upgrades, and clear the next quest objective.';
}

function totalDefense() {
  return state.player.armor.reduce((sum, id) => sum + ARMOR[id].defense, 0);
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
