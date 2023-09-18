const { ValidationError } = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const Contact = require("../../contact/service/Contact");
const User = require("../service/User");
require('dotenv').config()

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await User.authenticateUser(username, password);
    res.cookie(process.env.AUTH_COOKIE_NAME,token);
    res.status(200).send("Login Done");
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, resp, next) => {
  try {
    const { offset, limit } = req.query;
    const allUsers = await User.getAllUsers(offset, limit);
    resp.status(200).send(allUsers);
  } catch (error) {
    next(error);
  }
};
// const getAllUsers = async (req, resp, next) => {
//   try {
//     let allUsers = await db.user.findAndCountAll();
//     resp.status(200).json(allUsers);
//   } catch (error) {
//     next(error);
//   }
// };

// const getUserById = (req, resp, next) => {
//   try {
//     let id = Number(req.params.id);
//     if (isNaN(id)) {
//       throw new ValidationError("invalid parameters");
//     }
//     let myUser = User.findUserById(id);
//     resp.status(200).send(myUser);
//   } catch (error) {
//     next(error);
//   }
// };


const getUserById = async (req, resp, next) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ValidationError("invalid parameters");
    }
    let myUser = await User.getUserById(id)
    if(myUser.length==0){
      throw new NotFoundError("User Not Found")
    }
    resp.status(200).send(myUser);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, resp, next) => {
  try {
    let { firstName, lastName, username, password } = req.body;
    if (typeof firstName != "string") {
      throw new ValidationError("invalid first Name");
    }
    if (typeof lastName != "string") {
      throw new ValidationError("invalid Last Name");
    }
    if (typeof username != "string") {
      throw new ValidationError("invalid username");
    }
    if (typeof password != "string") {
      throw new ValidationError("invalid password");
    }
    let myusers = await User.getUserByUsername(username)
    if(myusers.length!=0){
      throw new ValidationError("invalid Username user already exists")
    }
    let newUser =  await User.newUser(firstName, lastName, username, password);

    resp.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, resp, next) => {
  try {
    let { parameter, newValue } = req.body;
    let id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ValidationError("invalid id");
    }
    let updated = await User.updateUser(id, parameter, newValue)
    if(updated[0]==0){
      throw new ValidationError("could not update")
    }
    resp.status(200).json("updated");
  } catch (error) {
    next(error);
  }
};


const deleteUser = (req, resp, next) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ValidationError("invalid parameters");
    }
    let deletedUser = User.deleteUser(id);
    if(deletedUser==0){
      throw new NotFoundError("User Dosen't Exist")
    }
    resp.status(200).send("User deleted");
  } catch (error) {
    next(error);
  }
};

const createContact = (req, resp, next) => {
  try {

    let { firstName, lastName } = req.body

    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      let myUser = User.findUserById(payload.id)

    let newContact = Contact.newContact(firstName, lastName)
    myUser.contacts.push(newContact)
    // let newUser = User.newUser(firstName, lastName, username, password);

    resp.status(200).send(myUser);
  } catch (error) {
    next(error);
  }
};

const getAllcontacts = (req, resp, next) => {
  try {

    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      let myUser = User.findUserById(payload.id)

    resp.status(200).send(myUser.contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = (req, resp, next) => {
  try {
    let {id} = req.params
    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      let myUser = User.findUserById(payload.id)

      let [myContact, myContactIndex] = myUser.findContactById(id)

    resp.status(200).send(myContact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createContact,
  getAllcontacts,
  getContactById
};
