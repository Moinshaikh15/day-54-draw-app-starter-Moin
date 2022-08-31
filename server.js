const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

app.use(express.static("public"));
app.use(cors());
let httpServer = app.listen(process.env.PORT || 8000);

let io = new Server(httpServer);

let prevDrawing = []; //array to store history of drawing
io.on("connect", (socket) => {
  console.log("Client connect", socket.id);
  socket.on("Chat-message", (data) => {
    console.log(`Message-from ${socket.id} ${data}`);
    socket.broadcast.emit("New-Message", `Message from ${socket.id} ${data}`);
    //io.broadcast.emit("New-Message", `Message from ${socket.id} ${data}`);
  });

  //broadcast new drawing
  socket.on("drawing", (data) => {
    prevDrawing.push(data);
    socket.broadcast.emit("new-coordinate", data);
  });

  //clear drawing for all user
  socket.on("clear", () => {
    prevDrawing = [];
    socket.broadcast.emit("clear");
  });

  //send history to new connection

  socket.emit("history", prevDrawing);

  socket.on("disconnect", () => console.log("Client Disconnected"));
});



