const AuthorRoute = require('express').Router()
const Author = require('../models/AuthorModel')
const verifyAdmin = require('../middleware/verifyAdmin')
const authAdmin = require('../middleware/authAdmin')
const asyncHandler = require('express-async-handler')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });



AuthorRoute.post('/author/create_author', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

try {
    const {authorName, authorCountry, authorShortBio} = req.body

    if(!authorName) res.json({msg: "author name cannot be empty"})

    if(!authorCountry) res.json({msg: "author's country cannot be empty"})

    if(!authorShortBio) res.json({msg: "author short bio cannot be empty"})

    if (!req.files || !req.files.authorImage) {
        return res.status(400).json({ message: 'No file uploaded' });
      }


      const file = req.files.authorImage;
    
      cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'libraryImages',
        width: 150,
        height: 150,
        crop: "fill"
      }, async (err, result) => {
        if (err) {
          console.error("Error uploading  image:", err);
          return res.status(500).json({ msg: "Failed to upload  image" });
        }
    
        removeTmp(file.tempFilePath);

        await Author.create({
            authorName,
            authorCountry,
            authorShortBio,
            authorImage: result.secure_url
    
        })
    
        res.json({msg: "author has been successfully created"})
        
    
        
      });
    


    
} catch (error) {
    next(error)
}

}))


AuthorRoute.put('/author/update_image/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {
        const{id} = req.params

        const author = await Author.findById(id);

      if (!author) {
        return res.status(404).json({ msg: "Author not found." });
      }

      if (author.authorImage) {
        const publicId = author.authorImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: "No file uploaded." });
      }

      const authorImage = req.files.authorImage;

      const result = await cloudinary.uploader.upload(authorImage.tempFilePath);

      author.authorImage = result.secure_url;

      await author.save();

      fs.unlinkSync(authorImage.tempFilePath);

      res.json({ msg: "author picture updated successfully." });



        
    } catch (error) {
        next(error)
    }

}))

AuthorRoute.get('/author/show_authors', asyncHandler(async(req, res, next) => {
    try {
        
        const authors = await Author.find()

        res.json({authors})


    } catch (error) {
        next(error)
    }
}))

AuthorRoute.get('/author/show_single/:id', asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        const result = await Author.findOne({_id: id})

        res.json({result})
        
    } catch (error) {
        next(error)
    }
}))


AuthorRoute.put('/author/edit_author/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        await Author.findByIdAndUpdate(id, req.body, {new: true})

        res.json({msg: "author has been successfully updated..."})
        
    } catch (error) {
        next(error)
    }
}))

AuthorRoute.delete('/author/delete_author/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        await Author.findByIdAndDelete(id)


        res.json({msg: "author has successfully been deleted..."})
        
    } catch (error) {
        next(error)
    }
}))


module.exports = AuthorRoute

function removeTmp(filePath) {
    fs.unlink(filePath, err => {
      if (err) throw err;
    });
  }