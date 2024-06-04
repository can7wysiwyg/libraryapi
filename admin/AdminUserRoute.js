const AdminUserRoute = require('express').Router()
const User = require('../models/UserModel')
const asyncHandler = require('express-async-handler')
const authAdmin = require('../middleware/authAdmin')
const verifyAdmin = require('../middleware/verifyAdmin')


AdminUserRoute.get('/adminuser/show_users', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {

        const users = await User.find().sort({_id: -1})


        res.json({users})

        
    } catch (error) {
        next(error)
    }

}))



AdminUserRoute.get('/adminuser/show_user/:id', verifyAdmin, authAdmin, asyncHandler(async(req, res, next) => {

    try {

        const {id} = req.params

        const user = await User.findById({_id: id})


        res.json({user})

        
    } catch (error) {
        next(error)
    }

}))





module.exports = AdminUserRoute