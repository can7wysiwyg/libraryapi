const BorrowRoute = require('express').Router()
const Card = require('../models/CardModel')
const verify = require('../middleware/verify')
const ableToBorrow = require('../middleware/ableToBorrow')
const asyncHandler = require('express-async-handler')


BorrowRoute.post('/borrow/borrow_books', verify, ableToBorrow, asyncHandler(async(req, res, next) => {
    try {
        const {bookOne, bookTwo, bookThree, borrower} = req.body

        await Card.create({
            bookOne,
            bookTwo,
            bookThree,
            borrower
        })


        res.json({msg: "successfully borrowed"})
        
        
        
    } catch (error) {
        next(error)
    }
}))



module.exports = BorrowRoute