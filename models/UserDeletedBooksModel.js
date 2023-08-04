const mongoose = require('mongoose')

const UserDeletedBookSchema = mongoose.Schema({
bookOne: {
    type: String
},
bookTwo: {
    type: String
},
bookThree: {
    type: String
},
borrower: {
    type: String
}

}, {
    timestamps: true
})


module.exports = mongoose.model('UserDeletedBook', UserDeletedBookSchema)

