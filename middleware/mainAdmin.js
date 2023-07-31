const MainAdmin = require('../models/MainAdminModel')
const asyncHandler = require('express-async-handler')

const mainAdmin = asyncHandler(async(req, res, next) => {

    const mainadmin = await MainAdmin.findOne({
        _id: req.mainadmin.id
    })


    

    if(mainadmin.admin !== 18 ) return res.json({msg: "you are not super admin"})

    next()


})

module.exports = mainAdmin