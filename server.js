const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

app.get("/admin.html", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

let users = [];

io.on("connection", (socket) => {

  socket.on("join", (id) => {
    socket.join(id);
    if (!users.includes(id)) users.push(id);
    io.emit("user list", users);
  });

  socket.on("private message", (data) => {
    io.to(data.to).emit("private message", data);
  });

});

const PORT = process.env.PORT || 3000;

// 🔥 THIS LINE FIXES CRASH
server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
