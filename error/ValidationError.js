const ContactAppError = require("./ContactAppError");
let { StatusCodes } = require("http-status-codes");

class ValidationError extends ContactAppError {
  constructor(specificMessage) {
    super(
      "Invalid Parameters",
      "Validation Error",
      StatusCodes.BAD_REQUEST,
      specificMessage
    );
  }
}

module.exports = ValidationError;
