extends Node2D

const TILE_SIZE := 32
const SAVE_PATH := "user://savegame.json"

const TEXTURES := {
	"floor": preload("res://assets/tiles/floor.svg"),
	"wall": preload("res://assets/tiles/wall.svg"),
	"grass": preload("res://assets/tiles/grass.svg"),
	"path": preload("res://assets/tiles/path.svg"),
	"stairs": preload("res://assets/tiles/stairs.svg"),
	"water": preload("res://assets/tiles/water.svg"),
	"player": preload("res://assets/actors/player.svg"),
	"npc": preload("res://assets/actors/npc.svg"),
	"rat": preload("res://assets/actors/rat.svg"),
	"bat": preload("res://assets/actors/bat.svg"),
	"wolf": preload("res://assets/actors/wolf.svg"),
	"orc": preload("res://assets/actors/orc.svg"),
	"club": preload("res://assets/items/club.svg"),
	"knife": preload("res://assets/items/knife.svg"),
	"sword": preload("res://assets/items/sword.svg"),
	"tattered_tunic": preload("res://assets/items/tunic.svg"),
	"worn_boots": preload("res://assets/items/boots.svg"),
	"leather_vest": preload("res://assets/items/vest.svg"),
	"buckler": preload("res://assets/items/shield.svg"),
	"small_potion": preload("res://assets/items/potion.svg"),
	"stolen_banner": preload("res://assets/items/banner.svg")
}

const WEAPON_DATA := {
	"club": {"name": "Rough Club", "min_damage": 3, "max_damage": 5, "crit": 0.05, "icon": "club"},
	"knife": {"name": "Rusty Knife", "min_damage": 4, "max_damage": 6, "crit": 0.15, "icon": "knife"},
	"iron_sword": {"name": "Iron Sword", "min_damage": 6, "max_damage": 9, "crit": 0.12, "icon": "sword"}
}

const ARMOR_DATA := {
	"tattered_tunic": {"name": "Tattered Tunic", "defense": 1, "icon": "tattered_tunic"},
	"worn_boots": {"name": "Worn Boots", "defense": 1, "icon": "worn_boots"},
	"buckler": {"name": "Buckler", "defense": 2, "icon": "buckler"},
	"leather_vest": {"name": "Leather Vest", "defense": 3, "icon": "leather_vest"}
}

const ITEM_DATA := {
	"small_potion": {"name": "Small Potion", "heal": 10, "icon": "small_potion"},
	"rat_tail": {"name": "Rat Tail Trophy"},
	"bat_wing": {"name": "Bat Wing Trophy"},
	"wolf_pelt": {"name": "Wolf Pelt"},
	"dire_pelt": {"name": "Dire Wolf Pelt"},
	"orc_badge": {"name": "Orc Badge"},
	"stolen_banner": {"name": "Stolen Banner", "icon": "stolen_banner"}
}

const ENEMY_DATA := {
	"rat": {"name": "Cave Rat", "max_hp": 8, "attack": 2, "icon": "rat", "exp": 3, "gold": [2, 4], "drop": "rat_tail"},
	"bat": {"name": "Cave Bat", "max_hp": 6, "attack": 3, "icon": "bat", "exp": 4, "gold": [2, 4], "drop": "bat_wing"},
	"wolf": {"name": "Wolf", "max_hp": 12, "attack": 4, "icon": "wolf", "exp": 7, "gold": [5, 8], "drop": "wolf_pelt"},
	"dire_wolf": {"name": "Dire Wolf", "max_hp": 18, "attack": 6, "icon": "wolf", "exp": 11, "gold": [8, 12], "drop": "dire_pelt"},
	"orc": {"name": "Orc Raider", "max_hp": 16, "attack": 5, "icon": "orc", "exp": 10, "gold": [7, 12], "drop": "orc_badge"},
	"orc_chieftain": {"name": "Orc Chieftain", "max_hp": 28, "attack": 8, "icon": "orc", "exp": 20, "gold": [18, 26], "drop": "orc_badge"}
}

const MAP_DEFS := {
	"town": {
		"name": "Ashenfall",
		"story": "Town hub with quests, healing, and trading.",
		"layout": [
			"################",
			"#,,,,,::::,,,,,#",
			"#,,...:..:...,,#",
			"#,,..........,,#",
			"#,,....::....,,#",
			"#:............:#",
			"#:....,,,,....:#",
			"#,,....::....,,#",
			"#,,..........,,#",
			"#,,...:<....>,,#",
			"#,,,,,::::,,,,,#",
			"################"
		],
		"npcs": [
			{"id": "healer", "name": "Sister Hale", "pos": Vector2i(4, 3)},
			{"id": "captain", "name": "Captain Ivo", "pos": Vector2i(11, 3)},
			{"id": "hunter", "name": "Brann the Hunter", "pos": Vector2i(8, 5)},
			{"id": "elder", "name": "Elder Mara", "pos": Vector2i(4, 8)},
			{"id": "trader", "name": "Trader Sela", "pos": Vector2i(11, 8)}
		],
		"exits": [
			{"pos": Vector2i(7, 9), "target_map": "cellar", "target_pos": Vector2i(2, 10), "message": "You descend into the old cellar."},
			{"pos": Vector2i(12, 9), "target_map": "meadow", "target_pos": Vector2i(1, 5), "message": "You follow the road toward the meadow."}
		],
		"enemies": [],
		"items": []
	},
	"cellar": {
		"name": "Old Cellar",
		"story": "Starter dungeon full of vermin and scrap gear.",
		"layout": [
			"################",
			"#..............#",
			"#..##.....##...#",
			"#..............#",
			"#......##......#",
			"#..............#",
			"#..##......##..#",
			"#..............#",
			"#......##......#",
			"#..............#",
			"#.<.##......#..#",
			"################"
		],
		"npcs": [],
		"exits": [
			{"pos": Vector2i(2, 10), "target_map": "town", "target_pos": Vector2i(7, 8), "message": "You climb back into town."}
		],
		"enemies": [
			{"kind": "rat", "pos": Vector2i(6, 2)},
			{"kind": "rat", "pos": Vector2i(10, 3)},
			{"kind": "rat", "pos": Vector2i(12, 9)},
			{"kind": "bat", "pos": Vector2i(8, 7)},
			{"kind": "bat", "pos": Vector2i(13, 5)}
		],
		"items": [
			{"id": "knife", "pos": Vector2i(4, 5)},
			{"id": "worn_boots", "pos": Vector2i(11, 7)},
			{"id": "small_potion", "pos": Vector2i(5, 9)}
		]
	},
	"meadow": {
		"name": "Briar Meadow",
		"story": "Open field where wolves prowl the road.",
		"layout": [
			"################",
			"#,,,,,,,,,,,,,,#",
			"#,,~~~,,...>.,,#",
			"#,,~~~~,......,#",
			"#,:::::,,..,,.,#",
			"#<:....,,,,...:#",
			"#,:....,,,,...:#",
			"#,:..,,....,..:#",
			"#,:..,,....,..:#",
			"#,:::::...,,..,#",
			"#,,,,,,,,,,,,,,#",
			"################"
		],
		"npcs": [],
		"exits": [
			{"pos": Vector2i(1, 5), "target_map": "town", "target_pos": Vector2i(11, 9), "message": "You head back through the town road."},
			{"pos": Vector2i(11, 2), "target_map": "orc_den", "target_pos": Vector2i(2, 10), "message": "You enter the cracked cave mouth."}
		],
		"enemies": [
			{"kind": "wolf", "pos": Vector2i(5, 5)},
			{"kind": "wolf", "pos": Vector2i(9, 7)},
			{"kind": "dire_wolf", "pos": Vector2i(12, 4)}
		],
		"items": [
			{"id": "small_potion", "pos": Vector2i(4, 8)},
			{"id": "buckler", "pos": Vector2i(10, 8)}
		]
	},
	"orc_den": {
		"name": "Orc Den",
		"story": "Final cave push ending with an orc boss encounter.",
		"layout": [
			"################",
			"#..............#",
			"#..##...##.....#",
			"#...........#..#",
			"#.####..........#",
			"#......##.......#",
			"#...........##..#",
			"#..##...........#",
			"#......####.....#",
			"#...............#",
			"#.<.....##......#",
			"################"
		],
		"npcs": [],
		"exits": [
			{"pos": Vector2i(2, 10), "target_map": "meadow", "target_pos": Vector2i(10, 2), "message": "You backtrack into the meadow air."}
		],
		"enemies": [
			{"kind": "orc", "pos": Vector2i(7, 3)},
			{"kind": "orc", "pos": Vector2i(11, 6)},
			{"kind": "orc_chieftain", "pos": Vector2i(12, 8)}
		],
		"items": [
			{"id": "small_potion", "pos": Vector2i(5, 8)}
		]
	}
}

var player := {}
var quests := {}
var world_state := {}
var current_map_id := "town"
var log_lines := []
var touch_start := Vector2.ZERO
var tracking_touch := false

var hud_layer: CanvasLayer
var zone_label: Label
var objective_label: Label
var nearby_label: Label
var stats_label: Label
var inventory_label: Label
var log_label: Label
var interact_button: Button
var weapon_button: Button
var potion_button: Button
var save_button: Button
var load_button: Button
var restart_button: Button

func _ready() -> void:
	randomize()
	_setup_ui()
	_start_new_game()

func _setup_ui() -> void:
	hud_layer = CanvasLayer.new()
	add_child(hud_layer)

	var panel := PanelContainer.new()
	panel.position = Vector2(16, 404)
	panel.size = Vector2(688, 860)
	hud_layer.add_child(panel)

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 16)
	margin.add_theme_constant_override("margin_top", 16)
	margin.add_theme_constant_override("margin_right", 16)
	margin.add_theme_constant_override("margin_bottom", 16)
	panel.add_child(margin)

	var layout := VBoxContainer.new()
	layout.add_theme_constant_override("separation", 10)
	margin.add_child(layout)

	var title := Label.new()
	title.text = "Ashenfall Offline RPG"
	layout.add_child(title)

	zone_label = Label.new()
	zone_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layout.add_child(zone_label)

	objective_label = Label.new()
	objective_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layout.add_child(objective_label)

	nearby_label = Label.new()
	nearby_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layout.add_child(nearby_label)

	stats_label = Label.new()
	stats_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layout.add_child(stats_label)

	inventory_label = Label.new()
	inventory_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layout.add_child(inventory_label)

	var actions := HBoxContainer.new()
	actions.add_theme_constant_override("separation", 8)
	layout.add_child(actions)

	interact_button = Button.new()
	interact_button.text = "Interact"
	interact_button.pressed.connect(_on_interact_pressed)
	actions.add_child(interact_button)

	weapon_button = Button.new()
	weapon_button.text = "Swap Weapon"
	weapon_button.pressed.connect(_on_swap_weapon_pressed)
	actions.add_child(weapon_button)

	potion_button = Button.new()
	potion_button.text = "Use Potion"
	potion_button.pressed.connect(_on_use_potion_pressed)
	actions.add_child(potion_button)

	var system_actions := HBoxContainer.new()
	system_actions.add_theme_constant_override("separation", 8)
	layout.add_child(system_actions)

	save_button = Button.new()
	save_button.text = "Save"
	save_button.pressed.connect(_on_save_pressed)
	system_actions.add_child(save_button)

	load_button = Button.new()
	load_button.text = "Load"
	load_button.pressed.connect(_on_load_pressed)
	system_actions.add_child(load_button)

	restart_button = Button.new()
	restart_button.text = "New Run"
	restart_button.pressed.connect(_on_restart_pressed)
	system_actions.add_child(restart_button)

	var controls_grid := GridContainer.new()
	controls_grid.columns = 3
	controls_grid.add_theme_constant_override("h_separation", 8)
	controls_grid.add_theme_constant_override("v_separation", 8)
	layout.add_child(controls_grid)

	controls_grid.add_child(Control.new())
	controls_grid.add_child(_make_control_button("↑", Vector2(100, 42), "_on_move_up_pressed"))
	controls_grid.add_child(Control.new())
	controls_grid.add_child(_make_control_button("←", Vector2(100, 42), "_on_move_left_pressed"))
	controls_grid.add_child(_make_control_button("↓", Vector2(100, 42), "_on_move_down_pressed"))
	controls_grid.add_child(_make_control_button("→", Vector2(100, 42), "_on_move_right_pressed"))

	var controls_label := Label.new()
	controls_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	controls_label.text = "Move with swipe, keyboard, or buttons. Step into enemies to attack. Stand next to townsfolk and press Interact."
	layout.add_child(controls_label)

	var log_title := Label.new()
	log_title.text = "Field Notes"
	layout.add_child(log_title)

	log_label = Label.new()
	log_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	log_label.custom_minimum_size = Vector2(0, 230)
	layout.add_child(log_label)

func _make_control_button(label_text: String, minimum_size: Vector2, callback: String) -> Button:
	var button := Button.new()
	button.text = label_text
	button.custom_minimum_size = minimum_size
	button.pressed.connect(Callable(self, callback))
	return button

func _start_new_game() -> void:
	player = {
		"pos": Vector2i(7, 8),
		"hp": 28,
		"max_hp": 28,
		"level": 1,
		"exp": 0,
		"next_exp": 12,
		"gold": 10,
		"weapon": "club",
		"weapons": ["club"],
		"armor": ["tattered_tunic", "worn_boots"],
		"potions": 1,
		"inventory": {
			"rat_tail": 0,
			"bat_wing": 0,
			"wolf_pelt": 0,
			"dire_pelt": 0,
			"orc_badge": 0,
			"stolen_banner": 0
		}
	}
	quests = {
		"cellar_sweep": {"status": "available", "rat": 0, "bat": 0},
		"wolf_hunt": {"status": "locked", "wolf": 0, "dire_wolf": 0},
		"orc_threat": {"status": "locked", "chieftain_defeated": false, "banner_collected": false}
	}
	world_state = {}
	for map_id in MAP_DEFS.keys():
		world_state[map_id] = {
			"enemies": _build_enemies_for(map_id),
			"items": _build_items_for(map_id)
		}
	current_map_id = "town"
	log_lines = []
	_message("Ashenfall is yours to build out: town, road, cellar, and orc den are all playable now.")
	_message("Start beside Elder Mara for the opening rat-and-bat contract.")
	_refresh_view()

func _build_enemies_for(map_id: String) -> Array:
	var enemies := []
	for template in MAP_DEFS[map_id]["enemies"]:
		var enemy_data = ENEMY_DATA[template["kind"]]
		enemies.append({
			"kind": template["kind"],
			"name": enemy_data["name"],
			"pos": template["pos"],
			"hp": enemy_data["max_hp"],
			"max_hp": enemy_data["max_hp"],
			"attack": enemy_data["attack"],
			"icon": enemy_data["icon"],
			"exp": enemy_data["exp"],
			"gold": enemy_data["gold"],
			"drop": enemy_data["drop"]
		})
	return enemies

func _build_items_for(map_id: String) -> Array:
	var items := []
	for template in MAP_DEFS[map_id]["items"]:
		items.append(template.duplicate(true))
	return items

func _draw() -> void:
	var layout = _current_map()["layout"]
	for y in range(layout.size()):
		for x in range(layout[y].length()):
			var tile_pos := Vector2(x * TILE_SIZE, y * TILE_SIZE)
			var key := _tile_texture_key(_tile_at(Vector2i(x, y)))
			draw_texture_rect(TEXTURES[key], Rect2(tile_pos, Vector2(TILE_SIZE, TILE_SIZE)), false)
			draw_rect(Rect2(tile_pos, Vector2(TILE_SIZE, TILE_SIZE)), Color(0, 0, 0, 0.16), false, 1.0)

	for item in _current_items():
		var item_pos := Vector2(item["pos"].x * TILE_SIZE + 8, item["pos"].y * TILE_SIZE + 8)
		var icon_key := item["id"]
		if WEAPON_DATA.has(icon_key):
			icon_key = WEAPON_DATA[icon_key]["icon"]
		elif ARMOR_DATA.has(icon_key):
			icon_key = ARMOR_DATA[icon_key]["icon"]
		else:
			icon_key = ITEM_DATA[icon_key]["icon"]
		draw_texture_rect(TEXTURES[icon_key], Rect2(item_pos, Vector2(16, 16)), false)

	for npc in _current_map()["npcs"]:
		_draw_sprite(npc["pos"], TEXTURES["npc"])

	for enemy in _current_enemies():
		_draw_actor(enemy["pos"], TEXTURES[enemy["icon"]], enemy["hp"], enemy["max_hp"])

	_draw_actor(player["pos"], TEXTURES["player"], player["hp"], player["max_hp"])

func _draw_sprite(grid_pos: Vector2i, texture: Texture2D) -> void:
	var top_left := Vector2(grid_pos.x * TILE_SIZE, grid_pos.y * TILE_SIZE)
	draw_texture_rect(texture, Rect2(top_left, Vector2(TILE_SIZE, TILE_SIZE)), false)

func _draw_actor(grid_pos: Vector2i, texture: Texture2D, hp: int, max_hp: int) -> void:
	var top_left := Vector2(grid_pos.x * TILE_SIZE, grid_pos.y * TILE_SIZE)
	draw_texture_rect(texture, Rect2(top_left, Vector2(TILE_SIZE, TILE_SIZE)), false)
	var hp_ratio := float(hp) / float(max_hp)
	draw_rect(Rect2(top_left + Vector2(4, 2), Vector2(24, 4)), Color(0.25, 0.1, 0.1), true)
	draw_rect(Rect2(top_left + Vector2(4, 2), Vector2(24 * hp_ratio, 4)), Color(0.3, 0.85, 0.45), true)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_UP, KEY_W:
				_player_turn(Vector2i.UP)
			KEY_DOWN, KEY_S:
				_player_turn(Vector2i.DOWN)
			KEY_LEFT, KEY_A:
				_player_turn(Vector2i.LEFT)
			KEY_RIGHT, KEY_D:
				_player_turn(Vector2i.RIGHT)
			KEY_Q:
				_swap_weapon()
			KEY_E:
				_use_potion()
			KEY_F:
				_try_interact()
			KEY_F5:
				_save_game()
			KEY_F9:
				_load_game()
	elif event is InputEventScreenTouch:
		if event.pressed:
			tracking_touch = true
			touch_start = event.position
		elif tracking_touch:
			_handle_swipe(event.position - touch_start)
			tracking_touch = false
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			tracking_touch = true
			touch_start = event.position
		elif tracking_touch:
			_handle_swipe(event.position - touch_start)
			tracking_touch = false

func _handle_swipe(delta: Vector2) -> void:
	if delta.length() < 24:
		return
	if abs(delta.x) > abs(delta.y):
		_player_turn(Vector2i.RIGHT if delta.x > 0 else Vector2i.LEFT)
	else:
		_player_turn(Vector2i.DOWN if delta.y > 0 else Vector2i.UP)

func _player_turn(direction: Vector2i) -> void:
	var target := player["pos"] + direction
	if not _in_bounds(target):
		return
	var npc = _npc_at(target)
	if not npc.is_empty():
		_interact_with_npc(npc)
		return
	var enemy_index := _enemy_at(target)
	if enemy_index != -1:
		_attack_enemy(enemy_index)
		_enemy_turn()
		_refresh_view()
		return
	if not _is_walkable(target):
		_message("That path is blocked.")
		_refresh_view()
		return
	player["pos"] = target
	_collect_ground_item(target)
	_check_exit(target)
	_enemy_turn()
	_refresh_view()

func _attack_enemy(index: int) -> void:
	var enemy := _current_enemies()[index]
	var weapon = WEAPON_DATA[player["weapon"]]
	var level_bonus := int(player["level"]) - 1
	var damage := randi_range(weapon["min_damage"], weapon["max_damage"]) + max(0, level_bonus / 2)
	var crit := randf() < weapon["crit"]
	if crit:
		damage += 2
	enemy["hp"] -= damage
	_message("You hit %s with %s for %d damage%s." % [enemy["name"], weapon["name"], damage, " (crit)" if crit else ""])
	if enemy["hp"] <= 0:
		var gold_reward := randi_range(enemy["gold"][0], enemy["gold"][1])
		player["gold"] += gold_reward
		_message("%s drops %d gold." % [enemy["name"], gold_reward])
		_add_inventory_item(enemy["drop"])
		_gain_experience(enemy["exp"])
		var defeated_kind: String = enemy["kind"]
		var defeated_pos: Vector2i = enemy["pos"]
		_current_enemies().remove_at(index)
		_record_enemy_defeat(defeated_kind, defeated_pos)
	else:
		_current_enemies()[index] = enemy

func _enemy_turn() -> void:
	for index in range(_current_enemies().size()):
		var enemy := _current_enemies()[index]
		var distance := _manhattan(enemy["pos"], player["pos"])
		if distance == 1:
			var damage := max(1, enemy["attack"] - _total_defense())
			player["hp"] -= damage
			_message("%s hits you for %d damage." % [enemy["name"], damage])
			if player["hp"] <= 0:
				_handle_defeat()
				return
		elif distance <= 6:
			var next_step := _best_step_toward(enemy["pos"], player["pos"], index)
			if next_step != enemy["pos"]:
				enemy["pos"] = next_step
				_current_enemies()[index] = enemy

func _best_step_toward(start: Vector2i, goal: Vector2i, skip_index: int) -> Vector2i:
	var x_step := _signi(goal.x - start.x)
	var y_step := _signi(goal.y - start.y)
	var candidates := []
	if abs(goal.x - start.x) >= abs(goal.y - start.y):
		if x_step != 0:
			candidates.append(start + Vector2i(x_step, 0))
		if y_step != 0:
			candidates.append(start + Vector2i(0, y_step))
	else:
		if y_step != 0:
			candidates.append(start + Vector2i(0, y_step))
		if x_step != 0:
			candidates.append(start + Vector2i(x_step, 0))
	for fallback in [Vector2i.LEFT, Vector2i.RIGHT, Vector2i.UP, Vector2i.DOWN]:
		candidates.append(start + fallback)
	for candidate in candidates:
		if candidate == player["pos"]:
			continue
		if not _is_walkable(candidate):
			continue
		if not _npc_at(candidate).is_empty():
			continue
		if _enemy_at(candidate, skip_index) != -1:
			continue
		return candidate
	return start

func _handle_defeat() -> void:
	var gold_loss := min(player["gold"], max(5, int(player["gold"]) / 4))
	player["gold"] -= gold_loss
	player["hp"] = player["max_hp"]
	current_map_id = "town"
	player["pos"] = Vector2i(7, 8)
	_message("You collapse, lose %d gold, and wake back in Ashenfall." % gold_loss)
	_message("Sister Hale patches you up enough for another run.")

func _collect_ground_item(pos: Vector2i) -> void:
	for index in range(_current_items().size() - 1, -1, -1):
		var item = _current_items()[index]
		if item["pos"] != pos:
			continue
		_current_items().remove_at(index)
		_collect_item_by_id(item["id"])

func _collect_item_by_id(item_id: String) -> void:
	if WEAPON_DATA.has(item_id):
		if not player["weapons"].has(item_id):
			player["weapons"].append(item_id)
			_message("You claim %s." % WEAPON_DATA[item_id]["name"])
		if _weapon_score(item_id) > _weapon_score(player["weapon"]):
			player["weapon"] = item_id
			_message("You equip %s." % WEAPON_DATA[item_id]["name"])
	elif ARMOR_DATA.has(item_id):
		if not player["armor"].has(item_id):
			player["armor"].append(item_id)
			_message("You equip %s." % ARMOR_DATA[item_id]["name"])
	elif item_id == "small_potion":
		player["potions"] += 1
		_message("You stash a Small Potion.")
	else:
		_add_inventory_item(item_id)
		if item_id == "stolen_banner":
			quests["orc_threat"]["banner_collected"] = true
			_message("You recovered the Stolen Banner.")
			_update_orc_quest_state()

func _add_inventory_item(item_id: String) -> void:
	if not player["inventory"].has(item_id):
		player["inventory"][item_id] = 0
	player["inventory"][item_id] += 1
	_message("Looted %s." % ITEM_DATA[item_id]["name"])

func _record_enemy_defeat(kind: String, pos: Vector2i) -> void:
	if quests["cellar_sweep"]["status"] == "active":
		if kind == "rat":
			quests["cellar_sweep"]["rat"] += 1
		elif kind == "bat":
			quests["cellar_sweep"]["bat"] += 1
		if quests["cellar_sweep"]["rat"] >= 3 and quests["cellar_sweep"]["bat"] >= 2:
			quests["cellar_sweep"]["status"] = "turnin"
			_message("Cellar Sweep is complete. Return to Elder Mara.")

	if quests["wolf_hunt"]["status"] == "active":
		if kind == "wolf":
			quests["wolf_hunt"]["wolf"] += 1
		elif kind == "dire_wolf":
			quests["wolf_hunt"]["dire_wolf"] += 1
		if quests["wolf_hunt"]["wolf"] >= 2 and quests["wolf_hunt"]["dire_wolf"] >= 1:
			quests["wolf_hunt"]["status"] = "turnin"
			_message("Wolf Hunt is complete. Brann is waiting for your report.")

	if quests["orc_threat"]["status"] == "active" and kind == "orc_chieftain":
		quests["orc_threat"]["chieftain_defeated"] = true
		_drop_item(pos, "stolen_banner")
		_message("The Orc Chieftain falls and drops the stolen banner.")
		_update_orc_quest_state()

func _update_orc_quest_state() -> void:
	if quests["orc_threat"]["status"] != "active":
		return
	if quests["orc_threat"]["chieftain_defeated"] and quests["orc_threat"]["banner_collected"]:
		quests["orc_threat"]["status"] = "turnin"
		_message("Return the banner to Captain Ivo.")

func _drop_item(pos: Vector2i, item_id: String) -> void:
	_current_items().append({"id": item_id, "pos": pos})

func _gain_experience(amount: int) -> void:
	player["exp"] += amount
	while player["exp"] >= player["next_exp"]:
		player["exp"] -= player["next_exp"]
		player["level"] += 1
		player["next_exp"] += 6
		player["max_hp"] += 5
		player["hp"] = player["max_hp"]
		_message("Level up! You are now level %d." % player["level"])

func _swap_weapon() -> void:
	if player["weapons"].size() <= 1:
		_message("You have no alternate weapon yet.")
		_refresh_view()
		return
	var current_index := player["weapons"].find(player["weapon"])
	current_index = (current_index + 1) % player["weapons"].size()
	player["weapon"] = player["weapons"][current_index]
	_message("Equipped %s." % WEAPON_DATA[player["weapon"]]["name"])
	_refresh_view()

func _use_potion() -> void:
	if player["potions"] <= 0:
		_message("No potion available.")
		_refresh_view()
		return
	if player["hp"] >= player["max_hp"]:
		_message("You are already at full health.")
		_refresh_view()
		return
	player["potions"] -= 1
	player["hp"] = min(player["max_hp"], player["hp"] + ITEM_DATA["small_potion"]["heal"])
	_message("You drink a Small Potion.")
	_enemy_turn()
	_refresh_view()

func _try_interact() -> void:
	var npc := _adjacent_npc()
	if npc.is_empty():
		_message("No one is close enough to talk to.")
	else:
		_interact_with_npc(npc)
	_refresh_view()

func _interact_with_npc(npc: Dictionary) -> void:
	match npc["id"]:
		"elder":
			_interact_elder()
		"hunter":
			_interact_hunter()
		"captain":
			_interact_captain()
		"trader":
			_interact_trader()
		"healer":
			_interact_healer()
	_refresh_view()

func _interact_elder() -> void:
	match quests["cellar_sweep"]["status"]:
		"available":
			quests["cellar_sweep"]["status"] = "active"
			_message("Elder Mara: Clear the cellar. Bring me proof the rats and bats are gone.")
		"active":
			_message("Elder Mara: The cellar needs 3 rats and 2 bats cleared.")
		"turnin":
			quests["cellar_sweep"]["status"] = "done"
			quests["wolf_hunt"]["status"] = "available"
			player["gold"] += 12
			player["potions"] += 1
			_message("Elder Mara pays 12 gold and a potion for the cellar job.")
		_:
			_message("Elder Mara: Brann and the captain can use a capable blade.")

func _interact_hunter() -> void:
	match quests["wolf_hunt"]["status"]:
		"locked":
			_message("Brann the Hunter: Help the elder first.")
		"available":
			quests["wolf_hunt"]["status"] = "active"
			_message("Brann: Thin the meadow pack. I need 2 wolves and the dire alpha gone.")
		"active":
			_message("Brann: The meadow still has wolves on the road.")
		"turnin":
			quests["wolf_hunt"]["status"] = "done"
			quests["orc_threat"]["status"] = "available"
			player["gold"] += 20
			player["potions"] += 1
			if not player["armor"].has("leather_vest"):
				player["armor"].append("leather_vest")
			_message("Brann hands over a Leather Vest, 20 gold, and a potion.")
		_:
			_message("Brann: The cave beyond the meadow is where the real trouble starts.")

func _interact_captain() -> void:
	match quests["orc_threat"]["status"]:
		"locked":
			_message("Captain Ivo: Earn Brann's trust first.")
		"available":
			quests["orc_threat"]["status"] = "active"
			_message("Captain Ivo: Enter the orc den, kill the chieftain, and recover our banner.")
		"active":
			if quests["orc_threat"]["chieftain_defeated"]:
				_message("Captain Ivo: Find the banner before you return.")
			else:
				_message("Captain Ivo: The chieftain still lives.")
		"turnin":
			quests["orc_threat"]["status"] = "done"
			player["gold"] += 40
			if not player["weapons"].has("iron_sword"):
				player["weapons"].append("iron_sword")
			player["weapon"] = "iron_sword"
			_message("Captain Ivo rewards you with an Iron Sword and 40 gold. Ashenfall is safe.")
		_:
			_message("Captain Ivo: This is the full vertical slice. From here we scale content outward.")

func _interact_trader() -> void:
	if not player["armor"].has("buckler"):
		if player["gold"] >= 18:
			player["gold"] -= 18
			player["armor"].append("buckler")
			_message("Trader Sela sells you a Buckler for 18 gold.")
		else:
			_message("Trader Sela: Buckler is 18 gold.")
		return
	if not player["weapons"].has("knife"):
		if player["gold"] >= 12:
			player["gold"] -= 12
			player["weapons"].append("knife")
			_message("Trader Sela sells you a Rusty Knife for 12 gold.")
		else:
			_message("Trader Sela: Rusty Knife is 12 gold.")
		return
	if player["gold"] >= 8:
		player["gold"] -= 8
		player["potions"] += 1
		_message("Trader Sela sells you a Small Potion for 8 gold.")
	else:
		_message("Trader Sela: Come back with 8 gold for another potion.")

func _interact_healer() -> void:
	player["hp"] = player["max_hp"]
	_message("Sister Hale restores your health.")

func _check_exit(pos: Vector2i) -> void:
	for exit_data in _current_map()["exits"]:
		if exit_data["pos"] != pos:
			continue
		current_map_id = exit_data["target_map"]
		player["pos"] = exit_data["target_pos"]
		_message(exit_data["message"])
		return

func _save_game() -> void:
	var save_file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if save_file == null:
		_message("Save failed.")
		_refresh_view()
		return
	save_file.store_string(JSON.stringify(_serialize_game_state()))
	_message("Game saved to %s." % SAVE_PATH)
	_refresh_view()

func _load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		_message("No save file found yet.")
		_refresh_view()
		return
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	if parsed == null or not (parsed is Dictionary):
		_message("Save file is invalid.")
		_refresh_view()
		return
	_apply_loaded_state(parsed)
	_message("Save loaded.")
	_refresh_view()

func _serialize_game_state() -> Dictionary:
	return {
		"current_map_id": current_map_id,
		"player": {
			"pos": _serialize_vec(player["pos"]),
			"hp": player["hp"],
			"max_hp": player["max_hp"],
			"level": player["level"],
			"exp": player["exp"],
			"next_exp": player["next_exp"],
			"gold": player["gold"],
			"weapon": player["weapon"],
			"weapons": player["weapons"],
			"armor": player["armor"],
			"potions": player["potions"],
			"inventory": player["inventory"]
		},
		"quests": quests,
		"world_state": _serialize_world_state()
	}

func _serialize_world_state() -> Dictionary:
	var data := {}
	for map_id in world_state.keys():
		var enemy_data := []
		for enemy in world_state[map_id]["enemies"]:
			enemy_data.append({
				"kind": enemy["kind"],
				"name": enemy["name"],
				"pos": _serialize_vec(enemy["pos"]),
				"hp": enemy["hp"],
				"max_hp": enemy["max_hp"],
				"attack": enemy["attack"],
				"icon": enemy["icon"],
				"exp": enemy["exp"],
				"gold": enemy["gold"],
				"drop": enemy["drop"]
			})
		var item_data := []
		for item in world_state[map_id]["items"]:
			item_data.append({"id": item["id"], "pos": _serialize_vec(item["pos"])})
		data[map_id] = {"enemies": enemy_data, "items": item_data}
	return data

func _apply_loaded_state(data: Dictionary) -> void:
	current_map_id = data.get("current_map_id", "town")
	var loaded_player = data.get("player", {})
	player = {
		"pos": _deserialize_vec(loaded_player.get("pos", {"x": 7, "y": 8})),
		"hp": loaded_player.get("hp", 28),
		"max_hp": loaded_player.get("max_hp", 28),
		"level": loaded_player.get("level", 1),
		"exp": loaded_player.get("exp", 0),
		"next_exp": loaded_player.get("next_exp", 12),
		"gold": loaded_player.get("gold", 10),
		"weapon": loaded_player.get("weapon", "club"),
		"weapons": loaded_player.get("weapons", ["club"]),
		"armor": loaded_player.get("armor", ["tattered_tunic", "worn_boots"]),
		"potions": loaded_player.get("potions", 1),
		"inventory": loaded_player.get("inventory", {"rat_tail": 0, "bat_wing": 0, "wolf_pelt": 0, "dire_pelt": 0, "orc_badge": 0, "stolen_banner": 0})
	}
	quests = data.get("quests", quests)
	world_state = {}
	for map_id in MAP_DEFS.keys():
		world_state[map_id] = {"enemies": [], "items": []}
		var map_state = data.get("world_state", {}).get(map_id, {})
		for enemy in map_state.get("enemies", []):
			world_state[map_id]["enemies"].append({
				"kind": enemy["kind"],
				"name": enemy["name"],
				"pos": _deserialize_vec(enemy["pos"]),
				"hp": enemy["hp"],
				"max_hp": enemy["max_hp"],
				"attack": enemy["attack"],
				"icon": enemy["icon"],
				"exp": enemy["exp"],
				"gold": enemy["gold"],
				"drop": enemy["drop"]
			})
		for item in map_state.get("items", []):
			world_state[map_id]["items"].append({"id": item["id"], "pos": _deserialize_vec(item["pos"])})

func _serialize_vec(pos: Vector2i) -> Dictionary:
	return {"x": pos.x, "y": pos.y}

func _deserialize_vec(data: Dictionary) -> Vector2i:
	return Vector2i(int(data.get("x", 0)), int(data.get("y", 0)))

func _refresh_view() -> void:
	_update_ui()
	queue_redraw()

func _update_ui() -> void:
	zone_label.text = "%s — %s" % [_current_map()["name"], _current_map()["story"]]
	objective_label.text = _objective_text()
	nearby_label.text = _nearby_text()
	stats_label.text = "Lv %d  HP %d/%d  XP %d/%d  Gold %d\nWeapon: %s  Defense: %d" % [player["level"], player["hp"], player["max_hp"], player["exp"], player["next_exp"], player["gold"], WEAPON_DATA[player["weapon"]]["name"], _total_defense()]
	inventory_label.text = "Armor: %s\nWeapons: %s\nPotions: %d\nLoot: Rat tails %d, Bat wings %d, Wolf pelts %d, Dire pelts %d, Orc badges %d" % [
		", ".join(_armor_names()),
		", ".join(_weapon_names()),
		player["potions"],
		_inventory_count("rat_tail"),
		_inventory_count("bat_wing"),
		_inventory_count("wolf_pelt"),
		_inventory_count("dire_pelt"),
		_inventory_count("orc_badge")
	]
	var npc = _adjacent_npc()
	interact_button.disabled = npc.is_empty()
	if npc.is_empty():
		interact_button.text = "Interact"
	else:
		interact_button.text = "Talk: %s" % npc["name"]
	weapon_button.disabled = player["weapons"].size() <= 1
	potion_button.disabled = player["potions"] <= 0 or player["hp"] >= player["max_hp"]
	log_label.text = "\n".join(log_lines)

func _objective_text() -> String:
	if quests["cellar_sweep"]["status"] == "available":
		return "Objective: Talk to Elder Mara to start the cellar sweep."
	if quests["cellar_sweep"]["status"] == "active":
		return "Objective: Cellar Sweep — Rats %d/3, Bats %d/2." % [quests["cellar_sweep"]["rat"], quests["cellar_sweep"]["bat"]]
	if quests["cellar_sweep"]["status"] == "turnin":
		return "Objective: Return to Elder Mara for your cellar reward."
	if quests["wolf_hunt"]["status"] == "available":
		return "Objective: Talk to Brann the Hunter for the meadow contract."
	if quests["wolf_hunt"]["status"] == "active":
		return "Objective: Wolf Hunt — Wolves %d/2, Dire Wolves %d/1." % [quests["wolf_hunt"]["wolf"], quests["wolf_hunt"]["dire_wolf"]]
	if quests["wolf_hunt"]["status"] == "turnin":
		return "Objective: Report back to Brann for the wolf reward."
	if quests["orc_threat"]["status"] == "available":
		return "Objective: Talk to Captain Ivo to begin the orc finale."
	if quests["orc_threat"]["status"] == "active":
		var banner_text := "banner recovered" if quests["orc_threat"]["banner_collected"] else "banner still missing"
		var chief_text := "chieftain down" if quests["orc_threat"]["chieftain_defeated"] else "chieftain alive"
		return "Objective: Orc Threat — %s, %s." % [chief_text, banner_text]
	if quests["orc_threat"]["status"] == "turnin":
		return "Objective: Return the banner to Captain Ivo."
	return "Objective complete: you finished the current start-to-finish prototype loop."

func _nearby_text() -> String:
	var npc = _adjacent_npc()
	if not npc.is_empty():
		return "Nearby: %s is ready to talk." % npc["name"]
	for exit_data in _current_map()["exits"]:
		if exit_data["pos"] == player["pos"]:
			return "Traveling to %s." % MAP_DEFS[exit_data["target_map"]]["name"]
	return "Nearby: explore, gather upgrades, and clear the next quest objective."

func _weapon_names() -> Array:
	var names := []
	for weapon_id in player["weapons"]:
		names.append(WEAPON_DATA[weapon_id]["name"])
	return names

func _armor_names() -> Array:
	var names := []
	for armor_id in player["armor"]:
		names.append(ARMOR_DATA[armor_id]["name"])
	return names

func _inventory_count(item_id: String) -> int:
	if not player["inventory"].has(item_id):
		return 0
	return int(player["inventory"][item_id])

func _weapon_score(weapon_id: String) -> int:
	return WEAPON_DATA[weapon_id]["min_damage"] + WEAPON_DATA[weapon_id]["max_damage"]

func _total_defense() -> int:
	var total := 0
	for armor_id in player["armor"]:
		total += ARMOR_DATA[armor_id]["defense"]
	return total

func _message(text: String) -> void:
	log_lines.append(text)
	if log_lines.size() > 8:
		log_lines.pop_front()

func _enemy_at(pos: Vector2i, skip_index: int = -1) -> int:
	for index in range(_current_enemies().size()):
		if index == skip_index:
			continue
		if _current_enemies()[index]["pos"] == pos:
			return index
	return -1

func _npc_at(pos: Vector2i) -> Dictionary:
	for npc in _current_map()["npcs"]:
		if npc["pos"] == pos:
			return npc
	return {}

func _adjacent_npc() -> Dictionary:
	for direction in [Vector2i.UP, Vector2i.DOWN, Vector2i.LEFT, Vector2i.RIGHT]:
		var npc = _npc_at(player["pos"] + direction)
		if not npc.is_empty():
			return npc
	return {}

func _current_map() -> Dictionary:
	return MAP_DEFS[current_map_id]

func _current_enemies() -> Array:
	return world_state[current_map_id]["enemies"]

func _current_items() -> Array:
	return world_state[current_map_id]["items"]

func _in_bounds(pos: Vector2i) -> bool:
	var layout = _current_map()["layout"]
	return pos.x >= 0 and pos.y >= 0 and pos.y < layout.size() and pos.x < layout[0].length()

func _tile_at(pos: Vector2i) -> String:
	if not _in_bounds(pos):
		return "#"
	return _current_map()["layout"][pos.y].substr(pos.x, 1)

func _tile_texture_key(tile: String) -> String:
	match tile:
		"#":
			return "wall"
		",":
			return "grass"
		":":
			return "path"
		"<", ">":
			return "stairs"
		"~":
			return "water"
		_:
			return "floor"

func _is_walkable(pos: Vector2i) -> bool:
	var tile := _tile_at(pos)
	return tile != "#" and tile != "~"

func _manhattan(a: Vector2i, b: Vector2i) -> int:
	return abs(a.x - b.x) + abs(a.y - b.y)

func _signi(value: int) -> int:
	if value > 0:
		return 1
	if value < 0:
		return -1
	return 0

func _on_interact_pressed() -> void:
	_try_interact()

func _on_swap_weapon_pressed() -> void:
	_swap_weapon()

func _on_use_potion_pressed() -> void:
	_use_potion()

func _on_save_pressed() -> void:
	_save_game()

func _on_load_pressed() -> void:
	_load_game()

func _on_restart_pressed() -> void:
	_start_new_game()

func _on_move_up_pressed() -> void:
	_player_turn(Vector2i.UP)

func _on_move_down_pressed() -> void:
	_player_turn(Vector2i.DOWN)

func _on_move_left_pressed() -> void:
	_player_turn(Vector2i.LEFT)

func _on_move_right_pressed() -> void:
	_player_turn(Vector2i.RIGHT)
