extends Node2D

const TILE_SIZE := 32
const MAP_LAYOUT := [
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
	"#...##......#..#",
	"################"
]

const TEXTURES := {
	"floor": preload("res://assets/tiles/floor.svg"),
	"wall": preload("res://assets/tiles/wall.svg"),
	"player": preload("res://assets/actors/player.svg"),
	"rat": preload("res://assets/actors/rat.svg"),
	"bat": preload("res://assets/actors/bat.svg"),
	"club": preload("res://assets/items/club.svg"),
	"knife": preload("res://assets/items/knife.svg"),
	"tattered_tunic": preload("res://assets/items/tunic.svg"),
	"worn_boots": preload("res://assets/items/boots.svg"),
	"small_potion": preload("res://assets/items/potion.svg")
}

const WEAPON_DATA := {
	"club": {"name": "Rough Club", "min_damage": 3, "max_damage": 5, "crit": 0.05},
	"knife": {"name": "Rusty Knife", "min_damage": 2, "max_damage": 4, "crit": 0.25}
}

const ARMOR_DATA := {
	"tattered_tunic": {"name": "Tattered Tunic", "defense": 1},
	"worn_boots": {"name": "Worn Boots", "defense": 1}
}

const ITEM_DATA := {
	"small_potion": {"name": "Small Potion", "heal": 6},
	"rat_tail": {"name": "Rat Tail Trophy"},
	"bat_wing": {"name": "Bat Wing Trophy"}
}

const ENEMY_DATA := {
	"rat": {"name": "Cave Rat", "max_hp": 8, "attack": 2, "icon": "rat", "drop": "rat_tail"},
	"bat": {"name": "Cave Bat", "max_hp": 6, "attack": 3, "icon": "bat", "drop": "bat_wing"}
}

const QUEST_TARGETS := {"rat": 3, "bat": 2}

var player := {}
var enemies := []
var ground_items := []
var trophies := {}
var kill_counts := {"rat": 0, "bat": 0}
var log_lines := []
var quest_complete := false
var game_over := false
var touch_start := Vector2.ZERO
var tracking_touch := false

var hud_layer: CanvasLayer
var objective_label: Label
var stats_label: Label
var inventory_label: Label
var controls_label: Label
var log_label: Label
var weapon_button: Button
var potion_button: Button
var restart_button: Button

func _ready() -> void:
	randomize()
	_setup_ui()
	_reset_world()

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
	title.text = "Offline PvE Prototype"
	layout.add_child(title)

	objective_label = Label.new()
	objective_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layout.add_child(objective_label)

	stats_label = Label.new()
	stats_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layout.add_child(stats_label)

	inventory_label = Label.new()
	inventory_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layout.add_child(inventory_label)

	var actions := HBoxContainer.new()
	actions.add_theme_constant_override("separation", 8)
	layout.add_child(actions)

	weapon_button = Button.new()
	weapon_button.text = "Swap Weapon"
	weapon_button.pressed.connect(_on_swap_weapon_pressed)
	actions.add_child(weapon_button)

	potion_button = Button.new()
	potion_button.text = "Use Potion"
	potion_button.pressed.connect(_on_use_potion_pressed)
	actions.add_child(potion_button)

	restart_button = Button.new()
	restart_button.text = "Restart"
	restart_button.pressed.connect(_on_restart_pressed)
	actions.add_child(restart_button)

	controls_label = Label.new()
	controls_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	controls_label.text = "Controls: swipe on mobile or use arrow keys/WASD. Walk into enemies to attack."
	layout.add_child(controls_label)

	var log_title := Label.new()
	log_title.text = "Field Notes"
	layout.add_child(log_title)

	log_label = Label.new()
	log_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	log_label.custom_minimum_size = Vector2(0, 220)
	layout.add_child(log_label)

func _reset_world() -> void:
	player = {
		"pos": Vector2i(2, 2),
		"hp": 24,
		"max_hp": 24,
		"weapon": "club",
		"weapons": ["club"],
		"armor": ["tattered_tunic"],
		"potions": 0
	}
	enemies = [
		_make_enemy("rat", Vector2i(6, 2)),
		_make_enemy("rat", Vector2i(10, 3)),
		_make_enemy("rat", Vector2i(12, 9)),
		_make_enemy("bat", Vector2i(8, 7)),
		_make_enemy("bat", Vector2i(13, 5))
	]
	ground_items = [
		{"pos": Vector2i(4, 5), "id": "knife"},
		{"pos": Vector2i(11, 7), "id": "worn_boots"},
		{"pos": Vector2i(5, 9), "id": "small_potion"}
	]
	trophies = {"rat_tail": 0, "bat_wing": 0}
	kill_counts = {"rat": 0, "bat": 0}
	log_lines = []
	quest_complete = false
	game_over = false
	_message("Objective: clear the cellar of rats and bats.")
	_message("Start with a rough club. Find the rusty knife, boots, and potion while you survive.")
	_update_ui()
	queue_redraw()

func _make_enemy(kind: String, pos: Vector2i) -> Dictionary:
	var data = ENEMY_DATA[kind]
	return {
		"kind": kind,
		"name": data["name"],
		"pos": pos,
		"hp": data["max_hp"],
		"max_hp": data["max_hp"],
		"attack": data["attack"],
		"icon": data["icon"],
		"drop": data["drop"]
	}

func _draw() -> void:
	for y in range(MAP_LAYOUT.size()):
		for x in range(MAP_LAYOUT[y].length()):
			var tile_pos := Vector2(x * TILE_SIZE, y * TILE_SIZE)
			var tile_key := "wall" if _tile_at(Vector2i(x, y)) == "#" else "floor"
			draw_texture_rect(TEXTURES[tile_key], Rect2(tile_pos, Vector2(TILE_SIZE, TILE_SIZE)), false)
			draw_rect(Rect2(tile_pos, Vector2(TILE_SIZE, TILE_SIZE)), Color(0, 0, 0, 0.18), false, 1.0)

	for item in ground_items:
		var item_pos := Vector2(item["pos"].x * TILE_SIZE + 8, item["pos"].y * TILE_SIZE + 8)
		draw_texture_rect(TEXTURES[item["id"]], Rect2(item_pos, Vector2(16, 16)), false)

	for enemy in enemies:
		_draw_actor(enemy["pos"], TEXTURES[enemy["icon"]], enemy["hp"], enemy["max_hp"])

	_draw_actor(player["pos"], TEXTURES["player"], player["hp"], player["max_hp"])

	if quest_complete or game_over:
		var overlay_text := "Quest complete! Tap Restart to play again." if quest_complete else "You were defeated. Tap Restart to try again."
		draw_rect(Rect2(Vector2.ZERO, Vector2(16 * TILE_SIZE, 12 * TILE_SIZE)), Color(0, 0, 0, 0.6), true)
		draw_string(ThemeDB.fallback_font, Vector2(42, 200), overlay_text, HORIZONTAL_ALIGNMENT_LEFT, 430, 24, Color(1, 0.96, 0.78))

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
	if delta.length() < 20:
		return
	if abs(delta.x) > abs(delta.y):
		_player_turn(Vector2i.RIGHT if delta.x > 0 else Vector2i.LEFT)
	else:
		_player_turn(Vector2i.DOWN if delta.y > 0 else Vector2i.UP)

func _player_turn(direction: Vector2i) -> void:
	if quest_complete or game_over:
		return
	var target := player["pos"] + direction
	if not _in_bounds(target):
		return
	var enemy_index := _enemy_at(target)
	if enemy_index != -1:
		_attack_enemy(enemy_index)
		if not quest_complete and not game_over:
			_enemy_turn()
		_update_ui()
		queue_redraw()
		return
	if _tile_at(target) == "#":
		_message("The stone wall blocks your path.")
		_update_ui()
		return
	player["pos"] = target
	_collect_ground_item(target)
	if not quest_complete and not game_over:
		_enemy_turn()
	_update_ui()
	queue_redraw()

func _attack_enemy(index: int) -> void:
	var enemy := enemies[index]
	var weapon = WEAPON_DATA[player["weapon"]]
	var damage := randi_range(weapon["min_damage"], weapon["max_damage"])
	var crit := randf() < weapon["crit"]
	if crit:
		damage += 1
	enemy["hp"] -= damage
	_message("You strike the %s with your %s for %d damage%s." % [enemy["name"], weapon["name"], damage, " (crit)" if crit else ""])
	if enemy["hp"] <= 0:
		_message("The %s collapses." % enemy["name"])
		kill_counts[enemy["kind"]] += 1
		_add_trophy(enemy["drop"])
		enemies.remove_at(index)
		_check_quest_status()
	else:
		enemies[index] = enemy

func _enemy_turn() -> void:
	for index in range(enemies.size()):
		var enemy := enemies[index]
		var distance := _manhattan(enemy["pos"], player["pos"])
		if distance == 1:
			var damage := max(1, enemy["attack"] - _total_defense())
			player["hp"] -= damage
			_message("%s hits you for %d damage." % [enemy["name"], damage])
			if player["hp"] <= 0:
				player["hp"] = 0
				game_over = true
				_message("You were overwhelmed in the cellar.")
				break
		elif distance <= 6:
			var next_step := _best_step_toward(enemy["pos"], player["pos"], index)
			if next_step != enemy["pos"]:
				enemy["pos"] = next_step
				enemies[index] = enemy

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
		if _tile_at(candidate) == "#":
			continue
		if _enemy_at(candidate, skip_index) != -1:
			continue
		return candidate
	return start

func _collect_ground_item(pos: Vector2i) -> void:
	for index in range(ground_items.size() - 1, -1, -1):
		var item = ground_items[index]
		if item["pos"] != pos:
			continue
		var item_id: String = item["id"]
		ground_items.remove_at(index)
		if WEAPON_DATA.has(item_id):
			if not player["weapons"].has(item_id):
				player["weapons"].append(item_id)
			player["weapon"] = item_id
			_message("You found %s and equipped it immediately." % WEAPON_DATA[item_id]["name"])
		elif ARMOR_DATA.has(item_id):
			if not player["armor"].has(item_id):
				player["armor"].append(item_id)
			_message("You pull on %s. Defense improved." % ARMOR_DATA[item_id]["name"])
		elif item_id == "small_potion":
			player["potions"] += 1
			_message("You stash a Small Potion for later.")

func _add_trophy(item_id: String) -> void:
	if not trophies.has(item_id):
		trophies[item_id] = 0
	trophies[item_id] += 1
	_message("Looted %s." % ITEM_DATA[item_id]["name"])

func _check_quest_status() -> void:
	if kill_counts["rat"] >= QUEST_TARGETS["rat"] and kill_counts["bat"] >= QUEST_TARGETS["bat"] and enemies.is_empty():
		quest_complete = true
		_message("Quest complete. The cellar is safe for now.")

func _swap_weapon() -> void:
	if player["weapons"].size() <= 1:
		_message("You have no alternate weapon yet.")
		_update_ui()
		return
	var current_index := player["weapons"].find(player["weapon"])
	current_index = (current_index + 1) % player["weapons"].size()
	player["weapon"] = player["weapons"][current_index]
	_message("Equipped %s." % WEAPON_DATA[player["weapon"]]["name"])
	_update_ui()

func _use_potion() -> void:
	if player["potions"] <= 0:
		_message("No potion available.")
		_update_ui()
		return
	if player["hp"] >= player["max_hp"]:
		_message("You are already at full health.")
		_update_ui()
		return
	player["potions"] -= 1
	player["hp"] = min(player["max_hp"], player["hp"] + ITEM_DATA["small_potion"]["heal"])
	_message("You drink a Small Potion and steady yourself.")
	if not quest_complete and not game_over:
		_enemy_turn()
	_update_ui()
	queue_redraw()

func _total_defense() -> int:
	var total := 0
	for armor_id in player["armor"]:
		total += ARMOR_DATA[armor_id]["defense"]
	return total

func _update_ui() -> void:
	objective_label.text = "Targets — Rats %d/%d, Bats %d/%d" % [kill_counts["rat"], QUEST_TARGETS["rat"], kill_counts["bat"], QUEST_TARGETS["bat"]]
	var armor_names := []
	for armor_id in player["armor"]:
		armor_names.append(ARMOR_DATA[armor_id]["name"])
	stats_label.text = "HP %d/%d   Weapon: %s   Defense: %d\nEquipped armor: %s" % [player["hp"], player["max_hp"], WEAPON_DATA[player["weapon"]]["name"], _total_defense(), ", ".join(armor_names)]
	var trophy_text := "Rat tails %d, Bat wings %d" % [trophies["rat_tail"], trophies["bat_wing"]]
	inventory_label.text = "Weapons found: %s\nPotions: %d\nTrophies: %s" % [", ".join(_weapon_names()), player["potions"], trophy_text]
	weapon_button.disabled = player["weapons"].size() <= 1
	potion_button.disabled = player["potions"] <= 0 or player["hp"] >= player["max_hp"] or game_over
	log_label.text = "\n".join(log_lines)

func _weapon_names() -> Array:
	var names := []
	for weapon_id in player["weapons"]:
		names.append(WEAPON_DATA[weapon_id]["name"])
	return names

func _message(text: String) -> void:
	log_lines.append(text)
	if log_lines.size() > 7:
		log_lines.pop_front()

func _enemy_at(pos: Vector2i, skip_index: int = -1) -> int:
	for index in range(enemies.size()):
		if index == skip_index:
			continue
		if enemies[index]["pos"] == pos:
			return index
	return -1

func _in_bounds(pos: Vector2i) -> bool:
	return pos.x >= 0 and pos.y >= 0 and pos.y < MAP_LAYOUT.size() and pos.x < MAP_LAYOUT[0].length()

func _tile_at(pos: Vector2i) -> String:
	if not _in_bounds(pos):
		return "#"
	return MAP_LAYOUT[pos.y].substr(pos.x, 1)

func _manhattan(a: Vector2i, b: Vector2i) -> int:
	return abs(a.x - b.x) + abs(a.y - b.y)

func _signi(value: int) -> int:
	if value > 0:
		return 1
	if value < 0:
		return -1
	return 0

func _on_swap_weapon_pressed() -> void:
	_swap_weapon()

func _on_use_potion_pressed() -> void:
	_use_potion()

func _on_restart_pressed() -> void:
	_reset_world()
