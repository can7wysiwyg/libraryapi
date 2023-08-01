// route will be managed by admin/librarian
const BookRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Admin = require('../models/AdminModel')
const Book = require('../models/BookModel')
const verifyAdmin = require('../middleware/verifyMainAdmin')
const authAdmin = require('../middleware/authAdmin')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });


BookRoute.post('/books/add_book', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

try {

    const {bookTitle, bookISBN, bookAuthor, bookGenre, bookDescription, bookReleaseDate} = req.body

    if(!bookTitle) res.json({msg: "book title cannot be empty"})

    if(!bookISBN) res.json({msg: "book isbn number cannot be empty"})

    if(!bookAuthor) res.json({msg: "boook author cannot be empty"})

    if(!bookGenre) res.json({msg: "book genre cannot be empty"})

    if(!bookDescription) res.json({msg: "book description cannot be empty"})

    if(!bookReleaseDate) res.json({msg: "book release date cannot be empty"})


    if (!req.files || !req.files.bookImage) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
    
      const file = req.files.bookImage;

      cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'testImage',
        width: 150,
        height: 150,
        crop: "fill"
      }, async (err, result) => {
        if (err) throw err;
    
        removeTmp(file.tempFilePath);


        await Book.create({
          bookAuthor,
          bookDescription,
          bookGenre,
          bookReleaseDate,
          bookTitle,
          bookImage: result.secure_url,
        }); 
  
        res.json({ msg: "book has been successfully created!" });
    
      });





    
} catch (error) {
    next(error)
}


}))


BookRoute.put('/books/edit_book/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {


  try {

    const {id} = req.params
    if(!id) res.json({msg: "no book selected"})

    await Book.findByIdAndUpdate(id, req.body, {new: true})

    res.json({msg: "successfully updated"})
    
  } catch (error) {
    next(error)
  }



}))


BookRoute.put('/books/update_image/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

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

BookRoute.delete('/books/delete_book/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
  try {

    const{id} = req.params

    await Book.findByIdAndDelete(id)
    
  } catch (error) {
    next(error)
  }
}))

BookRoute.delete('/books/delete_all_by_author/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

try {

  const{id} = req.params

  await Book.deleteMany({bookAuthor: id})

  res.json({msg: "all author's books have been deleted"})


  
} catch (error) {
  next(error)
}

}))


BookRoute.get('/books/show_all', asyncHandler(async(req, res, next) => {

  try {

    const books = await Book.find().sort({_id: -1})

    res.json({books})
    
  } catch (error) {
    next(error)
  }


}))

BookRoute.get('/books/single_book/:id', asyncHandler(async(req, res, next) => {
  try {

    const {id} = req.params

    const book = await Book.findOne({_id: id})
   
    res.json({book})
    
  } catch (error) {
    next(error)
  }
}))

BookRoute.get('/books/show_author_books/:id', asyncHandler(async(req, res) => {
  await Book.find({bookAuthor : req.params.id }).then((books) =>
      res.json({ books })
    );
}))


BookRoute.get('/books/show_according_to_genre/gnr', asyncHandler(async(req, res) => {

 const books = await Book.find({bookGenre: req.query.genre})

 res.json({books})


}))



module.exports = BookRoute

function removeTmp(filePath) {
    fs.unlink(filePath, err => {
      if (err) throw err;
    });
  }