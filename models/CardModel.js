const mongoose = require('mongoose')

const CardSchema = mongoose.Schema({

    bookOne: {
        type: String,
        required: true
        
    },
    bookTwo: {
        type: String,
        
    },
    bookThree: {
        type: String,
        
    },
    borrower: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    hasBorrowedBooks: {
        type: Boolean,
        default: false
    }
    
}, {
    timestamps: true
})

module.exports = mongoose.model('Card', CardSchema)