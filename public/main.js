const socket = io.connect(location.origin);

let inputEl = document.querySelector("#msg");

//events

socket.on("New-Message", (data) => console.log(data));

//new drawing
socket.on("new-coordinate", (data) => {
  noStroke();
  fill(200, 0, 200);
  ellipse(data.mouseX, data.mouseY, 20, 20);
});

//clear drawing
socket.on("clear", () => {
  setup();
  prevDrawing = [];
});

//get history when new user connected
socket.on("history", (data) => {
  for (let i = 0; i < data.length; i++) {
    let { mouseX, mouseY } = data[i];
    noStroke();
    ellipse(mouseX, mouseY, 20, 20);
  }
});

///functions

function sendMessage(e) {
  socket.emit("Chat-message", inputEl.value);
  inputEl.value = "";
}

//clear function
function clearCanvas() {
  setup();
  socket.emit("clear");
}

//setup canvas
function setup() {
  createCanvas(displayWidth, displayHeight);
  background(100);
}

function draw() {}

// let prevX;
// let prevY;
// function mousePressed() {
//   (prevX = mouseX), (prevY = mouseY);
// }

//draw when mouse is dragged
function mouseDragged() {
  noStroke();
  socket.emit("drawing", { mouseX, mouseY });
  fill(225);
  ellipse(mouseX, mouseY, 20, 20);

  // let currX = mouseX;
  // let currY = mouseY;
  //line(currX, currY, prevX, prevY);
  // prevX = currX;
  // prevY = currY;
}
