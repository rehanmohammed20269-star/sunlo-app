const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

app.get("/admin.html", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

let users = {};

io.on("connection", (socket) => {

  socket.on("join", (user) => {
    users[user.id] = { socketId: socket.id, name: user.name };
    io.emit("user list", users);
  });

  socket.on("private message", (data) => {
    let user = users[data.to];
    if (user) {
      io.to(user.socketId).emit("private message", data);
    }
  });

  socket.on("disconnect", () => {
    for (let id in users) {
      if (users[id].socketId === socket.id) {
        delete users[id];
      }
    }
    io.emit("user list", users);
  });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, "0.0.0.0", () => {
  console.log("Server running...");
});
