const GenreRoute = require('express').Router()
const Genre = require('../models/GenreModel')
const asyncHandler = require('express-async-handler')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')

GenreRoute.post('/genre/create_genre', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {

        const {genreName} = req.body

        if(!genreName) res.json({msg: "field cannot be empty"})

        await Genre.create({
            genreName
        })

        res.json({msg: "genre successfully created"})

        
    } catch (error) {
        next(error)
    }

}))


GenreRoute.put('/genre/edit_genre/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {
        const{id} = req.params

        await Genre.findByIdAndUpdate(id, req.body, {new: true})

        res.json({msg: "updated successfully.."})
        
    } catch (error) {
        next(error)
    }
}))

GenreRoute.delete('/genre/delete_genre/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

try {

    const {id} = req.params
    
    await Genre.findByIdAndDelete(id)

    res.json({msg: "successfully deleted..."})

} catch (error) {
    next(error)
}

}))

GenreRoute.get('/genre/show_all', asyncHandler(async(req, res, next) => {
    try {

        const genres = await Genre.find()
        
        res.json({genres})
        
    } catch (error) {
        next(error)
    }
}))

module.exports = GenreRoute
