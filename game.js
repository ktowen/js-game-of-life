"use strict";
var running = true;
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var ROWS = 150;
var COLS = 150;
var CELL_HEIGHT = canvas.height / ROWS;
var CELL_WIDTH = canvas.width / COLS;

var speed = 100;
var timeout = null;

var last_i = null;
var last_j = null;

var matrix = initialMatrix();

document.body.addEventListener("keydown", function(e) {
	switch (e.key) {
		case " ":
			e.preventDefault();
			if (running) {
				running = false;
			} else {
				running = true;
				run();
			}
			break;
		case "c":
			matrix = initialMatrix();
			draw();
			break;
		case "r":
			matrix = randomMatrix();
			draw();
			break;
		case "w":
			speed -= speed > 20 ? 10 : 0;
			clearTimeout(timeout);
			run();
			break;
		case "s":
			speed += speed < 1000 ? 10 : 0;
			clearTimeout(timeout);
			run();
			break;
	}
});

canvas.addEventListener("mousemove", function(e) {
	if (e.buttons == 1) {
		var x = e.clientX - e.srcElement.offsetLeft;
		var y = e.clientY - e.srcElement.offsetTop;
		var _i = Math.floor(x / CELL_WIDTH);
		var _j = Math.floor(y / CELL_HEIGHT);

		if (_i != last_i || _j != last_j) {
			matrix[_i][_j] = !matrix[_i][_j];
			last_i = _i;
			last_j = _j;
		}
		draw();
	}
});

canvas.addEventListener("mousedown", function(e) {
	var x = e.clientX - e.srcElement.offsetLeft;
	var y = e.clientY - e.srcElement.offsetTop;
	var _i = Math.floor(x / CELL_WIDTH);
	var _j = Math.floor(y / CELL_HEIGHT);

	matrix[_i][_j] = !matrix[_i][_j];
	last_i = _i;
	last_j = _j;
	draw();
});

function init() {
	matrix = randomMatrix();
	run();
}

function run() {
	if (running) {
		timeout = window.setTimeout(run, speed);
	}
	matrix = newGenerationMatrix(matrix);
	draw();
}

function initialMatrix() {
	var newMatrix = [];
	for (var i = 0; i < COLS + 2; i++) {
		newMatrix[i] = [];
		for (var j = 0; j < ROWS + 2; j++) {
			newMatrix[i][j] = false;
		}
	}
	return newMatrix;
}

function randomMatrix() {
	var newMatrix = initialMatrix();
	for (var i = 1; i < COLS + 1; i++) {
		for (var j = 1; j < ROWS + 1; j++) {
			newMatrix[i][j] = Math.floor(Math.random() * 2) ? true : false;
		}
	}
	return newMatrix;
}

function newGenerationMatrix(oldMatrix) {
	var newMatrix = initialMatrix();
	for (var i = 1; i < COLS + 1; i++) {
		for (var j = 1; j < ROWS + 1; j++) {
			var neighbors = neighborCount(i, j, oldMatrix);
			newMatrix[i][j] =
				(oldMatrix[i][j] && (neighbors == 2 || neighbors == 3)) ||
				(!oldMatrix[i][j] && neighbors == 3)
					? true
					: false;
		}
	}
	return newMatrix;
}

function neighborCount(x, y, matrix) {
	var neighbor = [
		[-1, -1],
		[0, -1],
		[1, -1],
		[-1, 0],
		[1, 0],
		[-1, 1],
		[0, 1],
		[1, 1]
	];
	return neighbor.reduce(function(acc, e) {
		return acc + (matrix[x + e[0]][y + e[1]] ? 1 : 0);
	}, 0);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 1; i < COLS + 1; i++) {
		for (var j = 1; j < ROWS + 1; j++) {
			if (matrix[i][j]) {
				ctx.fillRect(i * CELL_WIDTH, j * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
			}
		}
	}
}
