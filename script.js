var header = document.querySelector("h2");
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var width = 100;
var height = width;

canvas.width = width;
canvas.height = height;

var mouseX = 0;
var mouseY = 0;

var constant = math.complex(0.28, 0.01);

var maxIterations = 64;

var clicked = false;
var pan = math.complex(0, 0);

function update() {
  header.innerHTML = constant.toString();
  draw();
}

function click(event) {
  if (!clicked) {
    clicked = true;
    return;
  }

  mouseX = event.clientX - canvas.offsetLeft;
  mouseY = event.clientY - canvas.offsetTop;

  pan = pixelToPoint(mouseX, mouseY).sub(constant);

  update();
}

function move(event) {
  if (clicked) {
    return;
  }

  mouseX = event.clientX - canvas.offsetLeft;
  mouseY = event.clientY - canvas.offsetTop;

  constant = pixelToPoint(mouseX, mouseY);

  constant.re = math.round(constant.re * 100) / 100;
  constant.im = math.round(constant.im * 100) / 100;

  update();
}

function julia(z, i = 0) {
  z = z.mul(z);
  z = z.add(constant);

  if (math.abs(z) > 2 || i == maxIterations) return i;
  else return julia(z, i + 1);
}

function pointToColor(point) {
  var iterations = julia(point);

  var percentage = iterations / maxIterations;

  var red = percentage * 255;
  var green = percentage * 255;
  var blue = percentage * 255;

  return `rgb(${red}, ${green}, ${blue})`;
}

function pixelToPoint(x, y) {
  // Map percentage of total width/height to a value from -1 to +1
  var zx = (x / width) * 2 - 1;
  var zy = (y / height) * 2 - 1;

  var z = math.complex(zx, zy);

  z = z.add(pan);

  // Create a complex number based on our new XY Values
  return z;
}

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function draw() {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var point = pixelToPoint(x, y);

      var color = pointToColor(point);

      drawPixel(x, y, color);
    }
  }
}

canvas.addEventListener("mousemove", move);
canvas.addEventListener("click", click);

update();
