const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });
  if (!user) {
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ username, password: hashed });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json("Invalid");

  const token = jwt.sign({ id: user._id }, "SECRETKEY");
  res.json({ token, username });
});

module.exports = router;


