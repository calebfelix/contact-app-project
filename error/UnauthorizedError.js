const ContactAppError = require("./ContactAppError");
let { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends ContactAppError {
  constructor(specificMessage) {
    super(
      "Unauthorized",
      "Unauthorized Error",
      StatusCodes.UNAUTHORIZED,
      specificMessage
    );
  }
}

module.exports = UnauthorizedError;
