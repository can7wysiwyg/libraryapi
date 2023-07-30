const mongoose = require('mongoose')

const AuthorSchema = mongoose.Schema({
authorName: {
    type: String,
    required: true
},
authorCountry: {
    type: String,
    required: true
}

}, {
    timestamps: true
})

module.exports = mongoose.model('Author', AuthorSchema)