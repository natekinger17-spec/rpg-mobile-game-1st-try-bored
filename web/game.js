const TILE_SIZE = 32;
const SAVE_KEY = 'ashenfall-rpg-save-v1';
const LOG_LIMIT = 9;

const MAP_DEFS = {
  town: {
    name: 'Ashenfall',
    story: 'Town hub with quests, healing, and trading.',
    layout: [
      '################',
      '#,,,,,::::,,,,,#',
      '#,,...:..:...,,#',
      '#,,..........,,#',
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
    story: 'Open field where wolves prowl the road.',
    layout: [
      '################',
      '#,,,,,,,,,,,,,,#',
      '#,,~~~,,...>.,,#',
      '#,,~~~~,......,#',
      '#,:::::,,..,,.,#',
      '#<:....,,,,...:#',
      '#,:....,,,,...:#',
      '#,:..,,....,..:#',
      '#,:..,,....,..:#',
      '#,:::::...,,..,#',
      '#,,,,,,,,,,,,,,#',
      '################'
    ],
    npcs: [],
    exits: [
      { pos: [1, 5], targetMap: 'town', targetPos: [11, 9], message: 'You head back through the town road.' },
      { pos: [11, 2], targetMap: 'orc_den', targetPos: [2, 10], message: 'You enter the cracked cave mouth.' }
    ],
    enemies: [
      { kind: 'wolf', pos: [5, 5] },
      { kind: 'wolf', pos: [9, 7] },
      { kind: 'dire_wolf', pos: [12, 4] }
    ],
    items: [
      { id: 'small_potion', pos: [4, 8] },
      { id: 'buckler', pos: [10, 8] }
    ]
  },
  orc_den: {
    name: 'Orc Den',
    story: 'Final cave push ending with an orc chieftain fight.',
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
  }
};

const WEAPONS = {
  club: { name: 'Rough Club', minDamage: 3, maxDamage: 5, crit: 0.05, icon: 'club' },
  knife: { name: 'Rusty Knife', minDamage: 4, maxDamage: 6, crit: 0.15, icon: 'knife' },
  iron_sword: { name: 'Iron Sword', minDamage: 6, maxDamage: 9, crit: 0.12, icon: 'sword' }
};

const ARMOR = {
  tattered_tunic: { name: 'Tattered Tunic', defense: 1, icon: 'tattered_tunic' },
  worn_boots: { name: 'Worn Boots', defense: 1, icon: 'worn_boots' },
  buckler: { name: 'Buckler', defense: 2, icon: 'buckler' },
  leather_vest: { name: 'Leather Vest', defense: 3, icon: 'leather_vest' }
};

const ITEMS = {
  small_potion: { name: 'Small Potion', heal: 10, icon: 'small_potion' },
  rat_tail: { name: 'Rat Tail Trophy' },
  bat_wing: { name: 'Bat Wing Trophy' },
  wolf_pelt: { name: 'Wolf Pelt' },
  dire_pelt: { name: 'Dire Wolf Pelt' },
  orc_badge: { name: 'Orc Badge' },
  stolen_banner: { name: 'Stolen Banner', icon: 'stolen_banner' }
};

const ENEMIES = {
  rat: { name: 'Cave Rat', maxHp: 8, attack: 2, icon: 'rat', exp: 3, gold: [2, 4], drop: 'rat_tail' },
  bat: { name: 'Cave Bat', maxHp: 6, attack: 3, icon: 'bat', exp: 4, gold: [2, 4], drop: 'bat_wing' },
  wolf: { name: 'Wolf', maxHp: 12, attack: 4, icon: 'wolf', exp: 7, gold: [5, 8], drop: 'wolf_pelt' },
  dire_wolf: { name: 'Dire Wolf', maxHp: 18, attack: 6, icon: 'wolf', exp: 11, gold: [8, 12], drop: 'dire_pelt' },
  orc: { name: 'Orc Raider', maxHp: 16, attack: 5, icon: 'orc', exp: 10, gold: [7, 12], drop: 'orc_badge' },
  orc_chieftain: { name: 'Orc Chieftain', maxHp: 28, attack: 8, icon: 'orc', exp: 20, gold: [18, 26], drop: 'orc_badge' }
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
  club: 'assets/items/club.svg',
  knife: 'assets/items/knife.svg',
  sword: 'assets/items/sword.svg',
  tattered_tunic: 'assets/items/tunic.svg',
  worn_boots: 'assets/items/boots.svg',
  leather_vest: 'assets/items/vest.svg',
  buckler: 'assets/items/shield.svg',
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
let deferredPrompt = null;
let images = {};
let state = null;
let touchStart = null;

async function boot() {
  collectRefs();
  bindEvents();
  ctx = refs.canvas.getContext('2d');
  images = await loadImages();
  registerServiceWorker();
  startNewGame();
}

function collectRefs() {
  refs.canvas = document.getElementById('gameCanvas');
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
  document.querySelectorAll('[data-move]').forEach((button) => {
    button.addEventListener('click', () => playerTurn(DIRECTIONS[button.dataset.move]));
  });
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
  refs.canvas.addEventListener('touchstart', (event) => {
    touchStart = getTouchPoint(event);
  }, { passive: true });
  refs.canvas.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    handleSwipe(getTouchPoint(event.changedTouches[0]), touchStart);
    touchStart = null;
  }, { passive: true });
  refs.canvas.addEventListener('mousedown', (event) => {
    touchStart = { x: event.clientX, y: event.clientY };
  });
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
      inventory: { rat_tail: 0, bat_wing: 0, wolf_pelt: 0, dire_pelt: 0, orc_badge: 0, stolen_banner: 0 }
    },
    quests: {
      cellar_sweep: { status: 'available', rat: 0, bat: 0 },
      wolf_hunt: { status: 'locked', wolf: 0, dire_wolf: 0 },
      orc_threat: { status: 'locked', chieftain_defeated: false, banner_collected: false }
    },
    worldState: Object.fromEntries(Object.keys(MAP_DEFS).map((mapId) => [mapId, {
      enemies: MAP_DEFS[mapId].enemies.map((entry) => makeEnemy(entry.kind, entry.pos)),
      items: MAP_DEFS[mapId].items.map((item) => ({ ...item, pos: [...item.pos] }))
    }])),
    logLines: []
  };
  message('Ashenfall now runs directly in Safari and can be saved on your iPhone.');
  message('Talk to Elder Mara first, then clear the cellar, meadow, and orc den.');
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
  return candidates.find((candidate) => (
    !samePos(candidate, state.player.pos) && isWalkable(candidate) && !npcAt(candidate) && enemyAt(candidate, skipIndex) === -1
  )) || start;
}

function handleDefeat() {
  const goldLoss = Math.min(state.player.gold, Math.max(5, Math.floor(state.player.gold / 4)));
  state.player.gold -= goldLoss;
  state.player.hp = state.player.maxHp;
  state.currentMapId = 'town';
  state.player.pos = [7, 8];
  message(`You collapse, lose ${goldLoss} gold, and wake back in Ashenfall.`);
  message('Sister Hale patches you up enough for another run.');
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
    message(`Level up! You are now level ${state.player.level}.`);
  }
}

function swapWeapon() {
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
  } else {
    interactWithNpc(npc);
  }
  refresh();
}

function interactWithNpc(npc) {
  switch (npc.id) {
    case 'elder': interactElder(); break;
    case 'hunter': interactHunter(); break;
    case 'captain': interactCaptain(); break;
    case 'trader': interactTrader(); break;
    case 'healer': interactHealer(); break;
    default: break;
  }
}

function interactElder() {
  const quest = state.quests.cellar_sweep;
  if (quest.status === 'available') {
    quest.status = 'active';
    message('Elder Mara: Clear the cellar. Bring me proof the rats and bats are gone.');
  } else if (quest.status === 'active') {
    message('Elder Mara: The cellar needs 3 rats and 2 bats cleared.');
  } else if (quest.status === 'turnin') {
    quest.status = 'done';
    state.quests.wolf_hunt.status = 'available';
    state.player.gold += 12;
    state.player.potions += 1;
    message('Elder Mara pays 12 gold and a potion for the cellar job.');
  } else {
    message('Elder Mara: Brann and the captain can use a capable blade.');
  }
}

function interactHunter() {
  const quest = state.quests.wolf_hunt;
  if (quest.status === 'locked') {
    message('Brann the Hunter: Help the elder first.');
  } else if (quest.status === 'available') {
    quest.status = 'active';
    message('Brann: Thin the meadow pack. I need 2 wolves and the dire alpha gone.');
  } else if (quest.status === 'active') {
    message('Brann: The meadow still has wolves on the road.');
  } else if (quest.status === 'turnin') {
    quest.status = 'done';
    state.quests.orc_threat.status = 'available';
    state.player.gold += 20;
    state.player.potions += 1;
    if (!state.player.armor.includes('leather_vest')) state.player.armor.push('leather_vest');
    message('Brann hands over a Leather Vest, 20 gold, and a potion.');
  } else {
    message('Brann: The cave beyond the meadow is where the real trouble starts.');
  }
}

function interactCaptain() {
  const quest = state.quests.orc_threat;
  if (quest.status === 'locked') {
    message('Captain Ivo: Earn Brann\'s trust first.');
  } else if (quest.status === 'available') {
    quest.status = 'active';
    message('Captain Ivo: Enter the orc den, kill the chieftain, and recover our banner.');
  } else if (quest.status === 'active') {
    message(quest.chieftain_defeated ? 'Captain Ivo: Find the banner before you return.' : 'Captain Ivo: The chieftain still lives.');
  } else if (quest.status === 'turnin') {
    quest.status = 'done';
    state.player.gold += 40;
    if (!state.player.weapons.includes('iron_sword')) state.player.weapons.push('iron_sword');
    state.player.weapon = 'iron_sword';
    message('Captain Ivo rewards you with an Iron Sword and 40 gold. Ashenfall is safe.');
  } else {
    message('Captain Ivo: This loop is complete. Next we scale content outward.');
  }
}

function interactTrader() {
  if (!state.player.armor.includes('buckler')) {
    if (state.player.gold >= 18) {
      state.player.gold -= 18;
      state.player.armor.push('buckler');
      message('Trader Sela sells you a Buckler for 18 gold.');
    } else {
      message('Trader Sela: Buckler is 18 gold.');
    }
    return;
  }
  if (!state.player.weapons.includes('knife')) {
    if (state.player.gold >= 12) {
      state.player.gold -= 12;
      state.player.weapons.push('knife');
      message('Trader Sela sells you a Rusty Knife for 12 gold.');
    } else {
      message('Trader Sela: Rusty Knife is 12 gold.');
    }
    return;
  }
  if (state.player.gold >= 8) {
    state.player.gold -= 8;
    state.player.potions += 1;
    message('Trader Sela sells you a Small Potion for 8 gold.');
  } else {
    message('Trader Sela: Come back with 8 gold for another potion.');
  }
}

function interactHealer() {
  state.player.hp = state.player.maxHp;
  message('Sister Hale restores your health.');
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
  message('Game saved on this device.');
  refresh();
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    message('No save file found on this device.');
    refresh();
    return;
  }
  try {
    state = JSON.parse(raw);
    message('Save loaded.');
  } catch {
    message('Save file is invalid.');
  }
  refresh();
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
  refs.inventoryLoot.textContent = `Loot: Rat tails ${countItem('rat_tail')}, Bat wings ${countItem('bat_wing')}, Wolf pelts ${countItem('wolf_pelt')}, Dire pelts ${countItem('dire_pelt')}, Orc badges ${countItem('orc_badge')}, Banner ${countItem('stolen_banner')}`;
  const npc = adjacentNpc();
  refs.interactButton.disabled = !npc;
  refs.interactButton.textContent = npc ? `Talk: ${npc.name}` : 'Interact';
  refs.swapWeaponButton.disabled = state.player.weapons.length <= 1;
  refs.usePotionButton.disabled = state.player.potions <= 0 || state.player.hp >= state.player.maxHp;
  refs.logOutput.innerHTML = state.logLines.map((line) => `<div class="log-entry">${escapeHtml(line)}</div>`).join('');
}

function objectiveText() {
  const quests = state.quests;
  if (quests.cellar_sweep.status === 'available') return 'Objective: Talk to Elder Mara to start the cellar sweep.';
  if (quests.cellar_sweep.status === 'active') return `Objective: Cellar Sweep — Rats ${quests.cellar_sweep.rat}/3, Bats ${quests.cellar_sweep.bat}/2.`;
  if (quests.cellar_sweep.status === 'turnin') return 'Objective: Return to Elder Mara for your cellar reward.';
  if (quests.wolf_hunt.status === 'available') return 'Objective: Talk to Brann the Hunter for the meadow contract.';
  if (quests.wolf_hunt.status === 'active') return `Objective: Wolf Hunt — Wolves ${quests.wolf_hunt.wolf}/2, Dire Wolves ${quests.wolf_hunt.dire_wolf}/1.`;
  if (quests.wolf_hunt.status === 'turnin') return 'Objective: Report back to Brann for the wolf reward.';
  if (quests.orc_threat.status === 'available') return 'Objective: Talk to Captain Ivo to begin the orc finale.';
  if (quests.orc_threat.status === 'active') return `Objective: Orc Threat — ${quests.orc_threat.chieftain_defeated ? 'chieftain down' : 'chieftain alive'}, ${quests.orc_threat.banner_collected ? 'banner recovered' : 'banner missing'}.`;
  if (quests.orc_threat.status === 'turnin') return 'Objective: Return the banner to Captain Ivo.';
  return 'Objective complete: you finished the current start-to-finish prototype loop.';
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
