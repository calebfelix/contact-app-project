const express = require('express')
const { userRouter } = require("./user")
const {contactRouter} = require('./contact')
const User = require('./user/service/User')

const mainRouter = express.Router()

// login
mainRouter.post('/login', async(req, res, next)=>{
    try {
        const { username, password } = req.body;
        const token =  User.authenticateUser(username, password);
        res.cookie(process.env.AUTH_COOKIE_NAME, await token);
        res.status(200).send("Login Done");
      } catch (error) {
        next(error);
      }
})

mainRouter.use('/admin', userRouter)
mainRouter.use('/user/:userId/contact', contactRouter)

// logout
mainRouter.post('/logout', async(req, res, next)=>{
    try {
        res.cookie(process.env.AUTH_COOKIE_NAME, "", {expires: new Date(Date.now())});
        res.status(200).send("Logged out");
      } catch (error) {
        next(error);
      }
  })

module.exports = { mainRouter }