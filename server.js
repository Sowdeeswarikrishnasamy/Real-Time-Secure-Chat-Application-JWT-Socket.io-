const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// 🔥 In-memory storage (ONLINE STYLE)
const users = {};
const messages = [];

// ===== AUTH =====
app.post("/api/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json("Username required");

  const token = jwt.sign({ username }, "SECRET_KEY");
  users[username] = true;

  res.json({ token, username });
});

// ===== SOCKET =====
io.on("connection", socket => {
  console.log("User connected");

  socket.on("join", username => {
    socket.username = username;
    io.emit("onlineUsers", Object.keys(users));
  });

  socket.on("sendMessage", data => {
    messages.push(data);
    io.emit("receiveMessage", data);
  });

  socket.on("typing", name => {
    socket.broadcast.emit("typing", name);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      delete users[socket.username];
      io.emit("onlineUsers", Object.keys(users));
    }
  });
});

server.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);





/*
mongoose.connect("mongodb+srv://sowdeeswari282_db_user:chat12345@cluster0.ffciygq.mongodb.net/?appName=Cluster0");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));
*/
