const mongoose = require('mongoose')

const UserBorrowedBookSchema = mongoose.Schema({
BookOne: {
    type: String
},
BookTwo: {
    type: String
},
BookThree: {
    type: String
},
Borrower: {
    type: String
}

}, {
    timestamps: true
})


module.exports = mongoose.model('UserBorrowedBook', UserBorrowedBookSchema)

