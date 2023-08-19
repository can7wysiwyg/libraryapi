const AdminRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Admin = require("../models/AdminModel")
const User = require('../models/UserModel')
const Librarian = require('../models/LibrarianModel')
const cloudinary = require('cloudinary').v2
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const fs = require('fs')
const verifyMainAdmin = require('../middleware/verifyMainAdmin')
const mainAdmin = require('../middleware/mainAdmin')
const verifyAdmin = require("../middleware/verifyAdmin");
const authAdmin = require('../middleware/authAdmin')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  

AdminRoute.post('/admin/register', verifyMainAdmin, mainAdmin, asyncHandler(async(req, res, next) => {

try {

    const {uniqueName, email, password } = req.body

    if(!uniqueName) res.json({msg: "unique name cannot be blank.."})

    if(!email) res.json({msg: "email cannot be blank.."})

    if(!password) res.json({msg: "password cannot be blank.."})


    const emailExists = await  Admin.findOne({ email });

    if (emailExists) {
      res.json({ msg: "The email exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    
        await Admin.create({
          uniqueName,
          email,
          password: hashedPassword
        });
    
        res.json({ msg: "Librarian account created successfully created!" });
      


    
} catch (error) {
    next(error)
}

}))

AdminRoute.get('/admin/show_to_main', verifyMainAdmin, mainAdmin, asyncHandler(async(req, res, next) => {
  try {
    const result = await Admin.find()

    res.json({result})
    
  } catch (error) {
    next(error)
  }
}))


AdminRoute.post("/admin/login", asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const userExists = await Admin.findOne({ email }).select("+password");
    

    if (!userExists) {
      res.json({
        msg: "this email is not associated with any admin.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (passwordMatch) {
      
      let refreshtoken = createRefreshToken({id: userExists._id})

      res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

      jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_ADMIN, (err, admin) =>{
        if(err) return res.status(400).json({msg: "Email the admin for help.."})
    
        const accesstoken = createAccessToken({id: admin.id})
        
    
        res.json({accesstoken}) })


      
    } else {
      res.json({ msg: "check your password again" });
    } 


    
}))


AdminRoute.get('/admin/user',verifyAdmin, asyncHandler(async(req, res) => {
  try{
    const admin = await Admin.findById(req.admin).select('-password')
    if(!admin) return res.status(400).json({msg: "this admin does not exist d does not exist."})
  
    res.json(admin)
  
  
  
  
  }
    catch(err) {
      return res.status(500).json({msg: err.message})
  
  
    }
  
  
  }))

  AdminRoute.post('/admin/update_info', verifyAdmin, asyncHandler(async(req, res, next) => {
    try {

      const {fullname, personalEmail, home, phoneNumber, gender} = req.body

      if(!fullname) res.json({msg: "fullname cannot be empty"})

      if(!personalEmail) res.json({msg: "personal email cannot be empty"})

      if(!home) res.json({msg: "home cannot be empty"})

      if(!phoneNumber) res.json({msg: "phone number cannot be empty"})

      if(!gender) res.json({msg: "gender cannot be empty"})


      if (!req.files || !req.files.librarianImage) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
    
    
      const file = req.files.librarianImage;
    
      cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'libraryImages',
        width: 150,
        height: 150,
        crop: "fill"
      }, async (err, result) => {
        if (err) {
          console.error("Error uploading user image:", err);
          return res.status(500).json({ msg: "Failed to upload user image" });
        }
    
        removeTmp(file.tempFilePath);

await Librarian.create({
  fullname,
  personalEmail,
  home,
  phoneNumber,
  gender,
  librarianImage: result.secure_url


})


res.json({msg: "successfully entered your information. You Will be logged out as we will be reviewing your info. "})
    });


      
    } catch (error) {
      next(error)
    }
  }))


  AdminRoute.get('/admin/view_librarian', asyncHandler(async(req, res, next) => {
    try {

      const result = await Librarian.find()

      res.json({result})
      
    } catch (error) {
      next(error)
    }
  }))



AdminRoute.put('/admin/update_member_status/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

try {
    const {id} = req.params

    await User.findByIdAndUpdate(id, req.body, {new: true})

    res.json({msg: "user's role has been updated.."})

    
} catch (error) {
    next(error)
}

}))


AdminRoute.delete('/admin/delete_member/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {

        const {id} = req.params

        await User.findByIdAndDelete(id)

        res.json({msg: "user has been successfully deleted..."})
        
    } catch (error) {
        next(error)
    }

}))



AdminRoute.get('/admin/viewws', verifyAdmin, authAdmin, asyncHandler(async(req, res) => {

  res.json({msg: "total freedom"})
}))


const createAccessToken = (admin) =>{
    return jwt.sign(admin, process.env.ACCESS_TOKEN_ADMIN, {expiresIn: '14d'})
  }
  const createRefreshToken = (admin) =>{
    return jwt.sign(admin, process.env.REFRESH_TOKEN_ADMIN, {expiresIn: '14d'})
  }


module.exports = AdminRoute


function removeTmp(filePath) {
    fs.unlink(filePath, err => {
      if (err) throw err;
    });
  }