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
role: {
    type: Number,
    default: 0
}


}, {timestamps: true})


module.exports = mongoose.model('Admin', AdminSchema)