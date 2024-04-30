const ShowGenreRoute = require('express').Router()
const Genre = require('../models/GenreModel')
const asyncHandler = require('express-async-handler')



ShowGenreRoute.get('/showgenre/show_all', asyncHandler(async(req, res, next) => {
    try {

        const genres = await Genre.find()
        
        res.json({genres})
        
    } catch (error) {
        next(error)
    }
}))



module.exports = ShowGenreRoute