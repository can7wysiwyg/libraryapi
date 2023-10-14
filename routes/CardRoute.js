const CardRoute = require('express').Router()
const Card = require('../models/CardModel')
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
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

        const { id } = req.params;
        const Owner = await User(req.user)

        const user = Owner._id.toString()
        const getOwner = await Card.findOne({_id: id})
         
       const see = getOwner.borrower

       if( user !== see ) {
        res.json({msg: "u do not have access"})
       }
        
        
        const updatedValue = ""; // Value you want to set 'bookOne' to
    
        const filter = { _id: id };
        const update = { $set: { bookTwo: updatedValue } };
    
        const updatedCard = await Card.findOneAndUpdate(filter, update, { new: true });
    
        if (updatedCard) {
          res.json({ msg: "Successfully updated 'bookTwo' to null" });
        } else {
          res.json({ msg: "No document was found or updated" });
        }
        
      } catch (error) {
        next(error)
      }
    }))
    
    
    CardRoute.delete('/card/delete_book_three/:id', verify, ableToBorrow, asyncHandler(async(req, res, next) => {
      try {
        const { id } = req.params;
        const Owner = await User(req.user)

        const user = Owner._id.toString()
        const getOwner = await Card.findOne({_id: id})
         
       const see = getOwner.borrower

       if( user !== see ) {
        res.json({msg: "u do not have access"})
       }
        
        
        const updatedValue = ""; // Value you want to set 'bookOne' to
    
        const filter = { _id: id };
        const update = { $set: { bookThree: updatedValue } };
    
        const updatedCard = await Card.findOneAndUpdate(filter, update, { new: true });
    
        if (updatedCard) {
          res.json({ msg: "Successfully updated 'bookThree' to null" });
        } else {
          res.json({ msg: "No document was found or updated" });
        }
    
    
    
        
      } catch (error) {
        next(error)
      }
    }))


    CardRoute.put('/card/update_book_one/:id', verify, ableToBorrow, asyncHandler(async (req, res, next) => {
      try {
        const { id } = req.params;
        const Owner = await User(req.user)

        const user = Owner._id.toString()
        const getOwner = await Card.findOne({_id: id})
         
       const see = getOwner.borrower

       if( user !== see ) {
        res.json({msg: "u do not have access"})
       }
        
        
        const updatedValue = ""; // Value you want to set 'bookOne' to
    
        const filter = { _id: id };
        const update = { $set: { bookOne: updatedValue } };
    
        const updatedCard = await Card.findOneAndUpdate(filter, update, { new: true });
    
        if (updatedCard) {
          res.json({ msg: "Successfully updated 'bookOne' to null" });
        } else {
          res.json({ msg: "No document was found or updated" });
        }
      } catch (error) {
        next(error);
      }
    }));
    

    
   
    CardRoute.get('/card/admin_view_borrowed_books', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
        
      try {
         
        const borrowedBooks = await UserBorrowedBook.find().sort({_id: -1})

        res.json({borrowedBooks})

      } catch (error) {
        next(error)
      }


    }))


    CardRoute.get('/card/show_user_borrowed_book/:id', verifyAdmin, authAdmin,  asyncHandler(async(req, res, next) => {
      try {
        const {id} = req.params

       const result = await UserBorrowedBook.findOne({Borrower: id})

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
    


    CardRoute.get('/card/show_owner_books/:id', verify, ableToBorrow, asyncHandler(async(req, res, next) => {
      try {

        const {id} = req.params

        const result = await Card.findOne({borrower: id})

        res.json({result})

        
      } catch (error) {
        next(error)
      }
    }))

module.exports = CardRoute
