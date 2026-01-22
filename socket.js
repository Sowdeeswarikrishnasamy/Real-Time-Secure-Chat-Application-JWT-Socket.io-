const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

let onlineUsers = {};

function initSocket(server) {
  const io = socketio(server, {
    cors: { origin: "*" }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  });

  io.on("connection", socket => {
    onlineUsers[socket.user.id] = socket.id;
    io.emit("online-users", Object.keys(onlineUsers));

    socket.on("send-message", async data => {
      const msg = await Message.create(data);
      if (onlineUsers[data.to]) {
        io.to(onlineUsers[data.to]).emit("receive-message", msg);
      }
      socket.emit("receive-message", msg);
    });

    socket.on("typing", to => {
      if (onlineUsers[to]) {
        io.to(onlineUsers[to]).emit("typing", socket.user.username);
      }
    });

    socket.on("disconnect", () => {
      delete onlineUsers[socket.user.id];
      io.emit("online-users", Object.keys(onlineUsers));
    });
  });
}

module.exports = { initSocket };


