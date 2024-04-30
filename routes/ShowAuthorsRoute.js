const ShowAuthorsRoute = require('express').Router()
const Author = require('../models/AuthorModel')
const asyncHandler = require('express-async-handler')

ShowAuthorsRoute.get('/showauthor/show_authors', asyncHandler(async(req, res, next) => {
    try {
        
        const authors = await Author.find()

        res.json({authors})


    } catch (error) {
        next(error)
    }
}))

ShowAuthorsRoute.get('/showauthor/show_single/:id', asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        const result = await Author.findOne({_id: id})

        res.json({result})
        
    } catch (error) {
        next(error)
    }
}))



module.exports = ShowAuthorsRoute