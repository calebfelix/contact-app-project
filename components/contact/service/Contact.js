const { ValidationError} = require("../../../error");
const db = require("../../../models");

class Contact {
  constructor(firstName, lastName, userId) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  static async newContact(firstName, lastName, userId) {
    // validation
    try {
      if (typeof firstName != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof lastName != "string") {
        throw new ValidationError("invalid Last Name");
      }
      let newContact = new Contact(firstName, lastName, userId);
      let dbContact = await db.contact.create(newContact);
      let result = await db.user.findAll({
        where: { id: userId },
        include: db.contact,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAllContacts(userId) {
    try {
      let result = await db.contact.findAll({ where: { user_id: userId }, include: db.contactDetail });
      return result;
    } catch (error) {
      return error;
    }
  }

  static async getContactById(userId, contactId) {
    try {
      let result = await db.contact.findAll({
        where: { id: contactId, user_id: userId },
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  static async updateContact(parameter, newValue, userId, contactId) {
    try {
      switch (parameter) {
        case "firstName":
          return await db.contact.update(
            { firstName: newValue },
            { where: { id: contactId, user_id: userId } }
          );
        case "lastName":
          return await db.contact.update(
            { lastName: newValue },
            { where: { id: contactId, user_id: userId } }
          );
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      throw error;
    }
  }

  static async deleteContact(userId, contactId) {
    try {
      let deleted = await db.contact.destroy({
        where: { id: contactId, user_id: userId },
      });
      return deleted;
    } catch (error) {
      return error;
    }
  }
}

module.exports = Contact;
