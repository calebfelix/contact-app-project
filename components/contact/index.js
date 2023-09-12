const express = require('express')
const Jwtauthentication = require('../../middleware/Jwtauthentication')
const { createContact, getAllcontacts, getContactById, updateContact, deleteContact } = require('../contact/controller/Contact')
const { contactDetailRouter } = require('../contact-detail')

const contactRouter = express.Router({ mergeParams: true })
contactRouter.use(Jwtauthentication.isUser)
contactRouter.use(Jwtauthentication.isActive)

// User CRUD
contactRouter.post('/', createContact)
contactRouter.get('/', getAllcontacts)
contactRouter.get('/:contactId', getContactById)
contactRouter.put('/:contactId', updateContact)
contactRouter.delete('/:contactId', deleteContact)

contactRouter.use('/:contactId/contactdetail', contactDetailRouter)

module.exports = {contactRouter}