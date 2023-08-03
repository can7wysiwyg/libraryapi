const CardRoute = require('express').Router()
const Card = require('../models/CardModel')
const asyncHandler = require('express-async-handler')
const verifyMaidAdmin = require('../middleware/verifyMainAdmin')
const mainAdmin = require('../middleware/mainAdmin')



module.exports = CardRoute
