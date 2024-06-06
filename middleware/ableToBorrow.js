const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const ableToBorrow = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ msg: " user not found" });
  }

  
  if (user.role !== 1) {
    return res
      .status(403)
      .json({ msg: "You have lost access to your account." });
  }

  next();
});

module.exports = ableToBorrow;
