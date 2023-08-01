const mongoose = require('mongoose')

const CardSchema = mongoose.Schema({

    bookOne: {
        type: String,
        required: true,
        unique: true
    },
    bookTwo: {
        type: String,
        required: true,
        unique: true
    },
    bookThree: {
        type: String,
        required: true,
        unique: true
    },
    borrower: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Card', CardSchema)