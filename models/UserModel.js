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
    age: {
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
      validate: {
        validator: function (v) {
          return v.length <= 8;
        },
        message: props => `ID number must not exceed 8 characters!`
      }
    },
    
    permToBorrow: {
      type: Boolean,
      default: false

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
