const { ValidationError } = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const Contact = require("../../contact/service/Contact");
const User = require("../../user/service/User");
require('dotenv').config()


const createContact = (req, resp, next) => {
  try {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Token Not Found");
    }

    let { firstName, lastName } = req.body
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid parameters");
    }

    let myUser = User.findUserById(Number(userId))
    let newContact = Contact.newContact(firstName, lastName)

    myUser.contacts.push(newContact)
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
    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Token Not Found");
    }

    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid UserId");
    }

    let contactId = Number(req.params.contactId);
    if (isNaN(contactId)) {
      throw new ValidationError("invalid contactId");
    }
    
    let myUser = User.findUserById(userId)
    
    let [myContact, myContactIndex] = myUser.findContactById(contactId)
    resp.status(200).send(myContact);
  } catch (error) {
    next(error);
  }
};

const updateContact = (req, resp, next) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME];
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }

      let {parameter, newValue} = req.body
  
      let userId = Number(req.params.userId);
      if (isNaN(userId)) {
        throw new ValidationError("invalid UserId");
      }
  
      let contactId = Number(req.params.contactId);
      if (isNaN(contactId)) {
        throw new ValidationError("invalid contactId");
      }
      
      let myUser = User.findUserById(userId)
      let [myContact, myContactIndex] = myUser.findContactById(contactId)
      
      // let [myContact, myContactIndex] = User.findContactById(contactId)
    //   console.log(myContact)
      // let specificContact = myUser.contacts[myContactIndex]
      myContact.updateContact(parameter, newValue)
      resp.status(200).send(myContact);
    } catch (error) {
      next(error);
    }
  };

  const deleteContact = (req, resp, next) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME];
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
  
      let userId = Number(req.params.userId);
      if (isNaN(userId)) {
        throw new ValidationError("invalid UserId");
      }
  
      let contactId = Number(req.params.contactId);
      if (isNaN(contactId)) {
        throw new ValidationError("invalid contactId");
      }
      
      let myUser = User.findUserById(userId)
      let [myContact, myContactIndex] = myUser.findContactById(contactId)
      
      myContact.isActive = false
      resp.status(200).send(myContact);
    } catch (error) {
      next(error);
    }
  };

module.exports = { createContact, getAllcontacts, getContactById, updateContact,deleteContact};
