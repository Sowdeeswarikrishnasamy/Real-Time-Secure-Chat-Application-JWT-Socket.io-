const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });

  if (!user) {
    user = new User({ username, password });
    await user.save();
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Wrong password" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    "SECRET_KEY"
  );

  res.json({ token, username });
});

module.exports = router;

