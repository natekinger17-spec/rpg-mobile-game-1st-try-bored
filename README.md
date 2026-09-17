# rpg-mobile-game-1st-try-bored

An **iPhone-friendly offline web RPG vertical slice** inspired by classic Tibia-style PvE.

## Why the web/PWA route

You wanted this to be something you can **run from your iPhone**, so the repository stays centered on a **Safari-friendly PWA build**.

That gives you:
- direct play on iPhone
- no native build tooling needed to test
- install-to-home-screen support
- offline play after the first load
- static hosting support on GitHub Pages

## Current game slice

The playable browser version now includes:
- retro-styled mobile UI inspired by older PC RPG layouts
- **Ashenfall town** with healer, trader, blacksmith, acolyte, hunter, and elder NPCs
- **Old Cellar**, **Briar Meadow**, **Orc Den**, **Troll Hollow**, **Sunken Crypt**, **Webbed Nest**, **Stone Watch**, **Ember Chapel**, and **Cinder Keep**
- bats, rats, wolves, dire wolves, orcs, trolls, skeletons, spiders, minotaurs, ash cultists, ember wyrms, and boss-style variants
- grid-based movement, melee combat, ranged bow combat, loot, gold, XP, leveling, defense, mana, and spells
- real equipment and inventory management panels with equip/use controls
- a shop window with buy buttons for merchant stock
- late-game frontier rewards including the **Soldier Blade**, **Kite Shield**, **Blessed Mail**, **Sun Lance**, and the **Dawn Sigil**
- local save/load in the browser
- offline PWA support through the service worker

## Project structure

- `/index.html` — browser entry point
- `/web/game.js` — game logic and content
- `/web/styles.css` — mobile UI styling
- `/manifest.webmanifest` — install metadata
- `/sw.js` — offline cache support
- `/assets/` — placeholder pixel-style art

The earlier Godot files remain in the repo as reference material, but the **web version is the primary runnable build**.

## How to run on iPhone

### Best option: GitHub Pages

1. Enable **GitHub Pages** for this repository from the repository root.
2. Open the Pages URL in **Safari** on your iPhone.
3. Tap **Share → Add to Home Screen**.
4. Open it once while online so Safari can cache it.
5. After that, it should keep working offline.

## Controls

- **Swipe** on the map to move
- or use the on-screen **direction buttons**
- walk into enemies to attack
- tap **Interact** to talk to nearby NPCs
- tap **Use Potion** or **Use Mana Potion** to recover resources
- tap **Cast Heal**, **Arcane Burst**, **Sun Lance**, or **Quick Shot** once unlocked
- use the equipment, inventory, and shop panels directly from the UI
- tap **Save** and **Load** to store progress on the device

## Current quest flow

1. Talk to **Elder Mara**
2. Clear the cellar rats and bats
3. Unlock the meadow wolf hunt with **Brann**
4. Defeat the orc chieftain and recover the banner for **Captain Ivo**
5. Clear **Troll Hollow** for **Forgehand Bram**
6. Talk to **Acolyte Nera** and cleanse the **Sunken Crypt**
7. Return to **Brann** to clear the **Webbed Nest** and claim ranged gear
8. Report to **Captain Ivo** and reclaim **Stone Watch** from the minotaurs
9. Return to **Acolyte Nera** and purge the **Ember Chapel** for your late-game magic reward
10. Answer **Elder Mara** and march through the dawn gate to finish **Cinder Keep**
