const CardRoute = require('express').Router()
const Card = require('../models/CardModel')
const asyncHandler = require('express-async-handler')
const verify = require('../middleware/verify')
const ableToBorrow = require('../middleware/ableToBorrow')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const jwt = require('jsonwebtoken');
const UserBorrowedBook = require('../models/PreviousUserBorrowedBookModel')



const getAccessTokenFromDB = async (userId) => {
    try {
      const accessToken = await Card.findOne({ borrower: userId });
      return accessToken ? accessToken.token : null;
    } catch (error) {
      throw new Error('Error fetching access token from the database.');
    }
  };
  
  

CardRoute.get('/card/view_book/:id', verify, ableToBorrow, asyncHandler(async (req, res, next) => {
    try {
      const {id} = req.params
  
    
      const accessToken = await getAccessTokenFromDB(id);
  
      if (!accessToken) {
        return res.status(401).json({ msg: 'Access token not found in the database.' });
      }
  
      
      jwt.verify(accessToken, process.env.BOOK_ACCESS_TOKEN, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ msg: 'Invalid or expired token.' });
        }
  
      
        const nowInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp < nowInSeconds) {
          return res.status(403).json({ msg: 'Token has expired.' });
        }
  
        
        const card = await Card.findOne({ borrower: id });
  
        if (!card) {
          return res.status(404).json({ msg: 'No borrowed books found for the user.' });
        }
  
        
        res.json({ card });
      });
  
    } catch (error) {
      next(error);
    }
  }));
  



CardRoute.delete('/card/delete_book/:id', verify, ableToBorrow, asyncHandler(async(req, res, next) => {

    try {
    
      const {id} = req.params
    
        
      await Card.findByIdAndDelete(id)
      res.json({msg: "books on card successfully deleted.."})
    
    
    
    
      
    } catch (error) {
      next(error)
    }
    
    
    
    }))
    
    
    CardRoute.delete('/card/delete_book_two/:id', verify, ableToBorrow, asyncHandler(async(req, res, next) => {
      try {
        const {id} = req.params
    
        const query = { _id: id }
    
        const update = { $unset: { 'bookTwo': '' } };
    
        Card.updateOne(query, update).then((results) => {
          if(results) {
            res.json({msg: "successfully deleted"})
          }
        })
        
    
    
    
        
      } catch (error) {
        next(error)
      }
    }))
    
    
    CardRoute.delete('/card/delete_book_three/:id', verify, ableToBorrow, asyncHandler(async(req, res, next) => {
      try {
        const {id} = req.params
    
        const query = { _id: id }
    
        const update = { $unset: { 'bookThree': '' } };
    
        Card.updateOne(query, update).then((results) => {
          if(results) {
            res.json({msg: "successfully deleted"})
          }
        })
        
    
    
    
        
      } catch (error) {
        next(error)
      }
    }))
    
    
    
    CardRoute.delete('/card/delete_book_one/:id', verify, ableToBorrow, asyncHandler(async(req, res, next) => {
      try {
        const {id} = req.params
    
        const query = { _id: id }
    
        const update = { $unset: { 'bookOne': '' } };
    
        Card.updateOne(query, update).then((results) => {
          if(results) {
            res.json({msg: "successfully deleted"})
          }
        })
        
    
    
    
        
      } catch (error) {
        next(error)
      }
    }))
    

    CardRoute.get('/card/admin_view_borrowed_books', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
        
      try {
         
        const borrowedBooks = await UserBorrowedBook.find().sort({_id: -1})

        res.json({borrowedBooks})

      } catch (error) {
        next(error)
      }


    }))


    CardRoute.get('/card/show_single_card/:id', verifyAdmin, authAdmin,  asyncHandler(async(req, res, next) => {
      try {
        const {id} = req.params

       const result = await UserBorrowedBook.findById({_id: id})

       res.json({result})
        
      } catch (error) {
        next(error)
      }
    }))


    CardRoute.get('/card/show_to_user/:id', verify, ableToBorrow, asyncHandler(async (req, res, next) => {
      try {
        const { id } = req.params;
    
    
        const card = await Card.findOne({ borrower: id });
    
        
        res.json({  card });
      } catch (error) {
        next(error);
      }
    }));
    


    CardRoute.get('/card/show_owner_of_card/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
      try {

        const {id} = req.params

        const result = await UserBorrowedBook.findOne({Borrower: id})

        res.json({result})

        
      } catch (error) {
        next(error)
      }
    }))

module.exports = CardRoute
