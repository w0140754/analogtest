// === CANVAS ===
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// === LOAD ASSETS ===
const bg = new Image();
bg.src = "background.png";   // <-- your file

const frames = [
  "player1.png",
  "player2.png",
  "player3.png"
].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

// === PLAYER ===
let player = {
  x: 200,
  y: 200,
  speed: 150,     // px/sec
  frame: 0,
  frameTimer: 0
};

// === JOYSTICK INPUT ===
let joy = {
  active: false,
  dx: 0, dy: 0
};

const joyDiv = document.getElementById("joystick");
const stick = document.getElementById("stick");

joyDiv.addEventListener("touchstart", e => {
  joy.active = true;
});
joyDiv.addEventListener("touchend", e => {
  joy.active = false;
  joy.dx = joy.dy = 0;
  stick.style.left = "30px";
  stick.style.top = "30px";
});
joyDiv.addEventListener("touchmove", e => {
  const rect = joyDiv.getBoundingClientRect();
  const touch = e.touches[0];

  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const cx = rect.width / 2;
  const cy = rect.height / 2;

  let dx = x - cx;
  let dy = y - cy;
  const dist = Math.hypot(dx, dy);
  const max = 40;

  if (dist > max) {
    dx = (dx / dist) * max;
    dy = (dy / dist) * max;
  }

  stick.style.left = `${30 + dx}px`;
  stick.style.top = `${30 + dy}px`;

  joy.dx = dx / max;
  joy.dy = dy / max;
});

// === MAIN LOOP ===
let last = 0;
function loop(t) {
  let dt = (t - last) / 1000;
  last = t;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function update(dt) {
  // movement
  player.x += joy.dx * player.speed * dt;
  player.y += joy.dy * player.speed * dt;

  // animation
  player.frameTimer += dt;
  if (player.frameTimer > 0.2) {
    player.frame = (player.frame + 1) % frames.length;
    player.frameTimer = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background stretched
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  const img = frames[player.frame];
  const w = img.width;
  const h = img.height;

  ctx.drawImage(img, player.x - w/2, player.y - h/2);
}
