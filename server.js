const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {

  socket.on("join", (id) => {
    socket.join(id);
  });

  socket.on("private message", (data) => {
    io.to(data.to).emit("private message", data);
  });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log("Server running...");
});
