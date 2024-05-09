import "./style.css";
let canvas = document.getElementById("bigCanvas");

let ctx = canvas.getContext("2d");


let canvas2 = document.getElementById("hoverStateCanvas");

let ctx2 = canvas2.getContext("2d");

canvas.width = window.innerWidth * window.devicePixelRatio;;
canvas.height = window.innerHeight * window.devicePixelRatio;;
canvas2.width = window.innerWidth * window.devicePixelRatio;;
canvas2.height = window.innerHeight * window.devicePixelRatio;;
// ctx.fillStyle = "hsl(120, 20%, 10%)"; // green
// ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;
let lastX = null;
let lastY = null;


let size = 50 * window.devicePixelRatio;
let activeImage = new Image()
activeImage.src = "orb.png"

let file = document.getElementById("file");
let buttons = document.getElementById("buttons");
let eraser = document.getElementById("eraser");
eraser.addEventListener("click", function(e) {
  activeImage.classList.remove("active");
  activeImage = eraser
  activeImage.classList.add("active");
})
file.addEventListener("change", e => {
  let reader = new FileReader();

  reader.onload = function(e) {
    let newImage = document.createElement("img");
    newImage.src = e.target.result;

    newImage.className = "imgbutton"
    buttons.appendChild(newImage);
    activeImage.classList.remove("active")
    activeImage = newImage;
    newImage.classList.add("active")
    newImage.addEventListener("click", () => {
      activeImage.classList.remove("active")
      activeImage = newImage;
      newImage.classList.add("active")
    })
  }
  reader.readAsDataURL(e.target.files[0]);
})

function distance(aX, aY, bX, bY) {
  return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
}
function pointsAlongLine(startx, starty, endx, endy, spacing) {
  let dist = distance(startx, starty, endx, endy);
  let steps = dist / spacing;

  let points = [];
  for (var d = 0; d <= 1; d += 1 / steps) {
    let point = {
      x: startx * d + endx * (1 - d),
      y: starty * d + endy * (1 - d)
    };
    points.push(point);
  }
  return points;
}

function drawStart(e) {
  isDrawing = true;
  lastX = e.clientX * window.devicePixelRatio;;
  lastY = e.clientY * window.devicePixelRatio;;


}

function rand() {
  return Math.random() - 0.5;
}
function drawMove(e) {
  let x = e.clientX * window.devicePixelRatio;;
  let y = e.clientY * window.devicePixelRatio;;

  ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
  ctx2.globalOpactity = 0.5;
  if (activeImage == eraser) {
    ctx2.beginPath()
    ctx2.rect(x - size, y - size, size * 2, size * 2)
    ctx2.fillStyle = "grey";
    ctx2.stroke();
  } else {
    let aspectRatio = activeImage.width / activeImage.height;
    let height = size / aspectRatio
    ctx2.drawImage(activeImage, x - size, y - height, size * 2, height * 2);
  }

  if (isDrawing === false) {
    return;
  }

  let thickness = 1;
  ctx.strokeStyle = "white";

  ctx.lineWidth = thickness;

  //   let distanceFromStart = distance(x, y, startX, startY);

  // console.log(distanceFromStart)
  let points = pointsAlongLine(x, y, lastX, lastY, 1);

  points.forEach((point) => {
    // draw cloud
    if (activeImage == eraser) {
      ctx.clearRect(point.x - size, point.y - size, size * 2, size * 2)
    } else {
      let aspectRatio = activeImage.width / activeImage.height;
      let height = size / aspectRatio
      ctx.drawImage(activeImage, point.x - size, point.y - height, size * 2, height * 2);
    }
  });

  lastX = x;
  lastY = y;
}
function drawEnd() {
  isDrawing = false;
}

canvas.addEventListener("pointerdown", drawStart);
canvas.addEventListener("pointerup", drawEnd);
canvas.addEventListener("pointerout", drawEnd);
canvas.addEventListener("pointermove", drawMove);
