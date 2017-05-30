/*const angular = require('@angular/common')*/

function display_error(str) {
	alert(str);
	console.error(str);
	return (false);
};

function check_values(room_size_x, room_size_y, init_pos_x, init_pos_y, direction, moves) {
	if (init_pos_x >= room_size_x || init_pos_y >= room_size_y)
		return (display_error("Vacuum have been placed out of the room"));
	if (moves.length > 20)
		return (display_error("Sequence limited to 20 movements"));
	if (moves == "")
		return (display_error("Empty sequence of movements"));
	for (var i = 0; i < moves.length; i++) {
		if (moves.charAt(i) != 'D' && moves.charAt(i) != 'G' && moves.charAt(i) != 'A')
			return (display_error("Wrong sequence of movements: only 'D', 'G' and 'A' are allowed"));
	};
	return (true);
};

/*
** If not behind a wall: change position
*/

function move_horizontally(room_size_x, pos_x, direction) {
	if (direction == 'E') {
		if (pos_x == room_size_x - 1) {
			console.error("Went on Est wall");
			return (pos_x);
		}
		return (pos_x + 1);
	} else if (direction == 'W') {
		if (pos_x == 0) {
			console.error("Went on West wall");
			return (pos_x);
		}
		return (pos_x - 1);
	}
};

function move_vertically(room_size_y, pos_y, direction) {
	if (direction == 'N') {
		if (pos_y == room_size_y - 1) {
			console.error("Went on North wall");
			return (pos_y);
		}
		return (pos_y + 1);
	} else if (direction == 'S') {
		if (pos_y == 0) {
			console.error("Went on South wall");
			return (pos_y);
		}
		return (pos_y - 1);
	}
};

/*
** Get direction, turn, return direction
*/
function turn(direction, side) {
	var dirs = ['N', 'E', 'S', 'W'];
	for (var i = 0; i < dirs.length; i++) {
		if (dirs[i] == direction)
			break ;
	};
	if (side == 'D') {
		i = 0 <= i && i < 3 ? i + 1 : 0;
	} else if (side == 'G') {
		i = 0 < i && i < 4 ? i - 1 : 3;
	}
	return (dirs[i]);
};

/*
** Create tile div. Add vacuum and direction arrow.
*/
function tile_div(x, y, pos_x, pos_y, direction) {
	tile = "<div id='tile' class='tile' style=\"width: 50px; height: 50px;\">";
	if (x == pos_x && y == pos_y) {
		tile += "<div id='vacuum' class='vacuum' style=\"width: 50px; height: 50px;\">";
		tile += "<div id='arrow-" + direction + "' class='arrow-" + direction + "'></div>";
		tile += "</div>";
	}
	tile += "</div>";
	return (tile);
};

/*
** Create map. Reverse ordinate.
*/
function display_room(room_size_x, room_size_y, pos_x, pos_y, direction) {
	console.log("x: " + pos_x + ", y:" + pos_y + ", dir: " + direction);
	room = "<div id='room' class='room' style=\"width: " + 50 * room_size_x + "px; height: " + 50 * room_size_y + "px;\">";
	for (var y = room_size_y - 1; y >= 0; y--) {
		for (var x = 0; x < room_size_x; x++)
			room += tile_div(x, y, pos_x, pos_y, direction);
		room += "<br />";
	};
	room += "</div>";
	document.getElementById("room").innerHTML = room;
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
** Apply movements sequence
*/
async function move(room_size_x, room_size_y, pos_x, pos_y, direction, moves) {
	display_room(room_size_x, room_size_y, pos_x, pos_y, direction);
	for (var i = 0; i < moves.length; i++) {
		if (moves.charAt(i) == 'D')
			direction = turn(direction, 'D');
		else if (moves.charAt(i) == 'G')
			direction = turn(direction, 'G');
		else if (moves.charAt(i) == 'A') {
			if (direction == 'W' || direction == 'E')
				pos_x = move_horizontally(room_size_x, pos_x, direction);
			if (direction == 'N' || direction == 'S')
				pos_y = move_vertically(room_size_y, pos_y, direction);
		await sleep(500);
		display_room(room_size_x, room_size_y, pos_x, pos_y, direction);
		};
	};
	display_error("Final position:\n- Direction: " + direction + "\n- Position: x: " + pos_x + ", y: " + pos_y);
};

/*
** Retrieve values, check values, run vacuum cleanning
*/
function clean() {
	var room_size_x = parseInt(document.getElementById("room_size_x").value);
	var room_size_y = parseInt(document.getElementById("room_size_y").value);
	var init_pos_x = parseInt(document.getElementById("init_pos_x").value);
	var init_pos_y = parseInt(document.getElementById("init_pos_y").value);
	var direction = document.getElementById("direction").value;
	var moves = document.getElementById("moves").value;
	if (check_values(room_size_x, room_size_y, init_pos_x, init_pos_y, direction, moves) == false)
		return;
	move(room_size_x, room_size_y, init_pos_x, init_pos_y, direction, moves)
};
