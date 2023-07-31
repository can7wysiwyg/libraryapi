const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({

fullname: {
    type: String,
    unique: true,
    required: true
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
adminImage: {
    type: String,
    unique: true,
    required: true
},
admin: {
    type: Number,
    default: 0
},
accountStatus: {
    type: Boolean,
    default: true
}


}, {timestamps: true})


module.exports = mongoose.model('Admin', AdminSchema)