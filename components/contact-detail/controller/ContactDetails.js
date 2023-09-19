const { ValidationError, NotFoundError } = require("../../../error");
const ContactDetails = require("../service/ContactDetails");
require("dotenv").config();

const createContactDetail = async (req, resp, next) => {
  try {
    let { typeOfContactDetail, valueOfContactDetail } = req.body;

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

    let newContactDetail = await ContactDetails.newContactDetail(
      typeOfContactDetail,
      valueOfContactDetail,
      userId,
      contactId
    );
    resp.status(201).send(newContactDetail);
  } catch (error) {
    next(error);
  }
};

const getAllcontactDetails = async (req, resp, next) => {
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
    let result = await ContactDetails.getAllContacts(contactId);
    resp.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

const getContactDetailById = async (req, resp, next) => {
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

    let result = await ContactDetails.getContactDetailById(
      contactId,
      contactDetailId
    );

    resp.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

const updateContactDetail = async (req, resp, next) => {
  try {
    let { type, value } = req.body;

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

    let [myContactDetail] = await ContactDetails.updateContactDetails(
      contactId,
      contactDetailId,
      type,
      value
    );
    if (myContactDetail == 0) {
      throw new ValidationError("not updated");
    }

    resp.status(200).send("Contact Detail updated");
  } catch (error) {
    next(error);
  }
};

const deleteContactDetail = async (req, resp, next) => {
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

    let deleted = await ContactDetails.deleteContactDetail(
      contactId,
      contactDetailId
    );
    if (deleted == 0) {
      throw new NotFoundError("Contact Dosen't Exist");
    }
    resp.status(200).json("contact Detail deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContactDetail,
  getAllcontactDetails,
  getContactDetailById,
  updateContactDetail,
  deleteContactDetail,
};
