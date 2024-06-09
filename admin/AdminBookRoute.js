const AdminBookRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Book = require('../models/BookModel')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });


  AdminBookRoute.post('/adminbook/add_book', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {
    
        const {bookTitle, bookISBN, bookAuthor, bookGenre, bookDescription, bookReleaseDate} = req.body
    
        if(!bookTitle) res.json({msg: "book title cannot be empty"})
    
        if(!bookISBN) res.json({msg: "book isbn number cannot be empty"})
    
        if(!bookAuthor) res.json({msg: "boook author cannot be empty"})
    
        if(!bookGenre) res.json({msg: "book genre cannot be empty"})
    
        if(!bookDescription) res.json({msg: "book description cannot be empty"})
    
        if(!bookReleaseDate) res.json({msg: "book release date cannot be empty"})
    
        
        if (!req.files || !req.files.bookImage || !req.files.bookFile) {
            return res.status(400).json({ message: 'No file uploaded' });
          }
        
          
          const bookFileResult = await cloudinary.uploader.upload(req.files.bookFile.tempFilePath, {
            resource_type: 'auto', // Set resource type to "auto" to handle different file types
          });
      
          
          const bookImageResult = await cloudinary.uploader.upload(req.files.bookImage.tempFilePath);
      
          const bookCol = new Book({
            bookAuthor,
            bookDescription,
            bookGenre,
            bookISBN,
            bookReleaseDate,
            bookTitle,
            bookFile: bookFileResult.secure_url,
            bookImage: bookImageResult.secure_url,
          });
      
          await bookCol.save();
      
          // Delete the audio and image files from the temporary uploads folder
          fs.unlinkSync(req.files.bookFile.tempFilePath);
          fs.unlinkSync(req.files.bookImage.tempFilePath);

          console.log(bookCol)
      
          res.json({
            msg: 'Book and image files uploaded successfully',
            
          });
      
    
    
    
        
    } catch (error) {
        next(error)
    }
    
    
    }))
    

    



AdminBookRoute.put('/adminbook/update_book_title/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


  try {
  
    const{id} = req.params
  
    const {bookTitle} = req.body
  
    await Book.updateOne({_id: id}, {$set:{bookTitle}})
  
    res.json({msg: "successfully updated.."})
    
  } catch (error) {
    next(error)
  }
  



    }))



    AdminBookRoute.put('/adminbook/update_book_author/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


      try {
      
        const{id} = req.params
      
        const {bookAuthor} = req.body
      
        await Book.updateOne({_id: id}, {$set:{bookAuthor}})
      
        res.json({msg: "successfully updated.."})
        
      } catch (error) {
        next(error)
      }
      
    
    
    
        }))



        AdminBookRoute.put('/adminbook/update_book_genre/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


          try {
          
            const{id} = req.params
          
            const {bookGenre} = req.body
          
            await Book.updateOne({_id: id}, {$set:{bookGenre}})
          
            res.json({msg: "successfully updated.."})
            
          } catch (error) {
            next(error)
          }
          
        
        
        
            }))


            AdminBookRoute.put('/adminbook/update_book_description/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


              try {
              
                const{id} = req.params
              
                const {bookDescription} = req.body
              
                await Book.updateOne({_id: id}, {$set:{bookDescription}})
              
                res.json({msg: "successfully updated.."})
                
              } catch (error) {
                next(error)
              }
              
            
            
            
                }))
               
        
    
    
    
    
    
    
    AdminBookRoute.put('/adminbook/update_image/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
    
    try {
      const { id } = req.params;
    
          const book = await Book.findById(id);
    
          if (!book) {
            return res.status(404).json({ msg: "Book not found." });
          }
    
          if (book.bookImage) {
            const publicId = book.bookImage.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          }
    
          if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: "No file uploaded." });
          }
    
          const bookImage = req.files.bookImage;
    
          const result = await cloudinary.uploader.upload(bookImage.tempFilePath);
    
          book.bookImage = result.secure_url;
    
          await book.save();
    
          fs.unlinkSync(bookImage.tempFilePath);
    
          res.json({ msg: "Book picture updated successfully." });
    
    
    
      
    } catch (error) {
      next(error)
    }
    
    }))
    
    
    AdminBookRoute.put('/adminbook/update_pdf/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
    
      try {
        const { id } = req.params;
      
            const book = await Book.findById(id);
      
            if (!book) {
              return res.status(404).json({ msg: "Book not found." });
            }
      
            if (book.bookFile) {
              const publicId = book.bookFile.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy(publicId);
            }
      
            if (!req.files || Object.keys(req.files).length === 0) {
              return res.status(400).json({ msg: "No file uploaded." });
            }
      
            const bookFile = req.files.bookFile;
      
            const result = await cloudinary.uploader.upload(bookFile.tempFilePath);
      
            book.bookFile = result.secure_url;
      
            await book.save();
      
            fs.unlinkSync(bookFile.tempFilePath);
      
            res.json({ msg: " updated successfully." });
      
      
      
        
      } catch (error) {
        next(error)
      }
      
      }))
      
    
    
    
    AdminBookRoute.delete('/adminbook/delete_book/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
      try {
    
        const{id} = req.params
    
        await Book.findByIdAndDelete(id)
    
        res.json({msg: "book has been deleted"})
        
      } catch (error) {
        next(error)
      }
    }))
    
    AdminBookRoute.delete('/adminbook/delete_all_by_author/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
    
    try {
    
      const{id} = req.params
    
      await Book.deleteMany({bookAuthor: id})
    
      res.json({msg: "all author's books have been deleted"})
    
    
      
    } catch (error) {
      next(error)
    }
    
    }))
    






  module.exports = AdminBookRoute