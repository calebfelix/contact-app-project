const express = require('express')
const { userRouter } = require("./user")
const {contactRouter} = require('./contact')
const { login } = require('./user/controller/User')

const mainRouter = express.Router()

// login
mainRouter.post('/login', login)

mainRouter.use('/admin', userRouter)
mainRouter.use('/user/:userId/contact', contactRouter)

module.exports = { mainRouter }