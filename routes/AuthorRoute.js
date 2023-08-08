const AuthorRoute = require('express').Router()
const Author = require('../models/AuthorModel')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const asyncHandler = require('express-async-handler')


AuthorRoute.post('/author/create_author', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

try {
    const {authorName, authorCountry, authorShortBio} = req.body

    if(!authorName) res.json({msg: "author name cannot be empty"})

    if(!authorCountry) res.json({msg: "author's country cannot be empty"})

    if(!authorShortBio) res.json({msg: "author short bio cannot be empty"})


    await Author.create({
        authorName,
        authorCountry,
        authorShortBio

    })

    res.json({msg: "author has been successfully created"})
    
} catch (error) {
    next(error)
}

}))


AuthorRoute.get('/author/show_authors', asyncHandler(async(req, res, next) => {
    try {
        
        const authors = await Author.find()

        res.json({authors})


    } catch (error) {
        next(error)
    }
}))

AuthorRoute.get('/author/show_single/:id', asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        const result = await Author.findOne({_id: id})

        res.json({result})
        
    } catch (error) {
        next(error)
    }
}))


AuthorRoute.put('/author/edit_author/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        await Author.findByIdAndUpdate(id, req.body, {new: true})

        res.json({msg: "author has been successfully updated..."})
        
    } catch (error) {
        next(error)
    }
}))

AuthorRoute.delete('/author/delete_author/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        await Author.findByIdAndDelete(id)


        res.json({msg: "author has successfully been deleted..."})
        
    } catch (error) {
        next(error)
    }
}))


module.exports = AuthorRoute