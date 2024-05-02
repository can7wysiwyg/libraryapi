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


ShowGenreRoute.get('/showgenre/show_single/:id', asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        const genre = await Genre.findById({_id: id})
        
        res.json({genre})
        
    } catch (error) {
        next(error)
    }
}))







module.exports = ShowGenreRoute