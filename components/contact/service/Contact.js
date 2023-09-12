const ContactDetails = require("../../contact-detail/service/ContactDetails");
const { ValidationError,NotFoundError } = require("../../../error");

class Contact {
  static id = 0;
  constructor(firstName, lastName) {
    this.id = Contact.id++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = true;
    this.contactDetails = [];
  }

  static newContact(firstName, lastName) {
    // validation
    try {
      if (typeof firstName != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof lastName != "string") {
        throw new ValidationError("invalid Last Name");
      }
      let newContact = new Contact(firstName, lastName);
      return newContact
    } catch (error) {
      throw error;
    }
  }
  getContactDetailsById(contactDetailId){
    for (let index = 0; index < this.contactDetails.length; index++) {
      if (contactDetailId == this.contactDetails[index].id) {
        return [this.contactDetails[index], index];
      }
    }
    return [null,-1];
  }

  getContactDetailByDetailId(contactDetailId){
    for (let index = 0; index < this.contactDetails.length; index++) {
      if (contactDetailId == this.contactDetails[index].id) {
        return [this.contactDetails[index], index];
      }
    }
    return [null,-1];
  }

  deleteContactDetail(index){
    return this.contactDetails.splice(index, 1)
  }

  UpdateContactFirstName(newValue) {
    try {
      if (typeof newValue != "string") {
        throw new ValidationError("Invalid First Name");
      }
      this.firstName = newValue;
    } catch (error) {
      throw error;
    }
  }

  UpdateContactLastName(newValue) {
    try {
      if (typeof newValue != "string") {
        throw new ValidationError("Invalid Last Name");
      }
      this.lastName = newValue;
    } catch (error) {
      throw error;
    }
  }

  updateContact(parameter, newValue) {
    try {
      switch (parameter) {
        case "firstName":
          this.UpdateContactFirstName(newValue);
          return this;
        case "lastName":
          this.UpdateContactLastName(newValue);
          return this;
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      throw error;
    }
  }

  createContactDetail(typeOfContactDetail, valueOfContactDetail) {
    let newContactDetail = ContactDetails.newContactDetail(
      typeOfContactDetail,
      valueOfContactDetail
    );
    this.contactDetails.push(newContactDetail);
  }

  getContactDetails(){
    return this.contactDetails
  }
}

module.exports = Contact;
