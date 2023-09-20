const {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const bcrypt = require("bcrypt");
const db = require("../../../models");

class User {
  static allUsers = [];
  constructor(firstName, lastName, isAdmin, username, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.isAdmin = isAdmin;
    this.contacts = [];
    this.username = username;
    this.password = password;
  }

  static async getUserByUsername(username) {
    try {
      let myUsers = await db.user.findAll({ where: { username: username } });
      return myUsers;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      let myUser = await db.user.findAll({ where: { id: id }, include: { all: true, nested: true }, });
      return myUser;
    } catch (error) {
      throw error;
    }
  }

  /// CREATE user///
  static async newAdmin(firstName, lastName, username, password) {
    // validation check
    try {
      if (typeof firstName != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof lastName != "string") {
        throw new ValidationError("invalid Last Name");
      }

      let hashedPassword = bcrypt.hash(password, 12);
      let newAdmin = new User(
        firstName,
        lastName,
        true,
        username,
        await hashedPassword
      );
      let dbAdmin = await db.user.create(newAdmin);
      return dbAdmin;
    } catch (error) {
      return error;
    }
  }

  static async newUser(firstName, lastName, username, password) {
    // validation
    try {
      let hashedPassword = await bcrypt.hash(password, 12);
      let newUser = new User(
        firstName,
        lastName,
        false,
        username,
        hashedPassword
      );
      let dbUser = await db.user.create(newUser);
      return dbUser;
    } catch (error) {
      return error;
    }
  }

  /// READ user///
  static async getAllUsers(offset, limit) {
    try {
      let allUsers = await db.user.findAndCountAll({
        include: { all: true, nested: true },
        offset: offset,
        limit: limit,
      });
      return allUsers;
    } catch (error) {
      return error;
    }
  }

  /// UPDATE user///
  static async updateUser(id, parameter, newValue) {
    try {
      let userToBeUpdated = await User.getUserById(id);
      if (userToBeUpdated.length == 0) {
        throw new NotFoundError("User Not Found!");
      }

      switch (parameter) {
        case "FirstName":
          return await db.user.update(
            { firstName: newValue },
            { where: { id: id } }
          );
        case "LastName":
          return await db.user.update(
            { lastName: newValue },
            { where: { id: id } }
          );
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      return error;
    }
  }

  /// DELETE user///
  static async deleteUser(id) {
    try {
      let deleted = await db.user.destroy({
        where: {
          id: id,
        },
      });
      return deleted;
    } catch (error) {
      return error;
    }
  }

  static async authenticateUser(username, password) {
    try {
      let [myUserdb] = await User.getUserByUsername(username);
      let myUser = myUserdb.dataValues;
      let check = await bcrypt.compare(password, myUser.password);
      if (!check) {
        throw new UnauthorizedError("authentication failed");
      }
      const token = Jwtauthentication.authenticate(
        myUser.id,
        myUser.username,
        myUser.isAdmin,
        myUser.isActive
      );
      return token;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;

// let admin = User.newAdmin("caleb", "felix", "admin", "password")
