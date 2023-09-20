const { ValidationError } = require("../../../error");
const db = require("../../../models");

class Contact {
  constructor(firstName, lastName, userId) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  static async newContact(firstName, lastName, userId) {
    const t = await db.sequelize.transaction();
    // validation
    try {
      if (typeof firstName != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof lastName != "string") {
        throw new ValidationError("invalid Last Name");
      }
      let newContact = new Contact(firstName, lastName, userId);
      let dbContact = await db.contact.create(newContact,t);
      let result = await db.user.findAll({
        where: { id: userId },
        include: db.contact,
        transaction: t,
      });
      await t.commit()
      return result;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async getAllContacts(userId) {
    const t = await db.sequelize.transaction();
    try {
      let result = await db.contact.findAll({
        where: { user_id: userId },
        include: db.contactDetail,
        transaction: t,
      });
      await t.commit()
      return result;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async getContactById(userId, contactId) {
    const t = await db.sequelize.transaction();
    try {
      let result = await db.contact.findAll({
        where: { id: contactId, user_id: userId },
        include: db.contactDetail,
        transaction: t,
      });
      await t.commit()
      return result;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async updateContact(parameter, newValue, userId, contactId) {
    const t = await db.sequelize.transaction();
    try {
      let up = undefined
      switch (parameter) {
        case "firstName":
          up = await db.contact.update(
            { firstName: newValue },
            { where: { id: contactId, user_id: userId }, transaction: t}
          );
          await t.commit()
          return up
        case "lastName":
          up = await db.contact.update(
            { lastName: newValue },
            { where: { id: contactId, user_id: userId },transaction: t, }
          );
          await t.commit()
          return up
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async deleteContact(userId, contactId) {
    const t = await db.sequelize.transaction();
    try {
      let deleted = await db.contact.destroy({
        where: { id: contactId, user_id: userId },
        transaction: t,
      });
      await t.commit()
      return deleted;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }
}

module.exports = Contact;
