# rpg-mobile-game-1st-try-bored

An **offline, single-player, Tibia-inspired mobile RPG vertical slice** built in **Godot 4**.

## Why Godot

Godot is the best fit here because it gives this project:
- strong 2D support for a top-down RPG
- easy mobile export targets later
- a lightweight offline-first workflow
- fast iteration without license friction

## Current game slice

The repo now contains a complete start-to-finish prototype loop:
- **Ashenfall town hub** with quest NPCs, healer, and trader
- **Old Cellar** starter dungeon with rats, bats, rough gear, and potion pickup
- **Briar Meadow** wolf zone with a stronger dire wolf encounter
- **Orc Den** finale with an orc chieftain boss-style fight
- grid-based movement and collision
- turn-like bump combat
- gear upgrades including club, knife, buckler, leather vest, and iron sword
- gold, consumables, loot trophies, experience, leveling, and defense
- quest chain with rewards and progression unlocks
- save/load support using `user://savegame.json`
- mobile-friendly on-screen controls plus swipe and keyboard input

## Project structure

- `/project.godot` — Godot project configuration
- `/scenes/Main.tscn` — main scene entry point
- `/scripts/main.gd` — full prototype loop
- `/assets/actors` — placeholder actor art
- `/assets/items` — placeholder item art
- `/assets/tiles` — placeholder tile art

## How to run

1. Install **Godot 4.x**.
2. Open `/home/runner/work/rpg-mobile-game-1st-try-bored/rpg-mobile-game-1st-try-bored`.
3. Run the default scene.

## Controls

- **Swipe** on mobile to move one tile
- **Arrow keys / WASD** to move on desktop
- Walk into enemies to attack
- **F** or **Interact** to talk to nearby NPCs
- **Q** or **Swap Weapon** to cycle weapons
- **E** or **Use Potion** to heal
- **F5** or **Save** to save
- **F9** or **Load** to load
- **New Run** to reset the whole game state

## Prototype quest flow

1. Talk to **Elder Mara** in town
2. Clear the **cellar rats and bats**
3. Return for reward and unlock the **wolf hunt**
4. Clear **wolves and the dire wolf** in the meadow
5. Return for reward and unlock the **orc finale**
6. Defeat the **Orc Chieftain**, recover the banner, and turn it in

## Best next expansions

- split data, combat, map state, and UI into separate scripts/scenes
- add NPC dialog windows instead of log-only conversations
- add additional maps, classes, spells, ranged combat, and shops
- add save slots and persistent world progression
- begin planning optional co-op after the solo loop is stable
