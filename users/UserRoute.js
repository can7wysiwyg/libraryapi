const UserRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verify = require('../middleware/verify')





  UserRoute.post('/userroute/register', asyncHandler(async(req, res, next) => {

    try {

        const {fullname, email, phoneNumber,  idNumber,  password} = req.body

 if(!fullname) res.json({msg: "fullname cannot be empty"})

 if(!email) res.json({msg: "email cannot be empty"})

 if(!phoneNumber) res.json({msg: "phone number cannot be empty"})

 
 if(!idNumber) res.json({msg: "id number cannot be empty"})

 
 if(!password) res.json({msg: "password cannot be empty"})


 const emailExists = await  User.findOne({ email });

    if (emailExists) {
      res.json({ msg: "The email exists, please user another one or login" });
    }

    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    
      
    
      
        await User.create({
          fullname,
          email,
          phoneNumber,
          idNumber,
          password: hashedPassword
        });
    
        res.json({ msg: "account created successfully created!" });
      





        
    } catch (error) {
        next(error)
    }


  }))


  UserRoute.post("/userroute/login", asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email }).select("+password");
    

    if (!userExists) {
      res.json({
        msg: "No user associated with this email exists in our system. Please register.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (passwordMatch) {
      let accesstoken = createAccessToken({id: userExists._id })
      let refreshtoken = createRefreshToken({id: userExists._id})

      res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

      jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_USER, (err, user) =>{
        if(err) return res.status(400).json({msg: "Please Login or Register"})
    
        const usertoken = createAccessToken({id: user.id})
        
    
        res.json({usertoken}) })


      
    } else {
      res.json({ msg: "check your password again" });
    } 


    
}))



UserRoute.get('/userroute/user', verify, asyncHandler(async(req, res) => {
    try{
      const user = await User.findById(req.user).select('-password')
      if(!user) return res.status(400).json({msg: "User does not exist."})
    
      res.json({user})

      
    
    
    }
      catch(err) {
        return res.status(500).json({msg: err.message})
    
    
      }
    
    
    }))


  
  
    UserRoute.post(
        "/userroute/forgot_password",
        asyncHandler(async (req, res) => {
          const { idNumber, email } = req.body;
      
          if (!idNumber || !email) {
            res.json({ msg: "fields cannot be empty." });
          }
      
          const emailFound = await User.findOne({ email });
          const idFound = await User.findOne({ idNumber });
      
        
      
      
          if (emailFound && idFound) {
            const accessToken =  createAccessToken( { id: emailFound._id })
            
            res.json({ accessToken });
          } else {
            res.json({ msg: "please contact the admin to help you in password reset." });
          }
        })
      );
      
      UserRoute.put(
        "/userroute/reset_password",
        verify,
        asyncHandler(async (req, res) => {
          const { password } = req.body;
      
          if (!password) {
            res.json({ msg: "field cannot be empty." });
          }
      
          const passwordHash = await bcrypt.hash(password, 10);
      
          await User.findOneAndUpdate(
            { _id: req.user.id },
            {
              password: passwordHash,
            }
          );
      
          res.json({ msg: "password has been succesfully updated! please log in..." });
        })
      );




UserRoute.get('/userroute/show_user/:id', asyncHandler(async(req, res, next) => {

  try {

    const{id} = req.params

    const user = await User.findById({_id: id})

    res.json({user})
    
  } catch (error) {
    next(error)
  }

}))
      
      

  const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_USER, {expiresIn: '30d'})
  }
  const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_USER, {expiresIn: '30d'})
  }



  module.exports = UserRoute
