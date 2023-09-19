const { ValidationError } = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const Contact = require("../../contact/service/Contact");
const User = require("../../user/service/User");
require("dotenv").config();

const createContact = async (req, resp, next) => {
  try {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Token Not Found");
    }

    let { firstName, lastName } = req.body;
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid parameters");
    }

    let [myUser] = await User.getUserById(userId);
    let newContact = await Contact.newContact(
      firstName,
      lastName,
      myUser.dataValues.id
    );

    resp.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

const getAllcontacts = async (req, resp, next) => {
  try {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Token Not Found");
    }
    let payload = Jwtauthentication.verifyToken(token);
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid parameters");
    }
    let result = await Contact.getAllContacts(userId);
    resp.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, resp, next) => {
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

    let myContact = await Contact.getContactById(userId, contactId);
    resp.status(200).send(myContact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, resp, next) => {
  try {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedError("Token Not Found");
    }

    let { parameter, newValue } = req.body;

    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid UserId");
    }

    let contactId = Number(req.params.contactId);
    if (isNaN(contactId)) {
      throw new ValidationError("invalid contactId");
    }

    let [updated] = await Contact.updateContact(
      parameter,
      newValue,
      userId,
      contactId
    );
    if (updated == 0) {
      throw new ValidationError("could not update");
    }
    resp.status(200).json("updated");
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

    let deleted = Contact.deleteContact(userId, contactId);
    if (deleted == 0) {
      throw new NotFoundError("Contact Dosen't Exist");
    }
    resp.status(200).send("Contact deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getAllcontacts,
  getContactById,
  updateContact,
  deleteContact,
};
