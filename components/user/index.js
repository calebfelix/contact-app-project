const express = require('express')
const Jwtauthentication = require("../../middleware/Jwtauthentication")
const { getAllUsers, getUserById, createUser , updateUser, deleteUser} = require("./controller/User")


const userRouter = express.Router()

userRouter.use(Jwtauthentication.isAdmin)

// Admin CRUD
userRouter.post('/', createUser)
userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

module.exports = { userRouter }
