const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const ableToBorrow = asyncHandler(async (req, res, next) => {
  const role = await User.findById(req.user.id);

  if (!role) {
    return res.status(404).json({ msg: " user not found" });
  }

  if (role.permToBorrow === false) {
    return res
      .status(403)
      .json({
        msg: "Please wait as we are currently reviewing your ID number before you can start borrowing",
      });
  }

  if (role.role !== 1) {
    return res
      .status(403)
      .json({ msg: "You have lost access to your account." });
  }

  next();
});

module.exports = ableToBorrow;
