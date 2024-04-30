const CardRoute = require('express').Router()
const Card = require('../models/CardModel')
const ScheduledTask = require('../models/ScheduleTaskModel')
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel') 
const verify = require('../middleware/verify')
const ableToBorrow = require('../middleware/ableToBorrow')
const jwt = require('jsonwebtoken');



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
     const checks = await Card.findOne({_id: id})
     const getCardFromTasks = await ScheduledTask.findOne({cardId: id})
     const scheduleId = getCardFromTasks._id.toString()

     
     
     

     if( checks.bookOne === "" && checks.bookTwo === "" && checks.bookThree === "") {

      await Card.findByIdAndDelete(id)
      await ScheduledTask.findByIdAndDelete(scheduleId)
      res.json({msg: "books on card successfully deleted.."})

     }

     res.json({msg: "you will only be able to borrow once all books you borrowed have been returned"})
        
      
      
    
    
    
      
    } catch (error) {
      next(error)
    }
    
    
    
    }))
    
    
    CardRoute.put('/card/delete_book_two/:id', verify,  asyncHandler(async(req, res, next) => {
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
          res.json({ msg: "Successfully returned " });
        } else {
          res.json({ msg: "No document was found or updated" });
        }
        
      } catch (error) {
        next(error)
      }
    }))
    
    
    CardRoute.put('/card/delete_book_three/:id', verify, asyncHandler(async(req, res, next) => {
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
          res.json({ msg: "Successfully returned" });
        } else {
          res.json({ msg: "No document was found or updated" });
        }
    
    
    
        
      } catch (error) {
        next(error)
      }
    }))


    CardRoute.put('/card/update_book_one/:id', verify,  asyncHandler(async (req, res, next) => {
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
          res.json({ msg: "Successfully returned" });
        } else {
          res.json({ msg: "No document was found or updated" });
        }
      } catch (error) {
        next(error);
      }
    }));
    

    
   
    
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
