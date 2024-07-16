const GenreRoute = require('express').Router()
const Genre = require('../models/GenreModel')
const asyncHandler = require('express-async-handler')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')

GenreRoute.post('/genre/create_genre', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {

        const {genreName} = req.body

        if(!genreName) res.json({msg: "field cannot be empty"})

 const genres = await Genre.find()

 let genreExists = false;


if(genres.length >= 2 ){

    res.json({msg: "there are only two main genres! Fiction and Non-Fiction"})

} 

genres.forEach(genre => {
    if (genre.genreName.includes(genreName)) {
      genreExists = true;
    }
  });

  if (genreExists) {
    return res.json({ msg: "this genre already exists!" });
  }

        await Genre.create({
            genreName
        })

        res.json({msg: "genre successfully created"})

        
    } catch (error) {
        next(error)
    }

}))

GenreRoute.put('/genre/update_subgenre/:id',verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


    try {


        const {id} = req.params
        const{subgenres} = req.body

      await  Genre.updateOne({_id: id}, {$push: {subgenres:  subgenres  }} ) 

     res.json({msg: "successfully created!"})



        
    } catch (error) {
        next(error)
    }




}) )


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
