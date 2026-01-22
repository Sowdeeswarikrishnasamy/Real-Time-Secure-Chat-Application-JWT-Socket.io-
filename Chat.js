const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  isGroup: Boolean,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  name: String
});

module.exports = mongoose.model("Chat", chatSchema);
