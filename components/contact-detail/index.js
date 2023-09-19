const express = require('express')
const Jwtauthentication = require('../../middleware/Jwtauthentication')
const { createContactDetail,getAllcontactDetails, getContactDetailById,updateContactDetail,deleteContactDetail} = require('../contact-detail/controller/ContactDetails')

const contactDetailRouter = express.Router({ mergeParams: true })
contactDetailRouter.use(Jwtauthentication.isUser)
contactDetailRouter.use(Jwtauthentication.isCurrentUserContactId)

contactDetailRouter.post('/', createContactDetail)
contactDetailRouter.get('/', getAllcontactDetails)
contactDetailRouter.get('/:contactDetailId', getContactDetailById)
contactDetailRouter.put('/:contactDetailId', updateContactDetail)
contactDetailRouter.delete('/:contactDetailId', deleteContactDetail)

module.exports = {contactDetailRouter}