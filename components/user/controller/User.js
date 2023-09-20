const { ValidationError, NotFoundError } = require("../../../error");
const User = require("../service/User");
require("dotenv").config();

const getAllUsers = async (req, resp, next) => {
  try {
    const { offset, limit } = req.query;
    const allUsers = await User.getAllUsers(offset, limit);
    resp.status(200).send(allUsers);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, resp, next) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ValidationError("invalid parameters");
    }
    let myUser = await User.getUserById(id);
    if (myUser.length == 0) {
      throw new NotFoundError("User Not Found");
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
    let myusers = await User.getUserByUsername(username);
    if (myusers.length != 0) {
      throw new ValidationError("invalid Username user already exists");
    }
    let newUser = await User.newUser(firstName, lastName, username, password);

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
    let updated = await User.updateUser(id, parameter, newValue);
    if (updated[0] == 0) {
      throw new ValidationError("could not update");
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
    if (deletedUser == 0) {
      throw new NotFoundError("User Dosen't Exist");
    }
    resp.status(200).send("User deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
