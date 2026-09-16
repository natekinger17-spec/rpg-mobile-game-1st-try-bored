const CACHE_NAME = 'ashenfall-rpg-v3';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './sw.js',
  './web/styles.css',
  './web/game.js',
  './icon.svg',
  './assets/tiles/floor.svg',
  './assets/tiles/wall.svg',
  './assets/tiles/grass.svg',
  './assets/tiles/path.svg',
  './assets/tiles/stairs.svg',
  './assets/tiles/water.svg',
  './assets/actors/player.svg',
  './assets/actors/npc.svg',
  './assets/actors/rat.svg',
  './assets/actors/bat.svg',
  './assets/actors/wolf.svg',
  './assets/actors/orc.svg',
  './assets/actors/troll.svg',
  './assets/actors/skeleton.svg',
  './assets/items/club.svg',
  './assets/items/knife.svg',
  './assets/items/sword.svg',
  './assets/items/mace.svg',
  './assets/items/tunic.svg',
  './assets/items/boots.svg',
  './assets/items/vest.svg',
  './assets/items/shield.svg',
  './assets/items/chainmail.svg',
  './assets/items/potion.svg',
  './assets/items/mana_potion.svg',
  './assets/items/banner.svg',
  './assets/items/amulet.svg'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
