# rpg-mobile-game-1st-try-bored

A first playable **offline, single-player, Tibia-inspired mobile RPG prototype** built in **Godot 4**.

## Why Godot

Godot is the best fit for this project right now because it gives us:
- strong 2D support for a top-down game
- straightforward mobile export for Android/iOS later
- a lightweight offline-first workflow
- fast iteration without paid licenses or engine lock-in

## Current prototype

This first slice focuses on the opening cellar-style zone and the low-level gear/monster fantasy you described:
- grid-based movement and combat
- swipe controls for mobile plus keyboard controls for desktop testing
- solo PvE combat against **rats** and **bats**
- starter gear progression with a **rough club**, **rusty knife**, **tattered tunic**, and **worn boots**
- simple loot trophies from kills
- a small potion pickup
- a basic quest goal: clear the zone

## Project structure

- `/project.godot` — Godot project configuration
- `/scenes/Main.tscn` — main scene
- `/scripts/main.gd` — prototype gameplay loop
- `/assets/` — simple original placeholder pixel-style SVG art

## How to run

1. Install **Godot 4.x**.
2. Open the project at `/home/runner/work/rpg-mobile-game-1st-try-bored/rpg-mobile-game-1st-try-bored`.
3. Run the default scene.

## Controls

- **Swipe** on mobile to move one tile
- **Arrow keys / WASD** on desktop to move
- Move into an enemy tile to attack
- **Q** or the **Swap Weapon** button to cycle weapons
- **E** or the **Use Potion** button to drink a potion
- **Restart** button to reset the prototype

## Recommended next steps

- add NPCs, shops, and town safe zones
- split combat/data/UI into separate systems
- add more monster families like wolves, trolls, and orcs
- build an overworld with stairs, caves, and quest givers
- add save/load and then optional co-op foundations later
