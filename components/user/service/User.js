const { NotFoundError, ValidationError, UnauthorizedError } = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const Contact = require('../../contact/service/Contact')
const bcrypt = require('bcrypt');
const db = require("../../../models");

class User {
  // static id = 0;
  static allUsers = [];
  constructor(firstName, lastName, isAdmin, username, password) {
    // this.id = User.id++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = true;
    this.isAdmin = isAdmin;
    this.contacts = [];
    this.username = username
    this.password = password

  }

  getContacts(){
    return this.contacts
  }

  static async getUserByUsername(username){
    try {
      let myUsers = await db.user.findAll({where: {username: username}});
      return myUsers
    } catch (error) {
      throw error
    }
  }

  static async getUserById(id){
    try {
      let myUser = await db.user.findAll({where: {id: id}});
      return myUser
    } catch (error) {
      throw error
    }
  }

  static findUserByUsername(username) {
    try {
      for (let index = 0; index < User.allUsers.length; index++) {
        if (User.allUsers[index].username === username) {
          let foundObject = User.allUsers[index];
          return foundObject;
        }
      }
      
      throw new NotFoundError("User Not Found");
    } catch (error) {
      throw error;
    }
  }

  static findUser(userId) {
    for (let index = 0; index < User.allUsers.length; index++) {
      if (userId === User.allUsers[index].id) {
        return User.allUsers[index];
      }
    }
    return null;
  }

  static findUserById(id) {
    try {
      for (let index = 0; index < User.allUsers.length; index++) {
        if (User.allUsers[index].id === id) {
          let foundObject = User.allUsers[index];
          return foundObject;
        }
      }
      throw new NotFoundError("Not Found");
    } catch (error) {
      throw error;
    }
  }

  findContactById(id) {
    try {
      for (let index = 0; index < this.contacts.length; index++) {
        if (this.contacts[index].id === id) {
          let foundObject = this.contacts[index];
          return [foundObject, index];
        }
      }
      throw new NotFoundError("Not Found");
    } catch (error) {
      throw error;
    }
  }

  findContact(contactId) {
    for (let index = 0; index < this.contacts.length; index++) {
      if (contactId == this.contacts[index].id) {
        return [this.contacts[index], index];
      }
    }
    return [null, -1];
  }

  updateFirstName(newValue) {
    try {
      if (typeof newValue != "string") {
        throw new ValidationError("Invalid First Name");
      }
      this.firstName = newValue;
    } catch (error) {
      throw error;
    }
  }

  updateLastName(newValue) {
    try {
      if (typeof newValue != "string") {
        throw new ValidationError("Invalid Last Name");
      }
      this.lastName = newValue;
    } catch (error) {
      throw error;
    }
  }

  /// CREATE user///
  static async newAdmin(firstName, lastName, username, password) {
    // validation check
    try {
      if (typeof firstName != "string") {
        throw new ValidationError("invalid First Name")
      }
      if (typeof lastName != "string") {
        throw new ValidationError("invalid Last Name");
      }

      let hashedPassword = bcrypt.hash(password, 12)
// console.log(await hashedPassword)
      let newAdmin = new User(firstName, lastName, true, username, await hashedPassword);
      // let newUser = User.allUsers.push(newAdmin);
      let dbAdmin = await db.user.create(newAdmin)
      return dbAdmin;
    } catch (error) {
      return error// TODO;
    }
  }

  static async newUser(firstName, lastName, username, password) {
    // validation
    try {
      let hashedPassword = await bcrypt.hash(password, 12)
      let newUser = new User(firstName, lastName, false, username, hashedPassword);
      let dbUser = await db.user.create(newUser)
      // User.allUsers.push(newUser);
      return dbUser;
    } catch (error) {
      return error// TODO;
    }
  }

  /// READ user///
  static async getAllUsers(offset, limit) {
    try {
      let allUsers = await db.user.findAndCountAll({
        include: db.contact,
        offset: offset,
        limit:  limit
      })
      return allUsers
    } catch (error) {
      return error
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
          return await db.user.update({ firstName: newValue }, {where: { id: id }});
        case "LastName":
          return await db.user.update({ lastName: newValue }, {where: { id: id }});
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      return error
    }
  }

  /// DELETE user///
  static async deleteUser(id) {
    try {
      let deleted = await db.user.destroy({
        where: {
          id: id
        }
      });
      return deleted;
    } catch (error) {
      return error
    }
  }

  /// CREATE contact///
  createContact(firstName, lastName) {
    try {
      // if (!this.isActive) {
      //   throw new NotFoundError("User Dosen't exist");
      // }
      // if (this.isAdmin) {
      //   throw new UnauthorizedError("Admin Cannot create contact");
      // }

      let newContact = Contact.newContact(firstName, lastName);
      this.contacts.push(newContact);
      return newContact;
    } catch (error) {
      return error// TODO;
    }
  }

  /// READ contact///
  getAllContacts() {
    try {
      if (!this.isActive) {
        throw new NotFoundError("User Dosen't exist");
      }
      if (this.isAdmin) {
        throw new UnauthorizedError("Admin Cannot get contact");
      }
      return this.contacts;
    } catch (error) {
      return error// TODO;
    }
  }

  /// UPDATE contact///
  updateContact(id, parameter, newValue) {
    try {
      if (!this.isActive) {
        throw new NotFoundError("User Dosen't exist");
      }
      if (this.isAdmin) {
        throw new UnauthorizedError("Admin Cannot update contact");
      }
      let [contactToBeUpdated, contactIndex] = this.findContact(id);
      if (contactToBeUpdated == null) {
        throw new NotFoundError("Contact Not Found");
      }
      return contactToBeUpdated.updateContact(parameter, newValue);
    } catch (error) {
      return error// TODO;
    }
  }

  /// DELETE contact///
  deleteContact(id) {
    try {
      if (this.isAdmin) {
        throw new UnauthorizedError("Admin cannot delete contact");
      }
      let [contactToBeDeleted, contactIndex] = this.findContact(id);
      contactToBeDeleted.isActive = false;
      return contactToBeDeleted;
    } catch (error) {
      return error// TODO;
    }
  }

  /// CREATE contact Details///
  createContactDetail(contactId, typeOfContactDetail, valueOfContactDetail) {
    try {
      // if (!this.isActive) {
      //   throw new NotFoundError("Contact Detail Dosen't exist");
      // }
      // if (this.isAdmin) {
      //   throw new UnauthorizedError("Admin Cannot create contact Detail");
      // }
      let [contactDetailContact, contactIndex] = this.findContact(contactId);

      if (contactDetailContact == null) {
        throw new NotFoundError("Contact Not Found");
      }
      contactDetailContact.createContactDetail(
        typeOfContactDetail,
        valueOfContactDetail
      );
      return contactDetailContact;
    } catch (error) {
      return error// TODO;
    }
  }

  /// READ contact Details///
  getContactDetails(contactId) {
    try {
      let [contactDetailsToFetch, contactIndex] = this.findContact(contactId);
      if (!this.isActive) {
        throw new NotFoundError("User Dosen't exist");
      }
      if (this.isAdmin) {
        throw new UnauthorizedError("Admin Cannot get contact");
      }
      if (typeof contactId != "number") {
        throw new ValidationError("Invalid Id");
      }
      if (contactDetailsToFetch == null) {
        throw new NotFoundError("Contact Not Found!");
      }
      return contactDetailsToFetch.getContactDetails();
    } catch (error) {
      return error// TODO;
    }
  }

  /// UPDATE contact Details///
  updateContactDetails(contactId, contactDetailId, type, value) {
    try {
      // if (!this.isActive) {
        // throw new NotFoundError("User Dosen't exist");
      // }
      // if (this.isAdmin) {
        // throw new UnauthorizedError("Admin Cannot update contact details");
      // }
      let [contactDetailToBeUpdated, contactIndex] =
        this.findContact(contactId);
      if (contactDetailToBeUpdated == null) {
        throw new NotFoundError("Contact Not Found");
      }
      if (typeof contactDetailId != "number") {
        throw new ValidationError("invalid new Value");
      }
      let [contactDetailToBeUpdatedDetailById, index] =
        contactDetailToBeUpdated.getContactDetailsById(contactDetailId);
      if (contactDetailToBeUpdatedDetailById == null) {
        throw new NotFoundError("Contact Detail Not Found");
      }
      contactDetailToBeUpdatedDetailById.updateContactDetailWithNewValue(
        type,
        value
      );
      return contactDetailToBeUpdatedDetailById;
    } catch (error) {
      return error// TODO;
    }
  }

  /// DELETE contact Details///
  deleteContactDetails(contactId, contactDetailId) {
    try {
      if (!this.isActive) {
        throw new NotFoundError("User Dosen't exist");
      }
      if (this.isAdmin) {
        throw new UnauthorizedError("Admin Cannot update contact details");
      }
      let [contactDetailToBeDeleted, contactIndex] =
        this.findContact(contactId);
      if (contactDetailToBeDeleted == null) {
        throw new NotFoundError("Contact Not Found");
      }
      if (typeof contactId != "number") {
        throw new ValidationError("invalid Contact ID");
      }
      if (typeof contactDetailId != "number") {
        throw new ValidationError("invalid Contact Detail ID");
      }
      let [contactDetailToBeDeletedDetailById, detailIndex] =
        contactDetailToBeDeleted.getContactDetailsById(contactDetailId);
      if (contactDetailToBeDeletedDetailById == null) {
        throw new NotFoundError("Contact Detail Not Found");
      }
      let contactDetailToBeDeletedDetailByIndex =
        this.contacts[contactIndex].deleteContactDetail(detailIndex);
      return this.contacts;
    } catch (error) {
      return error// TODO;
    }
  }

  static async authenticateUser(username, password) {
    try {
    let [myUserdb] =await User.getUserByUsername(username);
    let myUser = myUserdb.dataValues
    let check = await bcrypt.compare(password, myUser.password)
    // console.log(check)
    if (!check) {
      throw new UnauthorizedError("authentication failed");
    }
      const token = Jwtauthentication.authenticate(myUser.id, myUser.username, myUser.isAdmin, myUser.isActive)
      return token
    } catch (error) {
      throw error
    }

  }
}

module.exports = User;

let admin = User.newAdmin("caleb", "felix", "admin", "password")
let user1 = User.newUser("u1", "u1","u1", "password")
let user2 = User.newUser("u2", "u2","u2", "password")