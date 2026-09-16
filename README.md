# rpg-mobile-game-1st-try-bored

An **iPhone-friendly offline web RPG vertical slice** inspired by classic Tibia-style PvE.

## Why the web/PWA route

You said you want to **do and run this from your iPhone**, so the repo now includes a **no-build browser version** that works well in Safari and can be installed to the home screen.

That gives you:
- direct play on iPhone
- no native app packaging required to test
- offline play after the first load through the included service worker
- a repo that can be hosted on GitHub Pages or any static host

## Current game slice

The playable loop includes:
- **Ashenfall town** with healer, trader, and quest NPCs
- **Old Cellar** with bats, rats, starter gear, and potion pickup
- **Briar Meadow** with wolves and a dire wolf
- **Orc Den** with an orc chieftain finale
- grid-based movement and bump combat
- gear upgrades, gold, consumables, trophies, XP, levels, and defense
- quest progression from starter cellar contract to the orc finale
- touch-friendly controls for iPhone
- local save/load in the browser
- installable PWA support

## Project structure

- `/index.html` — browser entry point
- `/web/game.js` — game logic
- `/web/styles.css` — mobile UI styling
- `/manifest.webmanifest` — install metadata
- `/sw.js` — offline cache support
- `/assets/` — placeholder pixel-style art

The earlier Godot prototype files are still in the repo as a reference build, but the **web version is now the easiest way to run this from iPhone**.

## How to run on iPhone

### Best option: GitHub Pages

1. Enable **GitHub Pages** for this repository using the repository root.
2. Open the Pages URL in **Safari** on your iPhone.
3. Tap **Share → Add to Home Screen**.
4. Open it once while online so Safari caches the app.
5. After that, it should continue working offline.

### Other option

Serve the repository as a static site from any host that exposes:
- `/index.html`
- `/web/game.js`
- `/web/styles.css`

## Controls

- **Swipe** on the map to move
- or use the on-screen **direction buttons**
- walk into enemies to attack
- tap **Interact** to talk to nearby NPCs
- tap **Swap Weapon** to cycle weapons
- tap **Use Potion** to heal
- tap **Save** and **Load** to store progress on the device

## Quest flow

1. Talk to **Elder Mara**
2. Clear the cellar rats and bats
3. Turn in the quest
4. Take Brann's wolf contract
5. Clear the meadow
6. Take Captain Ivo's orc quest
7. Kill the chieftain, grab the banner, and return it
