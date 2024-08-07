const MainAdminRoute = require('express').Router()
const MainAdmin = require('../models/MainAdminModel')
const Admin = require('../models/AdminModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const verifyMainAdmin = require('../middleware/verifyMainAdmin')
const mainAdmin = require('../middleware/mainAdmin')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });


  MainAdminRoute.post('/mainadmin/register', asyncHandler(async(req, res, next) => {

    try {
        const {fullname, email, password} = req.body

        if(!fullname) res.json({msg: "fullname cannot be empty.."})

        if(!email) res.json({msg: "email cannot be empty..."})

        if(!password) res.json({msg: "password cannot be empty.."})


        const emailExists = await  MainAdmin.findOne({ email });

    if (emailExists) {
      res.json({ msg: "The email exists, please user another one or login" });
    }

    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    
      
      
        await MainAdmin.create({
          fullname,
          email,
          password: hashedPassword
        });
    
        res.json({ msg: "Admin account created successfully created!" });
    
    } catch (error) {
        next(error)
    }

  }))


  MainAdminRoute.post("/mainadmin/login", asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const userExists = await MainAdmin.findOne({ email }).select("+password");
    

    if (!userExists) {
      res.json({
        msg: "this email is not associated with any admin.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (passwordMatch) {
      
      let refreshtoken = createRefreshToken({id: userExists._id})

      res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

      jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_MAIN_ADMIN, (err, mainadmin) =>{
        if(err) return res.status(400).json({msg: "Email the admin for help.."})
    
        const supertoken = createAccessToken({id: mainadmin.id})
        
    
        res.json({supertoken}) })


      
    } else {
      res.json({ msg: "check your password again" });
    } 


    
}))


MainAdminRoute.get('/mainadmin/mainadmin', verifyMainAdmin, asyncHandler(async(req, res) => {
  try{
    const mainadmin = await MainAdmin.findById(req.super).select('-password')
    if(!mainadmin) return res.status(400).json({msg: "this admin does not exist d does not exist."})
  
    res.json({mainadmin})
  
  
  
  
  }
    catch(err) {
      return res.status(500).json({msg: err.message})
  
  
    }
  
  
  }))




  // make librarian routes

MainAdminRoute.post('/mainadmin/create_librarian', verifyMainAdmin, mainAdmin,  asyncHandler(async(req, res, next) => {

  try {
  
      const {fullname, home, phoneNumber, uniqueName, email, password } = req.body
  
      if(!uniqueName) res.json({msg: "unique name cannot be blank.."})
  
      if(!email) res.json({msg: "email cannot be blank.."})
  
      if(!password) res.json({msg: "password cannot be blank.."})

      if(!fullname) res.json({msg: "name cannot be empty"})  

       if(!home) res.json({msg: "home address  cannot be empty"})  

      if(!phoneNumber) res.json({msg: "phone number  cannot be empty"})  
  
  

      
  
  
      const emailExists = await  Admin.findOne({ email });
  
      if (emailExists) {
        res.json({ msg: "The email exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    
      

      
        await Admin.create({
          fullname,
          email,
          uniqueName,
          phoneNumber,
          home,
          password: hashedPassword
        });
    
        res.json({ msg: "Admin account created successfully created!" });
    
    
          
  
  
      
  } catch (error) {
      next(error)
  }
  
  }))
  
  MainAdminRoute.get('/mainadmin/show_to_main', verifyMainAdmin, mainAdmin, asyncHandler(async(req, res, next) => {
    try {
      const result = await Admin.find()
  
      res.json({result})
      
    } catch (error) {
      next(error)
    }
  }))



  

MainAdminRoute.put('/mainadmin/make_admin/:id', verifyMainAdmin, mainAdmin, asyncHandler(async(req, res, next) => {

    try {

        const {id} = req.params
       
        if(!id) res.json({msg: "user cannot be empty..."})

        await Admin.findByIdAndUpdate(id, req.body, {new: true} )

        res.json({msg: "admin status has successfully been changed"})



        
    } catch (error) {
        next(error)
    }


}))


MainAdminRoute.put('/mainadmin/suspend_admin/:id', verifyMainAdmin, mainAdmin, asyncHandler(async(req, res, next) => {

    try {
        
 const {id} = req.params

 if(!id) res.json({msg: "no admin has been selected"})


 await Admin.findByIdAndUpdate(id, req.body, {new: true})

 res.json({msg: "admin account status has been successfully updated"})



    } catch (error) {
        next(error)
    }

}))


MainAdminRoute.delete('/mainadmin/delete_admin/:id', verifyMainAdmin, mainAdmin, asyncHandler(async(req, res, next) => {
    try {
        const {id} = req.params

        if(!id) res.json({msg: "admin has not been selected"})

        await Admin.findByIdAndDelete(id)
        
    } catch (error) {
        next(error)
    }
}))


  



 
  const createAccessToken = (admin) =>{
    return jwt.sign(admin, process.env.ACCESS_TOKEN_MAIN_ADMIN, {expiresIn: '14d'})
  }
  const createRefreshToken = (admin) =>{
    return jwt.sign(admin, process.env.REFRESH_TOKEN_MAIN_ADMIN, {expiresIn: '14d'})
  }




module.exports = MainAdminRoute

function removeTmp(filePath) {
    fs.unlink(filePath, err => {
      if (err) throw err;
    });
  }