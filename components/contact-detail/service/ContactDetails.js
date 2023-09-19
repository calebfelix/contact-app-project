const { ValidationError } = require("../../../error");
const db = require("../../../models");

class ContactDetails {
  constructor(typeOfContactDetail, valueOfContactDetail, userId, contactId) {
    this.contactId = contactId;
    this.userId = userId;
    this.typeOfContactDetail = typeOfContactDetail;
    this.valueOfContactDetail = valueOfContactDetail;
  }

  static async newContactDetail(
    typeOfContactDetail,
    valueOfContactDetail,
    userId,
    contactId
  ) {
    try {
      if (typeof typeOfContactDetail != "string") {
        throw new ValidationError("invalid Contact Detail type");
      }
      if (typeof valueOfContactDetail != "string") {
        throw new ValidationError("invalid Contact Detail value");
      }
      let newContactDetail = new ContactDetails(
        typeOfContactDetail,
        valueOfContactDetail,
        userId,
        contactId
      );
      let dbContactDetail = await db.contactDetail.create(newContactDetail);
      let result = await db.contact.findAll({
        where: { id: contactId },
        include: db.contactDetail,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAllContacts(contactId) {
    try {
      let result = await db.contactDetail.findAll({
        where: { contact_id: contactId },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getContactDetailById(contactId, contactDetailId) {
    try {
      let result = await db.contactDetail.findAll({
        where: { id: contactDetailId, contact_id: contactId },
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  static async updateContactDetails(contactId, contactDetailId, type, value) {
    try {
      await db.contactDetail.update(
        { typeOfContactDetail: type },
        { where: { id: contactDetailId, contact_id: contactId } }
      );
      return await db.contactDetail.update(
        { valueOfContactDetail: value },
        { where: { id: contactDetailId, contact_id: contactId } }
      );
    } catch (error) {
      throw error;
    }
  }

  static async deleteContactDetail(contactId, contactDetailId) {
    try {
      let deleted = await db.contactDetail.destroy({
        where: { id: contactDetailId, contact_id: contactId },
      });
      return deleted;
    } catch (error) {
      return error;
    }
  }
}

module.exports = ContactDetails;
