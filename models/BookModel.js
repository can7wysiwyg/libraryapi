const mongoose = require('mongoose')

const BookSchema = mongoose.Schema({

bookTitle: {
    type: String,
    required: true
},
bookImage: {
    type: String,
    required: true
},
bookISBN: {
    type: String,
    required: true,
    unique: true
},
bookAuthor: {
    type: String,
    required: true
},
bookGenre: {
    type: String,
    required: true
}


}, {
    timestamps: true
})

module.exports = mongoose.model('Book', BookSchema)