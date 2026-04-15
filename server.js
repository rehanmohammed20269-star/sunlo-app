const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// 📁 public folder serve
app.use(express.static("public"));

// 🔌 socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 📩 USER MESSAGE
  socket.on("userMessage", (msg) => {
    console.log("User:", msg);

    // admin ko bhejo
    io.emit("userMessage", msg);
  });

  // 📤 ADMIN REPLY
  socket.on("adminReply", (msg) => {
    console.log("Admin:", msg);

    // user ko bhejo
    io.emit("adminReply", msg);
  });

  // ❌ disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🚀 server start
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
