var header = document.querySelector("h2");
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var width = 200;
var height = 200;

canvas.width = width;
canvas.height = height;

var mouseX = 0;
var mouseY = 0;

var constant = math.complex(0.28, 0.01);

function update() {
  header.innerHTML = constant.toString();
  draw();
}

function pointToColor(point) {
  var red = point.re * 255;
  var green = point.im * 255;
  return `rgb(${red}, ${green}, 0)`;
}

function pixelToPoint(x, y) {
  // Map percentage of total width/height to a value from -1 to +1
  var zx = (x / width) * 2 - 1;
  var zy = (y / height) * 2 - 1;

  // Create a complex number based on our new XY Values
  return math.complex(zx, zy);
}

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function draw() {
  var color = pointToColor(constant);

  drawPixel(mouseX, mouseY, color);
}

function move(event) {
  mouseX = event.clientX - canvas.offsetLeft;
  mouseY = event.clientY - canvas.offsetTop;

  constant = pixelToPoint(mouseX, mouseY);

  constant.re = math.round(constant.re * 100) / 100;
  constant.im = math.round(constant.im * 100) / 100;

  update();
}

canvas.addEventListener("mousemove", move);
