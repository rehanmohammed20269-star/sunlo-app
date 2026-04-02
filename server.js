const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

app.get("/admin.html", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

// 🔥 userId → socketId mapping
let users = {};

io.on("connection", (socket) => {

  socket.on("join", (id) => {
    users[id] = socket.id;

    // admin ko user list bhejo
    io.emit("user list", Object.keys(users));
  });

  socket.on("private message", (data) => {
    let toSocket = users[data.to];

    if(toSocket){
      io.to(toSocket).emit("private message", data);
    }
  });

  socket.on("disconnect", () => {
    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
      }
    }
    io.emit("user list", Object.keys(users));
  });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, "0.0.0.0", () => {
  console.log("Server running...");
});
