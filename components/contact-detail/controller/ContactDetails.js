const { ValidationError } = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const Contact = require("../../contact/service/Contact");
const User = require("../../user/service/User");
require('dotenv').config()

const createContactDetail = (req, resp, next) => {
    try {
      let {typeOfContactDetail, valueOfContactDetail} = req.body

      const token = req.cookies[process.env.AUTH_COOKIE_NAME];
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
  
      let userId = Number(req.params.userId);
      if (isNaN(userId)) {
        throw new ValidationError("invalid userID");
      }
      let contactId = Number(req.params.contactId);
      if (isNaN(contactId)) {
        throw new ValidationError("invalid contactID");
      }
  
      let myUser = User.findUserById(Number(userId))
      let newContactDetail = myUser.createContactDetail(contactId, typeOfContactDetail, valueOfContactDetail)
      resp.status(200).send(newContactDetail);
    } catch (error) {
      next(error);
    }
  };

const getAllcontactDetails = (req, resp, next) => {
  try {

    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Token Not Found");
    }

    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userID");
    }
    let contactId = Number(req.params.contactId);
    if (isNaN(contactId)) {
      throw new ValidationError("invalid contactID");
    }

    let myUser = User.findUserById(Number(userId))
    let ContactDetails = myUser.getContactDetails(contactId)
    resp.status(200).send(ContactDetails);
  } catch (error) {
    next(error);
  }
};

const getContactDetailById = (req, resp, next) => {
  try {

    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Token Not Found");
    }

    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userID");
    }
    let contactId = Number(req.params.contactId);
    if (isNaN(contactId)) {
      throw new ValidationError("invalid contactID");
    }
    let contactDetailId = Number(req.params.contactDetailId);
    if (isNaN(contactDetailId)) {
      throw new ValidationError("invalid contactDetailID");
    }

    let myUser = User.findUserById(userId)
    let [myContact, myContactIndex] = myUser.findContactById(contactId)
    let myContactDetail = myContact.getContactDetailByDetailId(contactDetailId)

    resp.status(200).send(myContactDetail);
  } catch (error) {
    next(error);
  }
};

const updateContactDetail = (req, resp, next) => {
  try {
    let {type, value} = req.body

    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Token Not Found");
    }

    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userID");
    }
    let contactId = Number(req.params.contactId);
    if (isNaN(contactId)) {
      throw new ValidationError("invalid contactID");
    }
    let contactDetailId = Number(req.params.contactDetailId);
    if (isNaN(contactDetailId)) {
      throw new ValidationError("invalid contactDetailID");
    }

    let myUser = User.findUserById(userId)
    let myContact = myUser.updateContactDetails(contactId, contactDetailId,type,value)

    resp.status(200).send(myContact);
  } catch (error) {
    next(error);
  }
};

const deleteContactDetail = (req, resp, next) => {
  try {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Token Not Found");
    }

    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userID");
    }
    let contactId = Number(req.params.contactId);
    if (isNaN(contactId)) {
      throw new ValidationError("invalid contactID");
    }
    let contactDetailId = Number(req.params.contactDetailId);
    if (isNaN(contactDetailId)) {
      throw new ValidationError("invalid contactDetailID");
    }

    let myUser = User.findUserById(userId)
    let myContact = myUser.deleteContactDetails(contactId, contactDetailId)
    resp.status(200).send(myContact);
  } catch (error) {
    next(error);
  }
};

module.exports = { createContactDetail,getAllcontactDetails, getContactDetailById, updateContactDetail,deleteContactDetail }
