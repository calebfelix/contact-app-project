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
    const t = await db.sequelize.transaction();
    try {
      let myUsers = await db.user.findAll({ where: { username: username } , transaction:t});
      await t.commit()
      return myUsers;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async getUserById(id) {
    const t = await db.sequelize.transaction();
    try {
      let myUser = await db.user.findAll({ where: { id: id }, include: { all: true, nested: true }, transaction:t});
      await t.commit()
      return myUser;
    } catch (error) {
      await t.rollback()
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
    const t = await db.sequelize.transaction();
    try {
      let hashedPassword = await bcrypt.hash(password, 12);
      let newUser = new User(
        firstName,
        lastName,
        false,
        username,
        hashedPassword
      );
      let dbUser = await db.user.create(newUser,t);
      await t.commit()
      return dbUser;
    } catch (error) {
      await t.rollback()
      return error;
    }
  }

  /// READ user///
  static async getAllUsers(offset, limit) {
    const t = await db.sequelize.transaction();
    try {
      let allUsers = await db.user.findAndCountAll({
        include: { all: true, nested: true },
        offset: offset,
        limit: limit,
        transaction:t
      });
      await t.commit()
      return allUsers;
    } catch (error) {
      await t.rollback()
      return error;
    }
  }

  /// UPDATE user///
  static async updateUser(id, parameter, newValue) {
    const t = await db.sequelize.transaction();
    try {
      let userToBeUpdated = await User.getUserById(id);
      if (userToBeUpdated.length == 0) {
        throw new NotFoundError("User Not Found!");
      }
      let up = undefined

      switch (parameter) {
        case "FirstName":
          up = await db.user.update(
            { firstName: newValue },
            { where: { id: id }, transaction:t }
          );
          await t.commit()
          return up
        case "LastName":
          up = await db.user.update(
            { lastName: newValue },
            { where: { id: id }, transaction:t }
          );
          await t.commit()
          return up
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      await t.rollback()
      return error;
    }
  }

  /// DELETE user///
  static async deleteUser(id) {
    const t = await db.sequelize.transaction();
    try {
      let deleted = await db.user.destroy({
        where: {
          id: id,
        },
        transaction:t
      });
      await t.commit()
      return deleted;
    } catch (error) {
      await t.rollback()
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
