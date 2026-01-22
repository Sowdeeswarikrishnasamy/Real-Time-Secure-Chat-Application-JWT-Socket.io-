const express = require("express");
const auth = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const router = express.Router();

router.post("/message", auth, async (req, res) => {
  const msg = await Message.create({
    sender: req.user.id,
    chat: req.body.chatId,
    content: req.body.content
  });
  res.json(msg);
});

router.get("/message/:chatId", auth, async (req, res) => {
  const msgs = await Message.find({ chat: req.params.chatId });
  res.json(msgs);
});

module.exports = router;
