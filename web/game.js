const TILE_SIZE = 32;
const SAVE_KEY = 'ashenfall-rpg-save-v4';
const LOG_LIMIT = 14;

const QUEST_ORDER = ['cellar_sweep', 'wolf_hunt', 'orc_threat', 'troll_hunt', 'crypt_ward', 'spider_brood'];
const QUEST_LABELS = {
  cellar_sweep: 'Cellar Sweep',
  wolf_hunt: 'Wolf Hunt',
  orc_threat: 'Orc Threat',
  troll_hunt: 'Troll Hollow',
  crypt_ward: 'Sunken Crypt',
  spider_brood: 'Webbed Nest'
};

const WEAPONS = {
  club: { name: 'Rough Club', minDamage: 3, maxDamage: 5, crit: 0.05, icon: 'club', range: 1 },
  knife: { name: 'Rusty Knife', minDamage: 4, maxDamage: 6, crit: 0.15, icon: 'knife', range: 1 },
  iron_sword: { name: 'Iron Sword', minDamage: 6, maxDamage: 9, crit: 0.12, icon: 'sword', range: 1 },
  spiked_mace: { name: 'Spiked Mace', minDamage: 8, maxDamage: 12, crit: 0.1, icon: 'mace', range: 1 },
  hunter_bow: { name: 'Hunter Bow', minDamage: 7, maxDamage: 11, crit: 0.18, icon: 'bow', range: 4 }
};

const ARMOR = {
  tattered_tunic: { name: 'Tattered Tunic', defense: 1, icon: 'tattered_tunic', slot: 'body' },
  worn_boots: { name: 'Worn Boots', defense: 1, icon: 'worn_boots', slot: 'feet' },
  buckler: { name: 'Buckler', defense: 2, icon: 'buckler', slot: 'offhand' },
  leather_vest: { name: 'Leather Vest', defense: 3, icon: 'leather_vest', slot: 'body' },
  chainmail: { name: 'Chainmail Coat', defense: 4, icon: 'chainmail', slot: 'body' },
  ranger_hood: { name: 'Ranger Hood', defense: 2, icon: 'hood', slot: 'head' }
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
  spider_silk: { name: 'Spider Silk' },
  brood_gland: { name: 'Brood Gland' },
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
  bone_guard: { name: 'Bone Guard', maxHp: 32, attack: 11, icon: 'skeleton', exp: 32, gold: [28, 38], drop: 'crypt_relic' },
  spider: { name: 'Cave Spider', maxHp: 18, attack: 8, icon: 'spider', exp: 20, gold: [12, 18], drop: 'spider_silk' },
  broodmother: { name: 'Broodmother', maxHp: 40, attack: 12, icon: 'spider', exp: 38, gold: [36, 48], drop: 'brood_gland' }
};

const MAP_DEFS = {
  town: {
    name: 'Ashenfall',
    story: 'Town hub with healing, trade, forging, and spell lore.',
    layout: [
      '################', '#,,,,,::::,,,,,#', '#,,...:..:...,,#', '#,,....:.....,,#', '#,,....::....,,#', '#:............:#',
      '#:....,,,,....:#', '#,,....::....,,#', '#,,..........,,#', '#,,...:<....>,,#', '#,,,,,::::,,,,,#', '################'
    ],
    npcs: [
      { id: 'healer', name: 'Sister Hale', pos: [4, 3] },
      { id: 'smith', name: 'Forgehand Bram', pos: [8, 3] },
      { id: 'captain', name: 'Captain Ivo', pos: [11, 3] },
      { id: 'acolyte', name: 'Acolyte Nera', pos: [4, 5] },
      { id: 'hunter', name: 'Brann the Hunter', pos: [8, 5] },
      { id: 'elder', name: 'Elder Mara', pos: [4, 8] },
      { id: 'trader', name: 'Trader Sela', pos: [11, 8] }
    ], exits: [
      { pos: [7, 9], targetMap: 'cellar', targetPos: [2, 10], message: 'You descend into the old cellar.' },
      { pos: [12, 9], targetMap: 'meadow', targetPos: [1, 5], message: 'You follow the road toward the meadow.' }
    ], enemies: [], items: []
  },
  cellar: {
    name: 'Old Cellar', story: 'Starter dungeon full of vermin and scrap gear.',
    layout: ['################', '#..............#', '#..##.....##...#', '#..............#', '#......##......#', '#..............#', '#..##......##..#', '#..............#', '#......##......#', '#..............#', '#.<.##......#..#', '################'],
    npcs: [], exits: [{ pos: [2, 10], targetMap: 'town', targetPos: [7, 8], message: 'You climb back into town.' }],
    enemies: [{ kind: 'rat', pos: [6, 2] }, { kind: 'rat', pos: [10, 3] }, { kind: 'rat', pos: [12, 9] }, { kind: 'bat', pos: [8, 7] }, { kind: 'bat', pos: [13, 5] }],
    items: [{ id: 'knife', pos: [4, 5] }, { id: 'worn_boots', pos: [11, 7] }, { id: 'small_potion', pos: [5, 9] }]
  },
  meadow: {
    name: 'Briar Meadow', story: 'Roadside fields where wolves and raiders roam.',
    layout: ['################', '#,,,,,,,,,,,,,,#', '#,,~~~,,...>.,,#', '#,,~~~~,......,#', '#,:::::,,..,,.,#', '#<:....,,,,...:#', '#,:....,,,,...:#', '#,:..,,....,..:#', '#,:..,,....,>..#', '#,::>##...,,..,#', '#,,,,,,,,,,,,,,#', '################'],
    npcs: [], exits: [
      { pos: [1, 5], targetMap: 'town', targetPos: [11, 9], message: 'You head back through the town road.' },
      { pos: [11, 2], targetMap: 'orc_den', targetPos: [2, 10], message: 'You enter the cracked cave mouth.' },
      { pos: [12, 8], targetMap: 'troll_hollow', targetPos: [2, 10], message: 'You push through the briars into troll country.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'sunken_crypt', targetPos: [2, 10], message: 'You descend through a cracked burial hatch.' },
      { pos: [3, 9], targetMap: 'webbed_nest', targetPos: [2, 10], message: 'You duck under torn webbing into a spider nest.' }
    ],
    enemies: [{ kind: 'wolf', pos: [5, 5] }, { kind: 'wolf', pos: [9, 7] }, { kind: 'dire_wolf', pos: [12, 4] }, { kind: 'orc', pos: [10, 6] }],
    items: [{ id: 'small_potion', pos: [4, 8] }, { id: 'buckler', pos: [10, 8] }, { id: 'mana_potion', pos: [6, 7] }]
  },
  orc_den: {
    name: 'Orc Den', story: 'Dark cave ending in the chieftain fight.',
    layout: ['################', '#..............#', '#..##...##.....#', '#...........#..#', '#.####.........#', '#......##......#', '#.........##...#', '#..##..........#', '#......####....#', '#..............#', '#.<.....##.....#', '################'],
    npcs: [], exits: [{ pos: [2, 10], targetMap: 'meadow', targetPos: [10, 2], message: 'You backtrack into the meadow air.' }],
    enemies: [{ kind: 'orc', pos: [7, 3] }, { kind: 'orc', pos: [11, 6] }, { kind: 'orc_chieftain', pos: [12, 8] }], items: [{ id: 'small_potion', pos: [5, 8] }]
  },
  troll_hollow: {
    name: 'Troll Hollow', story: 'A rocky sinkhole where trolls hoard stolen iron.',
    layout: ['################', '#,,,,....,,,,,,#', '#,~~~....~~~...#', '#,~~..##..~~...#', '#,..,....,.....#', '#...,...,,..##.#', '#...,,..,,.....#', '#..##....##....#', '#......,.......#', '#......,....>..#', '#.<....,,,,....#', '################'],
    npcs: [], exits: [{ pos: [2, 10], targetMap: 'meadow', targetPos: [12, 8], message: 'You slip back out to the meadow road.' }],
    enemies: [{ kind: 'troll', pos: [6, 4] }, { kind: 'troll', pos: [10, 6] }, { kind: 'troll_champion', pos: [11, 9] }], items: [{ id: 'small_potion', pos: [4, 7] }, { id: 'mana_potion', pos: [8, 8] }]
  },
  sunken_crypt: {
    name: 'Sunken Crypt', story: 'Flooded tomb passages haunted by old bones.',
    layout: ['################', '#..~~~~....,...#', '#..~~~.....,...#', '#....##..##....#', '#..............#', '#..,,......,,..#', '#..,,..##..,,..#', '#..............#', '#....##.....,..#', '#.........>....#', '#.<....,,......#', '################'],
    npcs: [], exits: [{ pos: [2, 10], targetMap: 'meadow', targetPos: [3, 9], message: 'You climb from the crypt back to the meadow.' }],
    enemies: [{ kind: 'skeleton', pos: [6, 4] }, { kind: 'skeleton', pos: [11, 5] }, { kind: 'bone_guard', pos: [10, 9] }], items: [{ id: 'mana_potion', pos: [4, 8] }]
  },
  webbed_nest: {
    name: 'Webbed Nest', story: 'Sticky tunnels full of hunting spiders.',
    layout: ['################', '#..............#', '#..##....##....#', '#...,,,,.......#', '#..,~~~~,,.....#', '#.....##.......#', '#..##......##..#', '#.....,,,,.....#', '#...##....##...#', '#.......>......#', '#.<.....##.....#', '################'],
    npcs: [], exits: [{ pos: [2, 10], targetMap: 'meadow', targetPos: [13, 9], message: 'You break free of the webbed tunnels.' }],
    enemies: [{ kind: 'spider', pos: [6, 3] }, { kind: 'spider', pos: [11, 5] }, { kind: 'broodmother', pos: [9, 9] }], items: [{ id: 'mana_potion', pos: [4, 7] }, { id: 'small_potion', pos: [12, 3] }]
  }
};

const TILE_ASSETS = {
  floor: 'assets/tiles/floor.svg', wall: 'assets/tiles/wall.svg', grass: 'assets/tiles/grass.svg', path: 'assets/tiles/path.svg', stairs: 'assets/tiles/stairs.svg', water: 'assets/tiles/water.svg',
  player: 'assets/actors/player.svg', npc: 'assets/actors/npc.svg', rat: 'assets/actors/rat.svg', bat: 'assets/actors/bat.svg', wolf: 'assets/actors/wolf.svg', orc: 'assets/actors/orc.svg', troll: 'assets/actors/troll.svg', skeleton: 'assets/actors/skeleton.svg', spider: 'assets/actors/spider.svg',
  club: 'assets/items/club.svg', knife: 'assets/items/knife.svg', sword: 'assets/items/sword.svg', mace: 'assets/items/mace.svg', bow: 'assets/items/bow.svg',
  tattered_tunic: 'assets/items/tunic.svg', worn_boots: 'assets/items/boots.svg', leather_vest: 'assets/items/vest.svg', buckler: 'assets/items/shield.svg', chainmail: 'assets/items/chainmail.svg', hood: 'assets/items/hood.svg',
  small_potion: 'assets/items/potion.svg', mana_potion: 'assets/items/mana_potion.svg', stolen_banner: 'assets/items/banner.svg', amulet: 'assets/items/amulet.svg'
};

const MERCHANT_STOCK = [
  { id: 'buckler', type: 'armor', price: 18 }, { id: 'knife', type: 'weapon', price: 12 }, { id: 'small_potion', type: 'item', price: 8 }, { id: 'mana_potion', type: 'item', price: 10 }, { id: 'hunter_bow', type: 'weapon', price: 42 }
];

const DIRECTIONS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const refs = {};
let ctx; let minimapCtx; let deferredPrompt = null; let images = {}; let state = null; let touchStart = null;

async function boot() {
  collectRefs(); bindEvents();
  ctx = refs.canvas.getContext('2d');
  minimapCtx = refs.minimapCanvas.getContext('2d');
  images = await loadImages();
  registerServiceWorker();
  startNewGame();
}

function collectRefs() {
  ['canvas','minimapCanvas','zoneName','zoneStory','objectiveText','nearbyText','playerLevel','playerHp','playerMana','playerXp','playerGold','playerWeapon','playerDefense','playerMagic','inventoryArmor','inventoryWeapons','inventoryPotions','inventoryLoot','questList','equipmentSlots','merchantStock','equipmentManager','inventoryManager','shopManager','dialogSpeaker','dialogText','closeDialogueButton','interactButton','swapWeaponButton','usePotionButton','useManaPotionButton','castHealButton','castBurstButton','quickShotButton','saveButton','loadButton','newRunButton','logOutput','installButton'].forEach((key) => {
    const idMap = { canvas: 'gameCanvas' };
    refs[key] = document.getElementById(idMap[key] || key);
  });
}

function bindEvents() {
  refs.interactButton.addEventListener('click', tryInteract);
  refs.swapWeaponButton.addEventListener('click', swapWeapon);
  refs.usePotionButton.addEventListener('click', usePotion);
  refs.useManaPotionButton.addEventListener('click', useManaPotion);
  refs.castHealButton.addEventListener('click', castMinorHeal);
  refs.castBurstButton.addEventListener('click', castArcaneBurst);
  refs.quickShotButton.addEventListener('click', quickShot);
  refs.saveButton.addEventListener('click', saveGame);
  refs.loadButton.addEventListener('click', loadGame);
  refs.newRunButton.addEventListener('click', startNewGame);
  refs.closeDialogueButton.addEventListener('click', clearDialogue);
  document.querySelectorAll('[data-move]').forEach((button) => button.addEventListener('click', () => playerTurn(DIRECTIONS[button.dataset.move])));
  refs.equipmentManager.addEventListener('click', handleManagerClick);
  refs.inventoryManager.addEventListener('click', handleManagerClick);
  refs.shopManager.addEventListener('click', handleManagerClick);
  window.addEventListener('keydown', handleKeyDown);
  refs.canvas.addEventListener('touchstart', (event) => { touchStart = getTouchPoint(event); }, { passive: true });
  refs.canvas.addEventListener('touchend', (event) => { if (touchStart) { handleSwipe(getTouchPoint(event.changedTouches[0]), touchStart); touchStart = null; } }, { passive: true });
  refs.canvas.addEventListener('mousedown', (event) => { touchStart = { x: event.clientX, y: event.clientY }; });
  refs.canvas.addEventListener('mouseup', (event) => { if (touchStart) { handleSwipe({ x: event.clientX, y: event.clientY }, touchStart); touchStart = null; } });
  window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredPrompt = event; refs.installButton.classList.remove('hidden'); });
  refs.installButton.addEventListener('click', async () => { if (deferredPrompt) { await deferredPrompt.prompt(); deferredPrompt = null; refs.installButton.classList.add('hidden'); } });
}

function handleKeyDown(event) {
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
  else if (key === '3') quickShot();
  else if (key === 'f') tryInteract();
}

function handleManagerClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const { action, id, slot } = button.dataset;
  clearDialogue();
  if (action === 'equip-weapon') equipWeapon(id);
  if (action === 'equip-armor') equipArmor(id, true);
  if (action === 'equip-charm') equipCharm(id);
  if (action === 'use-hp') usePotion();
  if (action === 'use-mp') useManaPotion();
  if (action === 'buy') buyItem(id);
  if (action === 'unequip' && slot) unequipSlot(slot);
  refresh();
}

function getTouchPoint(source) { const touch = source.touches ? source.touches[0] : source; return { x: touch.clientX, y: touch.clientY }; }
function handleSwipe(end, start) { const dx = end.x - start.x; const dy = end.y - start.y; if (Math.hypot(dx, dy) < 24) return; if (Math.abs(dx) > Math.abs(dy)) playerTurn(dx > 0 ? DIRECTIONS.right : DIRECTIONS.left); else playerTurn(dy > 0 ? DIRECTIONS.down : DIRECTIONS.up); }

function startNewGame() {
  state = {
    currentMapId: 'town',
    player: {
      pos: [7, 8], hp: 28, maxHp: 28, mana: 10, baseMaxMana: 10, maxMana: 10, level: 1, exp: 0, nextExp: 12, gold: 10,
      weapon: 'club', weapons: ['club'], armorOwned: ['tattered_tunic', 'worn_boots'], charmsOwned: [],
      equipment: { head: null, body: 'tattered_tunic', feet: 'worn_boots', offhand: null, charm: null },
      potions: 1, manaPotions: 0, spells: ['minor_heal'], inventory: { rat_tail: 0, bat_wing: 0, wolf_pelt: 0, dire_pelt: 0, orc_badge: 0, troll_tusk: 0, troll_iron: 0, bone_token: 0, crypt_relic: 0, spider_silk: 0, brood_gland: 0, stolen_banner: 0 }
    },
    quests: {
      cellar_sweep: { status: 'available', rat: 0, bat: 0 }, wolf_hunt: { status: 'locked', wolf: 0, dire_wolf: 0 }, orc_threat: { status: 'locked', chieftain_defeated: false, banner_collected: false },
      troll_hunt: { status: 'locked', troll: 0, troll_champion: 0 }, crypt_ward: { status: 'locked', skeleton: 0, bone_guard: 0, relic_collected: false }, spider_brood: { status: 'locked', spider: 0, broodmother: 0 }
    },
    worldState: Object.fromEntries(Object.keys(MAP_DEFS).map((mapId) => [mapId, { enemies: MAP_DEFS[mapId].enemies.map((entry) => makeEnemy(entry.kind, entry.pos)), items: MAP_DEFS[mapId].items.map((item) => ({ ...item, pos: [...item.pos] })) }])),
    logLines: [], dialogue: { speaker: 'Guide', text: 'Talk to Elder Mara first. Town, magic, shops, and gear management are all live.' }
  };
  message('Ashenfall now has equipment management, a real shop list, and a webbed late-game nest.');
  message('Use Quick Shot after you earn or buy the Hunter Bow.');
  refresh();
}

function makeEnemy(kind, pos) { const data = ENEMIES[kind]; return { kind, name: data.name, pos: [...pos], hp: data.maxHp, maxHp: data.maxHp, attack: data.attack, icon: data.icon, exp: data.exp, gold: [...data.gold], drop: data.drop }; }
function currentMap() { return MAP_DEFS[state.currentMapId]; }
function currentEnemies() { return state.worldState[state.currentMapId].enemies; }
function currentItems() { return state.worldState[state.currentMapId].items; }

function playerTurn(direction) {
  clearDialogue();
  const target = [state.player.pos[0] + direction[0], state.player.pos[1] + direction[1]];
  if (!inBounds(target)) return;
  const npc = npcAt(target);
  if (npc) return interactWithNpc(npc);
  const enemyIndex = enemyAt(target);
  if (enemyIndex !== -1) { attackEnemy(enemyIndex); return endPlayerAction(); }
  if (!isWalkable(target)) { message('That path is blocked.'); return refresh(); }
  state.player.pos = target;
  collectGroundItem(target);
  checkExit(target);
  endPlayerAction();
}

function endPlayerAction() { enemyTurn(); regenerateMana(1); refresh(); }

function attackEnemy(index, bonus = 0) {
  const enemy = currentEnemies()[index];
  const weapon = WEAPONS[state.player.weapon];
  let damage = randInt(weapon.minDamage, weapon.maxDamage) + Math.max(0, Math.floor((state.player.level - 1) / 2)) + bonus;
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
      if (state.player.hp <= 0) return handleDefeat();
    } else if (distance <= 6) {
      const nextStep = bestStepToward(enemy.pos, state.player.pos, i);
      if (!samePos(nextStep, enemy.pos)) enemy.pos = nextStep;
    }
  }
}

function bestStepToward(start, goal, skipIndex) {
  const xStep = Math.sign(goal[0] - start[0]); const yStep = Math.sign(goal[1] - start[1]); const candidates = [];
  if (Math.abs(goal[0] - start[0]) >= Math.abs(goal[1] - start[1])) { if (xStep) candidates.push([start[0] + xStep, start[1]]); if (yStep) candidates.push([start[0], start[1] + yStep]); }
  else { if (yStep) candidates.push([start[0], start[1] + yStep]); if (xStep) candidates.push([start[0] + xStep, start[1]]); }
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => candidates.push([start[0] + dx, start[1] + dy]));
  return candidates.find((candidate) => !samePos(candidate, state.player.pos) && isWalkable(candidate) && !npcAt(candidate) && enemyAt(candidate, skipIndex) === -1) || start;
}

function handleDefeat() {
  const goldLoss = Math.min(state.player.gold, Math.max(5, Math.floor(state.player.gold / 4)));
  state.player.gold -= goldLoss; state.player.hp = state.player.maxHp; state.player.mana = state.player.maxMana; state.currentMapId = 'town'; state.player.pos = [7, 8];
  say('Sister Hale', `You collapse, lose ${goldLoss} gold, and wake back in Ashenfall.`); refresh();
}

function collectGroundItem(pos) {
  for (let i = currentItems().length - 1; i >= 0; i -= 1) {
    if (!samePos(currentItems()[i].pos, pos)) continue;
    const [item] = currentItems().splice(i, 1);
    collectItemById(item.id);
  }
}

function collectItemById(itemId) {
  if (WEAPONS[itemId]) { if (!state.player.weapons.includes(itemId)) { state.player.weapons.push(itemId); message(`You claim ${WEAPONS[itemId].name}.`); } if (weaponScore(itemId) > weaponScore(state.player.weapon)) equipWeapon(itemId); return; }
  if (ARMOR[itemId]) { if (!state.player.armorOwned.includes(itemId)) { state.player.armorOwned.push(itemId); message(`You claim ${ARMOR[itemId].name}.`); } equipArmor(itemId); return; }
  if (CHARMS[itemId]) { if (!state.player.charmsOwned.includes(itemId)) state.player.charmsOwned.push(itemId); equipCharm(itemId); return; }
  if (itemId === 'small_potion') { state.player.potions += 1; return message('You stash a Small Potion.'); }
  if (itemId === 'mana_potion') { state.player.manaPotions += 1; return message('You stash a Mana Potion.'); }
  addInventoryItem(itemId);
  if (itemId === 'stolen_banner') { state.quests.orc_threat.banner_collected = true; message('You recovered the Stolen Banner.'); updateOrcQuestState(); }
}

function equipWeapon(itemId) { state.player.weapon = itemId; message(`You equip ${WEAPONS[itemId].name}.`); }
function equipArmor(itemId, manual = false) {
  const slot = ARMOR[itemId].slot; const equipped = state.player.equipment[slot];
  if (manual || !equipped || ARMOR[itemId].defense >= ARMOR[equipped].defense) { state.player.equipment[slot] = itemId; message(`You equip ${ARMOR[itemId].name}.`); }
}
function equipCharm(itemId) { state.player.equipment.charm = itemId; recalculateManaPool(); state.player.mana = Math.min(state.player.maxMana, state.player.mana + 4); message(`You equip ${CHARMS[itemId].name}.`); }
function unequipSlot(slot) { if (slot === 'body' || slot === 'feet') return message('That slot cannot be left empty.'); state.player.equipment[slot] = null; recalculateManaPool(); message(`You clear your ${slot} slot.`); }
function addInventoryItem(itemId) { state.player.inventory[itemId] = (state.player.inventory[itemId] || 0) + 1; message(`Looted ${ITEMS[itemId].name}.`); if (itemId === 'crypt_relic') { state.quests.crypt_ward.relic_collected = true; updateCryptQuestState(); } }

function recordEnemyDefeat(kind, pos) {
  if (state.quests.cellar_sweep.status === 'active') {
    if (kind === 'rat') state.quests.cellar_sweep.rat += 1; if (kind === 'bat') state.quests.cellar_sweep.bat += 1;
    if (state.quests.cellar_sweep.rat >= 3 && state.quests.cellar_sweep.bat >= 2) { state.quests.cellar_sweep.status = 'turnin'; message('Cellar Sweep is complete. Return to Elder Mara.'); }
  }
  if (state.quests.wolf_hunt.status === 'active') {
    if (kind === 'wolf') state.quests.wolf_hunt.wolf += 1; if (kind === 'dire_wolf') state.quests.wolf_hunt.dire_wolf += 1;
    if (state.quests.wolf_hunt.wolf >= 2 && state.quests.wolf_hunt.dire_wolf >= 1) { state.quests.wolf_hunt.status = 'turnin'; message('Wolf Hunt is complete. Report back to Brann.'); }
  }
  if (state.quests.orc_threat.status === 'active' && kind === 'orc_chieftain') { state.quests.orc_threat.chieftain_defeated = true; dropItem(pos, 'stolen_banner'); message('The Orc Chieftain falls and drops the stolen banner.'); updateOrcQuestState(); }
  if (state.quests.troll_hunt.status === 'active') {
    if (kind === 'troll') state.quests.troll_hunt.troll += 1; if (kind === 'troll_champion') state.quests.troll_hunt.troll_champion += 1;
    if (state.quests.troll_hunt.troll >= 2 && state.quests.troll_hunt.troll_champion >= 1) { state.quests.troll_hunt.status = 'turnin'; message('Troll Hollow is clear. Return to Forgehand Bram.'); }
  }
  if (state.quests.crypt_ward.status === 'active') {
    if (kind === 'skeleton') state.quests.crypt_ward.skeleton += 1;
    if (kind === 'bone_guard') { state.quests.crypt_ward.bone_guard += 1; dropItem(pos, 'sun_amulet'); message('The Bone Guard falls and reveals a Sun Amulet.'); }
    updateCryptQuestState();
  }
  if (state.quests.spider_brood.status === 'active') {
    if (kind === 'spider') state.quests.spider_brood.spider += 1;
    if (kind === 'broodmother') state.quests.spider_brood.broodmother += 1;
    if (state.quests.spider_brood.spider >= 2 && state.quests.spider_brood.broodmother >= 1) { state.quests.spider_brood.status = 'turnin'; message('The Webbed Nest is broken. Return to Brann.'); }
  }
}

function updateOrcQuestState() { if (state.quests.orc_threat.status === 'active' && state.quests.orc_threat.chieftain_defeated && state.quests.orc_threat.banner_collected) { state.quests.orc_threat.status = 'turnin'; message('Return the banner to Captain Ivo.'); } }
function updateCryptQuestState() { if (state.quests.crypt_ward.status === 'active' && state.quests.crypt_ward.skeleton >= 2 && state.quests.crypt_ward.bone_guard >= 1 && state.quests.crypt_ward.relic_collected) { state.quests.crypt_ward.status = 'turnin'; message('Sunken Crypt is cleansed. Return to Acolyte Nera.'); } }
function dropItem(pos, itemId) { currentItems().push({ id: itemId, pos: [...pos] }); }

function gainExperience(amount) {
  state.player.exp += amount;
  while (state.player.exp >= state.player.nextExp) {
    state.player.exp -= state.player.nextExp; state.player.level += 1; state.player.nextExp += 6; state.player.maxHp += 5; state.player.baseMaxMana += 2; recalculateManaPool(); state.player.hp = state.player.maxHp; state.player.mana = state.player.maxMana; say('Guide', `Level up! You are now level ${state.player.level}.`);
  }
}
function recalculateManaPool() { state.player.maxMana = state.player.baseMaxMana + charmManaBonus(); state.player.mana = Math.min(state.player.mana, state.player.maxMana); }
function regenerateMana(amount) { state.player.mana = Math.min(state.player.maxMana, state.player.mana + amount); }

function swapWeapon() { clearDialogue(); const i = state.player.weapons.indexOf(state.player.weapon); if (state.player.weapons.length <= 1) { message('You have no alternate weapon yet.'); return refresh(); } state.player.weapon = state.player.weapons[(i + 1) % state.player.weapons.length]; message(`Equipped ${WEAPONS[state.player.weapon].name}.`); refresh(); }
function usePotion() { clearDialogue(); if (state.player.potions <= 0) { message('No potion available.'); return refresh(); } if (state.player.hp >= state.player.maxHp) { message('You are already at full health.'); return refresh(); } state.player.potions -= 1; state.player.hp = Math.min(state.player.maxHp, state.player.hp + ITEMS.small_potion.heal); message('You drink a Small Potion.'); endPlayerAction(); }
function useManaPotion() { clearDialogue(); if (state.player.manaPotions <= 0) { message('No mana potion available.'); return refresh(); } if (state.player.mana >= state.player.maxMana) { message('Your mana is already full.'); return refresh(); } state.player.manaPotions -= 1; state.player.mana = Math.min(state.player.maxMana, state.player.mana + ITEMS.mana_potion.mana); message('You drink a Mana Potion.'); endPlayerAction(); }

function castMinorHeal() {
  clearDialogue();
  if (!state.player.spells.includes('minor_heal')) { message('You do not know that spell.'); return refresh(); }
  if (state.player.mana < SPELLS.minor_heal.cost) { message('Not enough mana for Cast Heal.'); return refresh(); }
  if (state.player.hp >= state.player.maxHp) { message('You are already at full health.'); return refresh(); }
  state.player.mana -= SPELLS.minor_heal.cost;
  const heal = 8 + spellPowerBonus();
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
  say('Acolyte Nera', `Warm light seals your wounds for ${heal} health.`);
  endPlayerAction();
}

function castArcaneBurst() {
  clearDialogue();
  if (!state.player.spells.includes('arcane_burst')) { message('You have not learned Arcane Burst yet.'); return refresh(); }
  if (state.player.mana < SPELLS.arcane_burst.cost) { message('Not enough mana for Arcane Burst.'); return refresh(); }
  const targets = adjacentEnemyIndexes();
  if (targets.length === 0) { message('No adjacent enemies for Arcane Burst.'); return refresh(); }
  state.player.mana -= SPELLS.arcane_burst.cost;
  const damage = 7 + spellPowerBonus();
  [...targets].sort((a, b) => b - a).forEach((index) => { const enemy = currentEnemies()[index]; if (!enemy) return; enemy.hp -= damage; message(`Arcane Burst hits ${enemy.name} for ${damage} damage.`); if (enemy.hp <= 0) defeatEnemy(index, enemy); });
  endPlayerAction();
}

function quickShot() {
  clearDialogue();
  if (state.player.weapon !== 'hunter_bow') { message('Equip the Hunter Bow to use Quick Shot.'); return refresh(); }
  const targetIndex = findRangedTarget();
  if (targetIndex === -1) { message('No clear target in a straight line for Quick Shot.'); return refresh(); }
  const enemy = currentEnemies()[targetIndex];
  const damage = randInt(WEAPONS.hunter_bow.minDamage, WEAPONS.hunter_bow.maxDamage) + 2;
  enemy.hp -= damage;
  message(`Quick Shot pierces ${enemy.name} for ${damage} damage.`);
  if (enemy.hp <= 0) defeatEnemy(targetIndex, enemy);
  endPlayerAction();
}

function adjacentEnemyIndexes() { return Object.values(DIRECTIONS).map(([dx, dy]) => enemyAt([state.player.pos[0] + dx, state.player.pos[1] + dy])).filter((index, pos, arr) => index !== -1 && arr.indexOf(index) === pos); }
function findRangedTarget() {
  const dirs = Object.values(DIRECTIONS);
  for (const [dx, dy] of dirs) {
    for (let step = 1; step <= WEAPONS.hunter_bow.range; step += 1) {
      const pos = [state.player.pos[0] + dx * step, state.player.pos[1] + dy * step];
      if (!inBounds(pos) || tileAt(pos) === '#') break;
      const index = enemyAt(pos);
      if (index !== -1) return index;
    }
  }
  return -1;
}
function spellPowerBonus() { const charm = state.player.equipment.charm; return charm ? CHARMS[charm].spellPower : 0; }
function charmManaBonus() { const charm = state.player.equipment.charm; return charm ? CHARMS[charm].manaBonus : 0; }

function tryInteract() { const npc = adjacentNpc(); if (!npc) { message('No one is close enough to talk to.'); return refresh(); } interactWithNpc(npc); }
function interactWithNpc(npc) { ({ elder: interactElder, hunter: interactHunter, captain: interactCaptain, trader: interactTrader, healer: interactHealer, smith: interactSmith, acolyte: interactAcolyte }[npc.id] || (() => {}))(); refresh(); }

function interactElder() {
  const quest = state.quests.cellar_sweep;
  if (quest.status === 'available') { quest.status = 'active'; return say('Elder Mara', 'Clear the cellar. Bring me proof the rats and bats are gone.'); }
  if (quest.status === 'active') return say('Elder Mara', 'The cellar still needs 3 rats and 2 bats cleared.');
  if (quest.status === 'turnin') { quest.status = 'done'; state.quests.wolf_hunt.status = 'available'; state.player.gold += 12; state.player.potions += 1; if (!state.player.spells.includes('minor_heal')) state.player.spells.push('minor_heal'); return say('Elder Mara', 'Good work. Take 12 gold and a potion, then speak to Nera and Brann.'); }
  say('Elder Mara', 'Ashenfall is steadier now. Keep pushing outward.');
}

function interactHunter() {
  const wolfQuest = state.quests.wolf_hunt; const spiderQuest = state.quests.spider_brood;
  if (wolfQuest.status === 'locked') return say('Brann the Hunter', 'Help the elder first. The meadow can wait.');
  if (wolfQuest.status === 'available') { wolfQuest.status = 'active'; return say('Brann the Hunter', 'Thin the meadow pack. I need 2 wolves and the dire alpha gone.'); }
  if (wolfQuest.status === 'active') return say('Brann the Hunter', 'The road is still unsafe. Finish the pack.');
  if (wolfQuest.status === 'turnin') { wolfQuest.status = 'done'; state.quests.orc_threat.status = 'available'; state.player.gold += 20; state.player.potions += 1; collectItemById('leather_vest'); return say('Brann the Hunter', 'Take this leather vest, 20 gold, and a potion. Captain Ivo has a harder job next.'); }
  if (state.quests.crypt_ward.status !== 'done') return say('Brann the Hunter', 'When the crypt is quiet, I have one more nest to burn out.');
  if (spiderQuest.status === 'available') { spiderQuest.status = 'active'; if (!state.player.weapons.includes('hunter_bow')) state.player.weapons.push('hunter_bow'); state.player.weapon = 'hunter_bow'; return say('Brann the Hunter', 'Take this Hunter Bow. Clear 2 spiders and the broodmother from the webbed nest.'); }
  if (spiderQuest.status === 'active') return say('Brann the Hunter', 'Keep your distance and shoot down the nest.');
  if (spiderQuest.status === 'turnin') { spiderQuest.status = 'done'; collectItemById('ranger_hood'); state.player.gold += 90; return say('Brann the Hunter', 'Fine shooting. Take this Ranger Hood and 90 gold.'); }
  if (spiderQuest.status === 'locked') { state.quests.spider_brood.status = 'available'; return say('Brann the Hunter', 'The webbed nest has opened east of the meadow. Come back ready.'); }
  say('Brann the Hunter', 'You have everything a roadwarden needs now.');
}

function interactCaptain() {
  const quest = state.quests.orc_threat;
  if (quest.status === 'locked') return say('Captain Ivo', 'Earn Brann\'s trust first.');
  if (quest.status === 'available') { quest.status = 'active'; return say('Captain Ivo', 'Enter the orc den, kill the chieftain, and recover our banner.'); }
  if (quest.status === 'active') return say('Captain Ivo', quest.chieftain_defeated ? 'Find the banner before you return.' : 'The chieftain still lives.');
  if (quest.status === 'turnin') { quest.status = 'done'; state.quests.troll_hunt.status = 'available'; state.player.gold += 40; if (!state.player.weapons.includes('iron_sword')) state.player.weapons.push('iron_sword'); state.player.weapon = 'iron_sword'; return say('Captain Ivo', 'Ashenfall is safe for now. Take this Iron Sword and see Bram about the trolls.'); }
  say('Captain Ivo', 'Keep the roads clean and the den quiet.');
}

function interactTrader() {
  if (!isNearTrader()) return say('Trader Sela', 'Stand near the market stall and use the shop window.');
  say('Trader Sela', 'Use the shop window below. Buy what you can afford.');
}
function interactHealer() { state.player.hp = state.player.maxHp; state.player.mana = state.player.maxMana; say('Sister Hale', 'You are mended in body and mind.'); }

function interactSmith() {
  const quest = state.quests.troll_hunt;
  if (quest.status === 'locked') return say('Forgehand Bram', 'Bring me proof the orcs are dealt with and I will speak of better iron.');
  if (quest.status === 'available') { quest.status = 'active'; return say('Forgehand Bram', 'Trolls stole my iron from the hollow. Kill 2 trolls and their champion, then return what they took.'); }
  if (quest.status === 'active') return say('Forgehand Bram', 'The hollow still stinks of troll blood and stolen iron. Finish it.');
  if (quest.status === 'turnin') { quest.status = 'done'; state.quests.crypt_ward.status = 'available'; state.player.gold += 60; if (!state.player.weapons.includes('spiked_mace')) state.player.weapons.push('spiked_mace'); state.player.weapon = 'spiked_mace'; collectItemById('chainmail'); return say('Forgehand Bram', 'Here. Spiked Mace, Chainmail Coat, and 60 gold. Nera wants a word about the crypt.'); }
  say('Forgehand Bram', 'Your kit is solid. Keep it that way.');
}

function interactAcolyte() {
  const quest = state.quests.crypt_ward;
  if (state.quests.cellar_sweep.status === 'available') return say('Acolyte Nera', 'Elder Mara needs the cellar purged first.');
  if (state.quests.cellar_sweep.status !== 'done') return say('Acolyte Nera', 'When the cellar is safe, I will teach you how to mend yourself with mana.');
  if (quest.status === 'locked') return say('Acolyte Nera', 'I have shown you Cast Heal. Return after Bram\'s troll trouble is settled for a deeper rite.');
  if (quest.status === 'available') { quest.status = 'active'; return say('Acolyte Nera', 'Descend into the Sunken Crypt. Break 2 skeletons, destroy the Bone Guard, and recover the relic below.'); }
  if (quest.status === 'active') return say('Acolyte Nera', quest.relic_collected ? 'The relic is in your pack. Finish cleansing the dead if any remain.' : 'The dead below still stir.');
  if (quest.status === 'turnin') { quest.status = 'done'; if (!state.player.spells.includes('arcane_burst')) state.player.spells.push('arcane_burst'); collectItemById('sun_amulet'); state.player.gold += 70; state.quests.spider_brood.status = 'available'; return say('Acolyte Nera', 'Take the Sun Amulet, 70 gold, and the rite of Arcane Burst.'); }
  say('Acolyte Nera', 'Your magic is steady now.');
}

function buyItem(itemId) {
  if (!isNearTrader()) { message('You need to stand next to Trader Sela to buy gear.'); return; }
  const offer = MERCHANT_STOCK.find((entry) => entry.id === itemId);
  if (!offer) return;
  if (state.player.gold < offer.price) return say('Trader Sela', `${merchantItemName(offer)} costs ${offer.price} gold.`);
  if (offer.type === 'weapon' && state.player.weapons.includes(itemId)) return message('You already own that weapon.');
  if (offer.type === 'armor' && state.player.armorOwned.includes(itemId)) return message('You already own that armor.');
  state.player.gold -= offer.price;
  grantMerchantOffer(offer);
  say('Trader Sela', `${merchantItemName(offer)} is yours for ${offer.price} gold.`);
}

function isNearTrader() { const npc = adjacentNpc(); return npc && npc.id === 'trader'; }
function grantMerchantOffer(offer) { if (offer.type === 'weapon' || offer.type === 'armor') collectItemById(offer.id); else if (offer.id === 'small_potion') state.player.potions += 1; else if (offer.id === 'mana_potion') state.player.manaPotions += 1; }
function merchantItemName(offer) { if (offer.type === 'weapon') return WEAPONS[offer.id].name; if (offer.type === 'armor') return ARMOR[offer.id].name; return ITEMS[offer.id].name; }

function checkExit(pos) { const exit = currentMap().exits.find((entry) => samePos(entry.pos, pos)); if (!exit) return; state.currentMapId = exit.targetMap; state.player.pos = [...exit.targetPos]; message(exit.message); }
function saveGame() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); say('Guide', 'Game saved on this device.'); refresh(); }
function loadGame() { const raw = localStorage.getItem(SAVE_KEY); if (!raw) { say('Guide', 'No save file found on this device.'); return refresh(); } try { state = JSON.parse(raw); ensureSaveShape(); say('Guide', 'Save loaded.'); } catch { say('Guide', 'Save file is invalid.'); } refresh(); }

function ensureSaveShape() {
  state.player.mana ??= 10; state.player.baseMaxMana ??= state.player.maxMana ?? 10; state.player.maxMana ??= state.player.baseMaxMana;
  state.player.armorOwned ??= state.player.armor ?? ['tattered_tunic', 'worn_boots']; state.player.charmsOwned ??= []; state.player.equipment ??= { head: null, body: 'tattered_tunic', feet: 'worn_boots', offhand: state.player.armorOwned.includes('buckler') ? 'buckler' : null, charm: null };
  state.player.equipment.head ??= null; state.player.manaPotions ??= 0; state.player.spells ??= ['minor_heal'];
  ['troll_hunt','crypt_ward','spider_brood'].forEach((questId) => { if (!state.quests[questId]) state.quests[questId] = questId === 'troll_hunt' ? { status: 'locked', troll: 0, troll_champion: 0 } : questId === 'crypt_ward' ? { status: 'locked', skeleton: 0, bone_guard: 0, relic_collected: false } : { status: 'locked', spider: 0, broodmother: 0 }; });
  ['troll_hollow','sunken_crypt','webbed_nest'].forEach((mapId) => { if (!state.worldState[mapId]) state.worldState[mapId] = { enemies: MAP_DEFS[mapId].enemies.map((entry) => makeEnemy(entry.kind, entry.pos)), items: MAP_DEFS[mapId].items.map((item) => ({ ...item, pos: [...item.pos] })) }; });
  state.dialogue ??= { speaker: 'Guide', text: 'Save loaded.' };
  ['bone_token','crypt_relic','spider_silk','brood_gland'].forEach((itemId) => { state.player.inventory[itemId] ??= 0; });
  recalculateManaPool();
}

function render() {
  const layout = currentMap().layout;
  ctx.clearRect(0, 0, refs.canvas.width, refs.canvas.height);
  layout.forEach((row, y) => [...row].forEach((tile, x) => { drawImage(tileTextureKey(tile), x, y); ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }));
  currentItems().forEach((item) => drawImage(iconKeyForItem(item.id), item.pos[0], item.pos[1], 8, 8, 16, 16));
  currentMap().npcs.forEach((npc) => drawImage('npc', npc.pos[0], npc.pos[1]));
  currentEnemies().forEach((enemy) => { drawImage(enemy.icon, enemy.pos[0], enemy.pos[1]); drawBars(enemy.pos, enemy.hp, enemy.maxHp); });
  drawImage('player', state.player.pos[0], state.player.pos[1]);
  drawBars(state.player.pos, state.player.hp, state.player.maxHp, state.player.mana, state.player.maxMana);
  renderMinimap();
}

function renderMinimap() {
  const layout = currentMap().layout; const scale = 8; minimapCtx.clearRect(0, 0, refs.minimapCanvas.width, refs.minimapCanvas.height);
  layout.forEach((row, y) => [...row].forEach((tile, x) => { minimapCtx.fillStyle = minimapTileColor(tile); minimapCtx.fillRect(x * scale, y * scale, scale, scale); }));
  currentMap().npcs.forEach((npc) => { minimapCtx.fillStyle = '#e0ba79'; minimapCtx.fillRect(npc.pos[0] * scale + 2, npc.pos[1] * scale + 2, 4, 4); });
  currentEnemies().forEach((enemy) => { minimapCtx.fillStyle = '#b34343'; minimapCtx.fillRect(enemy.pos[0] * scale + 1, enemy.pos[1] * scale + 1, 6, 6); });
  minimapCtx.fillStyle = '#5be087'; minimapCtx.fillRect(state.player.pos[0] * scale + 1, state.player.pos[1] * scale + 1, 6, 6);
}

function drawImage(key, tileX, tileY, offsetX = 0, offsetY = 0, width = TILE_SIZE, height = TILE_SIZE) { const image = images[key]; if (image) ctx.drawImage(image, tileX * TILE_SIZE + offsetX, tileY * TILE_SIZE + offsetY, width, height); }
function drawBars(pos, hp, maxHp, mana = null, maxMana = null) {
  ctx.fillStyle = '#331212'; ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 2, 24, 4); ctx.fillStyle = '#4ed97d'; ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 2, 24 * Math.max(0, hp / maxHp), 4);
  if (mana !== null && maxMana !== null) { ctx.fillStyle = '#14233e'; ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 7, 24, 3); ctx.fillStyle = '#63a5ff'; ctx.fillRect(pos[0] * TILE_SIZE + 4, pos[1] * TILE_SIZE + 7, 24 * Math.max(0, mana / maxMana), 3); }
}

function refresh() {
  render();
  refs.zoneName.textContent = currentMap().name; refs.zoneStory.textContent = currentMap().story; refs.objectiveText.textContent = objectiveText(); refs.nearbyText.textContent = nearbyText();
  refs.playerLevel.textContent = String(state.player.level); refs.playerHp.textContent = `${state.player.hp}/${state.player.maxHp}`; refs.playerMana.textContent = `${state.player.mana}/${state.player.maxMana}`; refs.playerXp.textContent = `${state.player.exp}/${state.player.nextExp}`; refs.playerGold.textContent = String(state.player.gold); refs.playerWeapon.textContent = WEAPONS[state.player.weapon].name; refs.playerDefense.textContent = String(totalDefense()); refs.playerMagic.textContent = state.player.spells.map((spellId) => SPELLS[spellId].name).join(', ');
  refs.inventoryArmor.textContent = `Armor: ${state.player.armorOwned.map((id) => ARMOR[id].name).join(', ')}`;
  refs.inventoryWeapons.textContent = `Weapons: ${state.player.weapons.map((id) => WEAPONS[id].name).join(', ')}`;
  refs.inventoryPotions.textContent = `Potions: ${state.player.potions} | Mana Potions: ${state.player.manaPotions}`;
  refs.inventoryLoot.textContent = `Loot: Rat ${countItem('rat_tail')}, Bat ${countItem('bat_wing')}, Wolf ${countItem('wolf_pelt')}, Dire ${countItem('dire_pelt')}, Orc ${countItem('orc_badge')}, Troll ${countItem('troll_tusk')}, Bone ${countItem('bone_token')}, Silk ${countItem('spider_silk')}`;
  refs.equipmentSlots.textContent = `Head: ${slotName('head')}\nBody: ${slotName('body')}\nFeet: ${slotName('feet')}\nOffhand: ${slotName('offhand')}\nCharm: ${slotName('charm')}\nWeapon: ${WEAPONS[state.player.weapon].name}`;
  refs.merchantStock.textContent = merchantStockText();
  renderQuestList(); renderEquipmentManager(); renderInventoryManager(); renderShopManager();
  refs.dialogSpeaker.textContent = state.dialogue?.speaker || 'Guide'; refs.dialogText.textContent = state.dialogue?.text || 'Explore Ashenfall.';
  const npc = adjacentNpc(); refs.interactButton.disabled = !npc; refs.interactButton.textContent = npc ? `Talk: ${npc.name}` : 'Interact';
  refs.swapWeaponButton.disabled = state.player.weapons.length <= 1; refs.usePotionButton.disabled = state.player.potions <= 0 || state.player.hp >= state.player.maxHp; refs.useManaPotionButton.disabled = state.player.manaPotions <= 0 || state.player.mana >= state.player.maxMana; refs.castHealButton.disabled = !state.player.spells.includes('minor_heal') || state.player.mana < SPELLS.minor_heal.cost || state.player.hp >= state.player.maxHp; refs.castBurstButton.disabled = !state.player.spells.includes('arcane_burst') || state.player.mana < SPELLS.arcane_burst.cost || adjacentEnemyIndexes().length === 0; refs.quickShotButton.disabled = state.player.weapon !== 'hunter_bow' || findRangedTarget() === -1;
  refs.logOutput.innerHTML = state.logLines.map((line) => `<div class="log-entry">${escapeHtml(line)}</div>`).join('');
}

function renderQuestList() { refs.questList.innerHTML = QUEST_ORDER.map((questId) => `<div class="quest-row"><strong>${QUEST_LABELS[questId]}</strong><span>${escapeHtml(questStatusText(questId))}</span></div>`).join(''); }
function renderEquipmentManager() {
  const weaponRows = state.player.weapons.map((id) => actionRow(WEAPONS[id].name, id === state.player.weapon ? 'Equipped weapon' : `Damage ${WEAPONS[id].minDamage}-${WEAPONS[id].maxDamage}`, id === state.player.weapon ? null : buttonHtml('equip-weapon', id, 'Equip')));
  const armorRows = state.player.armorOwned.map((id) => { const equipped = state.player.equipment[ARMOR[id].slot] === id; return actionRow(ARMOR[id].name, `${ARMOR[id].slot} • Defense ${ARMOR[id].defense}${equipped ? ' • equipped' : ''}`, equipped ? null : buttonHtml('equip-armor', id, 'Equip')); });
  const charmRows = state.player.charmsOwned.length ? state.player.charmsOwned.map((id) => actionRow(CHARMS[id].name, state.player.equipment.charm === id ? 'Equipped charm' : 'Mana +6 • Spell power +2', state.player.equipment.charm === id ? buttonHtml('unequip', '', 'Unequip', 'charm') : buttonHtml('equip-charm', id, 'Equip'))) : [actionRow('No charm yet', 'Clear the Sunken Crypt to earn one.', null)];
  refs.equipmentManager.innerHTML = [...weaponRows, ...armorRows, ...charmRows].join('');
}
function renderInventoryManager() {
  const rows = [
    actionRow('Small Potion', `Owned: ${state.player.potions} • Heal 10`, buttonHtml('use-hp', '', 'Use', '', state.player.potions <= 0 || state.player.hp >= state.player.maxHp)),
    actionRow('Mana Potion', `Owned: ${state.player.manaPotions} • Restore 8 mana`, buttonHtml('use-mp', '', 'Use', '', state.player.manaPotions <= 0 || state.player.mana >= state.player.maxMana))
  ];
  refs.inventoryManager.innerHTML = rows.join('');
}
function renderShopManager() { refs.shopManager.innerHTML = MERCHANT_STOCK.map((offer) => actionRow(merchantItemName(offer), `${offer.price} gold${ownsOffer(offer) ? ' • owned' : ''}`, buttonHtml('buy', offer.id, isNearTrader() ? 'Buy' : 'Stand by trader', '', !isNearTrader() || ownsOffer(offer) || state.player.gold < offer.price))).join(''); }
function actionRow(title, detail, buttonMarkup) { return `<div class="action-row"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span>${buttonMarkup || ''}</div>`; }
function buttonHtml(action, id, label, slot = '', disabled = false) { return `<button class="${action === 'buy' ? 'ok' : 'secondary'}" data-action="${action}" data-id="${escapeHtml(id)}" ${slot ? `data-slot="${slot}"` : ''} ${disabled ? 'disabled' : ''}>${escapeHtml(label)}</button>`; }

function objectiveText() {
  const q = state.quests;
  if (q.cellar_sweep.status === 'available') return 'Objective: Talk to Elder Mara to start the cellar sweep.';
  if (q.cellar_sweep.status === 'active') return `Objective: Cellar Sweep — Rats ${q.cellar_sweep.rat}/3, Bats ${q.cellar_sweep.bat}/2.`;
  if (q.cellar_sweep.status === 'turnin') return 'Objective: Return to Elder Mara for your cellar reward.';
  if (q.wolf_hunt.status === 'available') return 'Objective: Talk to Brann for the meadow contract.';
  if (q.wolf_hunt.status === 'active') return `Objective: Wolf Hunt — Wolves ${q.wolf_hunt.wolf}/2, Dire Wolves ${q.wolf_hunt.dire_wolf}/1.`;
  if (q.wolf_hunt.status === 'turnin') return 'Objective: Report back to Brann for the wolf reward.';
  if (q.orc_threat.status === 'available') return 'Objective: Talk to Captain Ivo to begin the orc strike.';
  if (q.orc_threat.status === 'active') return `Objective: Orc Threat — ${q.orc_threat.chieftain_defeated ? 'chieftain down' : 'chieftain alive'}, ${q.orc_threat.banner_collected ? 'banner recovered' : 'banner missing'}.`;
  if (q.orc_threat.status === 'turnin') return 'Objective: Return the banner to Captain Ivo.';
  if (q.troll_hunt.status === 'available') return 'Objective: Talk to Bram for the troll hollow contract.';
  if (q.troll_hunt.status === 'active') return `Objective: Troll Hollow — Trolls ${q.troll_hunt.troll}/2, Champion ${q.troll_hunt.troll_champion}/1.`;
  if (q.troll_hunt.status === 'turnin') return 'Objective: Return to Bram for your forged reward.';
  if (q.crypt_ward.status === 'available') return 'Objective: Talk to Acolyte Nera for the Sunken Crypt rite.';
  if (q.crypt_ward.status === 'active') return `Objective: Sunken Crypt — Skeletons ${q.crypt_ward.skeleton}/2, Bone Guard ${q.crypt_ward.bone_guard}/1, Relic ${q.crypt_ward.relic_collected ? 'found' : 'missing'}.`;
  if (q.crypt_ward.status === 'turnin') return 'Objective: Return the relic to Acolyte Nera.';
  if (q.spider_brood.status === 'available') return 'Objective: Talk to Brann to start the Webbed Nest hunt.';
  if (q.spider_brood.status === 'active') return `Objective: Webbed Nest — Spiders ${q.spider_brood.spider}/2, Broodmother ${q.spider_brood.broodmother}/1.`;
  if (q.spider_brood.status === 'turnin') return 'Objective: Return to Brann for your ranged reward.';
  return 'Objective complete: you finished the current expanded vertical slice.';
}

function questStatusText(questId) {
  const q = state.quests[questId];
  if (questId === 'cellar_sweep' && q.status === 'active') return `Active — Rats ${q.rat}/3, Bats ${q.bat}/2`;
  if (questId === 'wolf_hunt' && q.status === 'active') return `Active — Wolves ${q.wolf}/2, Dire Wolves ${q.dire_wolf}/1`;
  if (questId === 'orc_threat' && q.status === 'active') return `Active — ${q.chieftain_defeated ? 'chieftain down' : 'chieftain alive'}, ${q.banner_collected ? 'banner recovered' : 'banner missing'}`;
  if (questId === 'troll_hunt' && q.status === 'active') return `Active — Trolls ${q.troll}/2, Champion ${q.troll_champion}/1`;
  if (questId === 'crypt_ward' && q.status === 'active') return `Active — Skeletons ${q.skeleton}/2, Bone Guard ${q.bone_guard}/1, Relic ${q.relic_collected ? 'found' : 'missing'}`;
  if (questId === 'spider_brood' && q.status === 'active') return `Active — Spiders ${q.spider}/2, Broodmother ${q.broodmother}/1`;
  return ({ locked: 'Locked', available: 'Available', active: 'Active', turnin: 'Ready to turn in', done: 'Complete' })[q.status] || 'Unknown';
}

function nearbyText() { const npc = adjacentNpc(); if (npc) return `Nearby: ${npc.name} is ready to talk.`; const exit = currentMap().exits.find((entry) => samePos(entry.pos, state.player.pos)); if (exit) return `Traveling to ${MAP_DEFS[exit.targetMap].name}.`; return 'Nearby: explore, manage gear, and clear the next quest objective.'; }
function totalDefense() { return ['head', 'body', 'feet', 'offhand'].reduce((sum, slot) => { const itemId = state.player.equipment[slot]; return itemId ? sum + ARMOR[itemId].defense : sum; }, 0); }
function merchantStockText() { return MERCHANT_STOCK.map((offer) => `${merchantItemName(offer)} — ${offer.price}g${ownsOffer(offer) ? ' (owned)' : ''}`).join('\n'); }
function ownsOffer(offer) { if (offer.type === 'weapon') return state.player.weapons.includes(offer.id); if (offer.type === 'armor') return state.player.armorOwned.includes(offer.id); return false; }
function slotName(slot) { if (slot === 'charm') return state.player.equipment.charm ? CHARMS[state.player.equipment.charm].name : 'None'; const itemId = state.player.equipment[slot]; return itemId ? ARMOR[itemId].name : 'None'; }
function countItem(itemId) { return state.player.inventory[itemId] || 0; }
function message(text) { state.logLines.push(text); if (state.logLines.length > LOG_LIMIT) state.logLines.shift(); }
function say(speaker, text) { state.dialogue = { speaker, text }; message(`${speaker}: ${text}`); }
function clearDialogue() { if (state) state.dialogue = { speaker: 'Guide', text: 'Explore Ashenfall.' }; }
function enemyAt(pos, skipIndex = -1) { return currentEnemies().findIndex((enemy, index) => index !== skipIndex && samePos(enemy.pos, pos)); }
function npcAt(pos) { return currentMap().npcs.find((npc) => samePos(npc.pos, pos)); }
function adjacentNpc() { return Object.values(DIRECTIONS).map(([dx, dy]) => npcAt([state.player.pos[0] + dx, state.player.pos[1] + dy])).find(Boolean) || null; }
function inBounds(pos) { const layout = currentMap().layout; return pos[0] >= 0 && pos[1] >= 0 && pos[1] < layout.length && pos[0] < layout[0].length; }
function tileAt(pos) { if (!inBounds(pos)) return '#'; return currentMap().layout[pos[1]][pos[0]]; }
function tileTextureKey(tile) { if (tile === '#') return 'wall'; if (tile === ',') return 'grass'; if (tile === ':') return 'path'; if (tile === '<' || tile === '>') return 'stairs'; if (tile === '~') return 'water'; return 'floor'; }
function minimapTileColor(tile) { if (tile === '#') return '#4f3b2a'; if (tile === ',') return '#4b6e37'; if (tile === ':') return '#8a704c'; if (tile === '<' || tile === '>') return '#b0aba0'; if (tile === '~') return '#315b7f'; return '#695a47'; }
function isWalkable(pos) { const tile = tileAt(pos); return tile !== '#' && tile !== '~'; }
function iconKeyForItem(itemId) { if (WEAPONS[itemId]) return WEAPONS[itemId].icon; if (ARMOR[itemId]) return ARMOR[itemId].icon; if (CHARMS[itemId]) return CHARMS[itemId].icon; return ITEMS[itemId].icon; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function manhattan(a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); }
function samePos(a, b) { return a[0] === b[0] && a[1] === b[1]; }
function weaponScore(id) { return WEAPONS[id].minDamage + WEAPONS[id].maxDamage; }
function escapeHtml(text) { return String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
async function loadImages() { const entries = await Promise.all(Object.entries(TILE_ASSETS).map(([key, src]) => new Promise((resolve) => { const image = new Image(); image.onload = () => resolve([key, image]); image.onerror = () => resolve([key, null]); image.src = src; }))); return Object.fromEntries(entries); }
function registerServiceWorker() { if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {}); }

boot();
