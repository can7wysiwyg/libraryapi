const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({
    fullname: {
        type: String,
        unique: true,
        required: true,
      },
    librarianImage: {
        type: String,
        unique: true,
      
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
    email: {
        type: String,
    unique: true,
    required: true
    },

password: {
    type: String,
    unique: true,
    required: true
},
uniqueName: {
    type: String,
    required: true,
    unique: true

},

admin: {
    type: Number,
    default: 1
},
accountStatus: {
    type: Boolean,
    default: true
}


}, {timestamps: true})


module.exports = mongoose.model('Admin', AdminSchema)