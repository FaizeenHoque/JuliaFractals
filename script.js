var header = document.querySelector("h2");
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var width = 1000;
var height = width;

canvas.width = width;
canvas.height = height;

var mouseX = 0;
var mouseY = 0;

var constant = math.complex(0.28, 0.01);

var maxIterations = 64;

var clicked = false;
var pan = math.complex(0, 0);

var zoom = 1;
var baseIterations = 64;

function update() {
  maxIterations = baseIterations + Math.floor(Math.log2(zoom) * 32);
  header.innerHTML = constant.toString() + " at " + zoom + "X";
  draw();
}

function click(event) {
  if (!clicked) {
    clicked = true;
    return;
  }

  mouseX = event.clientX - canvas.offsetLeft;
  mouseY = event.clientY - canvas.offsetTop;

  pan = pixelToPoint(mouseX, mouseY);

  zoom *= 2;

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

function julia(zx, zy) {
  var cx = constant.re;
  var cy = constant.im;

  for (var i = 0; i < maxIterations; i++) {
    var x2 = zx * zx;
    var y2 = zy * zy;

    if (x2 + y2 > 4) return i;

    zy = 2 * zx * zy + cy;
    zx = x2 - y2 + cx;
  }
  return maxIterations;
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
  var zx = (x / width) * 2 - 1;
  var zy = 1 - (y / height) * 2;

  var z = math.complex(zx, zy);

  z = z.div(zoom);

  z = z.add(pan);

  return z;
}

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function draw() {
  var imageData = ctx.createImageData(width, height);
  var data = imageData.data;

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var zx = (x / width) * 2 - 1;
      var zy = 1 - (y / height) * 2;

      zx = zx / zoom + pan.re;
      zy = zy / zoom + pan.im;

      var iterations = julia(zx, zy);
      var color = (iterations / maxIterations) * 255;

      var idx = (y * width + x) * 4;
      data[idx] = color; // R
      data[idx + 1] = color; // G
      data[idx + 2] = color; // B
      data[idx + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

canvas.addEventListener("mousemove", move);
canvas.addEventListener("click", click);

update();
