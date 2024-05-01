const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({
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