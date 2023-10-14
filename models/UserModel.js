const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    userImage: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    DOB: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true

    },
    idNumber: {
      type: String,
      required: true,
      unique: true
    },
    
    permToBorrow: {
      type: Boolean,
      default: true

    },
    role: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
