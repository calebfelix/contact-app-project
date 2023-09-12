const { ValidationError } = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const Contact = require("../../contact/service/Contact");
const User = require("../service/User");
require('dotenv').config()

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token =  User.authenticateUser(username, password);
    res.cookie(process.env.AUTH_COOKIE_NAME, await token);
    res.status(200).send("Login Done");
  } catch (error) {
    next(error);
  }
};

const getAllUsers = (req, resp, next) => {
  try {
    const allUsers = User.getAllUsers();
    resp.status(200).send(allUsers);
  } catch (error) {
    next(error);
  }
};

const getUserById = (req, resp, next) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ValidationError("invalid parameters");
    }
    let myUser = User.findUserById(id);
    resp.status(200).send(myUser);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, resp, next) => {
  try {
    let { firstName, lastName, username, password } = req.body;
    let newUser =  User.newUser(firstName, lastName, username, password);

    resp.status(200).send(await newUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = (req, resp, next) => {
  try {
    let { parameter, newValue } = req.body;
    let id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ValidationError("invalid parameters");
    }
    let updatedUser = User.updateUser(id, parameter, newValue);
    resp.status(200).send(updatedUser);
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
    resp.status(200).send(deletedUser);
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
