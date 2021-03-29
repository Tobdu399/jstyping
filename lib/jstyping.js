let canvas;
let background_image;

let input;
let wordbox;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.id("canvas");

	background_image = loadImage("lib/images/background.jpg");

	createInputField();
	createWordBox();
}

function draw() {
	updateCanvas();
	updateInputField();
	updateWordBox();
}
