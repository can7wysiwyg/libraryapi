const AdminCardRoute = require('express').Router()
const UserBorrowedBook = require('../models/PreviousUserBorrowedBookModel')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const asyncHandler = require('express-async-handler')




AdminCardRoute.get('/admincard/admin_view_borrowed_books', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
        
    try {
       
      const borrowedBooks = await UserBorrowedBook.find().sort({_id: -1})

      res.json({borrowedBooks})

    } catch (error) {
      next(error)
    }


  }))


  AdminCardRoute.get('/admincard/show_user_borrowed_book/:id', verifyAdmin, authAdmin,  asyncHandler(async(req, res, next) => {
    try {
      const {id} = req.params

     const result = await UserBorrowedBook.findOne({Borrower: id})

     res.json({result})
      
    } catch (error) {
      next(error)
    }
  }))







module.exports = AdminCardRoute