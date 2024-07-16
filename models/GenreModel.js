const mongoose = require('mongoose')

const GenreSchema = mongoose.Schema({
    genreName: {
        type: String, 
        required: true,
        unique: true
      },
      subgenres: {
        type: Array,
        default: []
      }

    },

{
    timestamps: true
}
)


module.exports = mongoose.model('Genre', GenreSchema)