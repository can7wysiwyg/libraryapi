const mongoose = require("mongoose");

const LibrarianSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      unique: true,
      required: true,
    },
    personalEmail: {
      type: String,
      unique: true,
      required: true,
    },
    home: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    librarianImage: {
      type: String,
      unique: true,
      required: true,
    },
    uniqueNameLibrarian: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Librarian", LibrarianSchema);
