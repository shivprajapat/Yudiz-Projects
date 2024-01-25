/* eslint-disable no-useless-escape */
const { contacts } = require('../../model')
const { getPaginationValues } = require('../../utils/index')
const _ = require('../../../global')
const enums = require('../../model/enums')

const controllers = {}

controllers.insertContact = async (parent, { input }, context) => {
  try {
    const { contactInput } = input
    const { sName, sEmail, sPhone, sCompany, sCity, eQueryType, sSubject, sMessage } = contactInput

    if (!sName || !sEmail || !sPhone || !eQueryType || !sSubject || !sMessage) _.throwError('requiredField', context)

    if (sEmail && _.isEmail(sEmail)) _.throwError('invalidEmail', context)

    if (sPhone.length !== 10) _.throwError('invalidNumber', context)

    const insertContactQuery = { sName, sEmail, sPhone, sCompany, sCity, eQueryType, sSubject, sMessage }

    const contact = await contacts.create(insertContactQuery)

    // const quryTypeLable = (eQueryType === 'g' ? 'General Issue' : 'Technical Issue')
    // For now comment mail code, I will impliment in future
    // await queuePush('sendMail', {
    //   eType: 'contact',
    //   sEmail: "test31qa1947@gmail.com",
    //   sName, sPhone, sCompany, sCity, quryTypeLable, sSubject, sMessage
    // })
    return _.resolve('contactUs', { oData: contact }, null, context)
  } catch (error) {
    return error
  }
}

controllers.getContacts = async (parent, { input }, context) => {
  try {
    const { eQueryType, aState } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    const query = {
      $or: [
        { sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sEmail: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sSubject: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: { $in: aState }
    }
    if (eQueryType) {
      query.eQueryType = { $in: eQueryType }
    } else {
      query.eQueryType = { $in: enums.eContactQueryType.value }
    }

    const nTotal = await contacts.countDocuments(query)
    const aResults = await contacts.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getContactById = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)
    const contact = await contacts.findById(input._id).lean()
    if (!contact) _.throwError('notFound', context, 'contact')

    if (contact.eStatus === 'ur') await contacts.updateOne({ _id: _.mongify(contact?._id) }, { eStatus: 'r' })

    return contact
  } catch (error) {
    return error
  }
}

controllers.deleteContact = async (parent, { input }, context) => {
  try {
    const { _id } = input
    if (!input) _.throwError('requiredField', context)
    const contact = await contacts.updateOne({ _id: _.mongify(_id) }, { eStatus: 'd' })
    if (!contact.modifiedCount) return _.resolve('alreadyDeleted', null, 'contact', context)
    return _.resolve('deleteSuccess', null, 'contact', context)
  } catch (error) {
    return error
  }
}

controllers.bulkContactDelete = async (parent, { input }, context) => {
  try {
    const { aId } = input
    const ids = aId.map(id => _.mongify(id))
    const contact = await contacts.updateMany({ _id: ids }, { eStatus: 'd' })
    if (!contact.modifiedCount) _.throwError('notFound', context, 'contact')
    return _.resolve('deleteSuccess', null, 'contacts', context)
  } catch (error) {
    return error
  }
}

controllers.getContactQueryType = async (parent, { input }, context) => {
  try {
    const type = [{
      sValue: 'g',
      sLabel: 'General Query'
    }, {
      sValue: 't',
      sLabel: 'Technical Query'
    },
    {
      sValue: 'ad',
      sLabel: 'Advertisement Query'
    },
    {
      sValue: 'ct',
      sLabel: 'Content Query'
    }]
    return type
  } catch (error) {
    return error
  }
}

module.exports = controllers
