const ContactAppError = require("../error/ContactAppError")

const errorHandler = (error, req, resp, next) => {
    console.log(error)
    if (error instanceof ContactAppError) {
        resp.status(error.httpStatusCode).send(error)
        return
    }
    resp.status(500).send("Internal Server Error")
}
module.exports = { errorHandler }