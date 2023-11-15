const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const { addUser, removeUser, getUser, getRoomUsers } = require("./entity");

//instances
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
//End Point
app.get("/", (req, res) => {
  res.json("test ok");
});

//sockect

io.on("connect", (socket) => {
  console.log("User Connected");

  socket.on("join", ({ name, room }, callBack) => {
    const userId = socket.id;
    socket.emit("me", userId);
    const { user, error } = addUser({
      id: userId,
      name: name,
      room: room,
    });

    console.log(user);

    if (error) {
      callBack(error);
      return;
    }

    //user to join the room
    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `Welcome ${user.name} `,
    });

    // intimates the existing user in room about the newly joined user
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });

    io.to(user.room).emit("activeUsers", getRoomUsers(user.room));
  });

  socket.on("sendMsg", (message, callBack) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
    });

    callBack();
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");

    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });

      io.to(user.room).emit("activeUsers", getRoomUsers(user.room));
    }
    socket.broadcast.emit("callEnded");
  });
});

//Run server
server.listen(8080, () => console.log("Server started on port 8080"));
