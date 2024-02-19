/*

Create by BroodWar

style:
attackMode - should we attack?
rangeDistrance - how far we want to move around mod.
targetSettings - what type of mods are we looking for.
style
	off - no movement, stand your ground.
	round - circles mod.
	random - picks ramdon spots around mod.

*/

const settings = {
	attackMode: true,
	rangeDistance: 35,
	targetSettings: {
		min_xp: 100,
		max_att: 120,
	},
	style: "round",
};
var relativePostionToTarget;

var charMovement = function (position, target) {
	const { rangeDistance } = settings;
	if (relativePostionToTarget && relativePostionToTarget == position) {
		position = +1;
	}
	if (position >= 5) {
		position = 1;
	}

	switch (position) {
		case 0:
			move(
				character.x + (target.x - character.x) / 2,
				character.y + (target.y - character.y) / 2,
			);
			set_message("Top Left");
			break;
		case 1:
			move(
				character.x + (target.x - character.x) - rangeDistance,
				character.y + (target.y - character.y) - rangeDistance,
			);
			set_message("Top Left");
			break;
		case 2:
			move(
				character.x + (target.x - character.x) + rangeDistance,
				character.y + (target.y - character.y) - rangeDistance,
			);
			set_message("Top Right");
			break;
		case 3:
			move(
				character.x + (target.x - character.x) + rangeDistance,
				character.y + (target.y - character.y) + rangeDistance,
			);
			set_message("Bottom Right");
			break;
		case 4:
			move(
				character.x + (target.x - character.x) - rangeDistance,
				character.y + (target.y - character.y) + rangeDistance,
			);
			set_message("Bottom Left");
			break;
	}
	relativePostionToTarget = position;
};

var stickAndMove = function () {
	var target;
	const { attackMode, targetSettings, style } = settings;

	if (!attackMode || character.rip || is_moving(character)) {
		return;
	}
	target = get_targeted_monster();

	if (!target) {
		target = get_nearest_monster(targetSettings);
	}
	if (target) {
		change_target(target);
	} else {
		set_message("?");
		return;
	}
	if(!style){
		set_message("no style defined!");
	}

	if (style === "round") {
		relativePostionToTarget = typeof relativePostionToTarget !== "undefined" ? relativePostionToTarget : 0;
		charMovement(relativePostionToTarget + 1, target);
	} else if (style === "random") {
		var ranNumber = Math.floor(Math.random() * (12 - 1 + 1) + 1);

		if (ranNumber <= 3) {
			charMovement(1, target);
		} else if (ranNumber > 3 && ranNumber <= 6) {
			charMovement(2, target);
		} else if (ranNumber > 6 && ranNumber <= 9) {
			charMovement(3, target);
		} else {
			charMovement(4, target);
		}
	} else if (style === "off") {
		relativePostionToTarget = typeof relativePostionToTarget !== "undefined" ? relativePostionToTarget : 0;
		charMovement(relativePostionToTarget, target);
	}

	if (is_in_range(target) && can_attack(target)) {
		attack(target);
	}
};

// main run
setInterval(function () {
	use_hp_or_mp();
	loot();
	stickAndMove();
}, 1000 / 4); // Loops every 1/4 seconds.

