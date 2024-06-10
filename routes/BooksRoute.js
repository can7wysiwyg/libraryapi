const BookRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Book = require('../models/BookModel')
const fs = require('fs')





BookRoute.get('/books/show_all', asyncHandler(async(req, res, next) => {

  try {

    const books = await Book.find().sort({_id: -1})

    res.json({books})
    
  } catch (error) {
    next(error)
  }


}))



BookRoute.get('/books/show_all_limited', asyncHandler(async(req, res, next) => {

  try {

    const booksLimited = await Book.find().sort({_id: -1}).limit(9)

    res.json({booksLimited})
    
  } catch (error) {
    next(error)
  }


}))






BookRoute.get('/books/single_book/:id', asyncHandler(async(req, res, next) => {
  try {

    const {id} = req.params

    const book = await Book.findById({_id: id})
   
    res.json({book})
    
  } catch (error) {
    next(error)
  }
}))



BookRoute.get('/books/show_according_to_genre/gnr', asyncHandler(async(req, res) => {

 const books = await Book.find({bookGenre: req.query.genre})

 res.json({books})


}))



module.exports = BookRoute
