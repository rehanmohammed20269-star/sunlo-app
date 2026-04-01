const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// 👇 static public folder serve karega
app.use(express.static("public"));

// 👇 force admin.html open (important fix)
app.get("/admin.html", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

let users = [];

// 👇 socket connection
io.on("connection", (socket) => {

  socket.on("join", (id) => {
    socket.join(id);

    if (!users.includes(id)) {
      users.push(id);
    }

    // 👇 admin ko user list bhejo
    io.emit("user list", users);
  });

  socket.on("private message", (data) => {
    io.to(data.to).emit("private message", data);
  });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log("Server running...");
});

// refresh
