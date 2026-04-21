const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {

  // 👤 USER JOIN
  socket.on("join", ({name})=>{
    users[socket.id] = name;
    io.emit("userList", users);
  });

  // 💬 TEXT MESSAGE
  socket.on("userMessage", (msg)=>{
    io.emit("newMessage", {
      id: socket.id,
      name: users[socket.id],
      message: msg
    });
  });

  // 📤 ADMIN REPLY
  socket.on("adminReply", ({id, message})=>{
    io.to(id).emit("adminReply", message);
  });

  // ✍️ TYPING
  socket.on("typing", ()=>{
    socket.broadcast.emit("typing", users[socket.id]);
  });

  // 📎 IMAGE SEND
  socket.on("sendImage", (img)=>{
    io.emit("receiveImage", {
      id: socket.id,
      img: img
    });
  });

  // 🎤 VOICE SEND
  socket.on("sendVoice", (audio)=>{
    io.emit("receiveVoice", {
      id: socket.id,
      audio: audio
    });
  });

  // 📞 CALL SYSTEM (VOICE)
  socket.on("callUser", ({to, offer})=>{
    io.to(to).emit("incomingCall", {
      from: socket.id,
      offer
    });
  });

  socket.on("answerCall", ({to, answer})=>{
    io.to(to).emit("callAccepted", answer);
  });

  socket.on("iceCandidate", ({to, candidate})=>{
    io.to(to).emit("iceCandidate", candidate);
  });

  // ❌ DISCONNECT
  socket.on("disconnect", ()=>{
    delete users[socket.id];
    io.emit("userList", users);
  });

});

http.listen(process.env.PORT || 3000, ()=>{
  console.log("🚀 Server running...");
});
