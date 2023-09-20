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
    const t = await db.sequelize.transaction();
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
      let dbContactDetail = await db.contactDetail.create(newContactDetail,t);
      let result = await db.contact.findAll({
        where: { id: contactId },
        include: db.contactDetail,
        transaction:t
      });
      await t.commit()
      return result;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async getAllContacts(contactId) {
    const t = await db.sequelize.transaction();
    try {
      let result = await db.contactDetail.findAll({
        where: { contact_id: contactId },
        transaction: t
      });
      await t.commit()
      return result;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async getContactDetailById(contactId, contactDetailId) {
    const t = await db.sequelize.transaction();
    try {
      let result = await db.contactDetail.findAll({
        where: { id: contactDetailId, contact_id: contactId },
        transaction:t
      });
      await t.commit()
      return result;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async updateContactDetails(contactId, contactDetailId, type, value) {
    const t = await db.sequelize.transaction();
    try {
      let [myType] = await db.contactDetail.update(
        { typeOfContactDetail: type },
        { where: { id: contactDetailId, contact_id: contactId },transaction:t}
      );
      let [myValue] = await db.contactDetail.update(
        { valueOfContactDetail: value },
        { where: { id: contactDetailId, contact_id: contactId },transaction:t}
      );
      if(myType==0 && myValue==0){
        return [0]
      }
      await t.commit()
      return[1]
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async deleteContactDetail(contactId, contactDetailId) {
    const t = await db.sequelize.transaction();
    try {
      let deleted = await db.contactDetail.destroy({
        where: { id: contactDetailId, contact_id: contactId },
        transaction:t
      });
      await t.commit()
      return deleted;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }
}

module.exports = ContactDetails;
