const { wptags: WPTagsModel, players: PlayersModel, teams: TeamsModel, venues: VenuesModel, wptagcounts: CountsModel } = require('../../../models-routes-services/models/index')
const { getPaginationValues, updateCounts } = require('../../utils/index')
const _ = require('../../../global')
const { eMigrationType } = require('../../../models-routes-services/enums')
const controllers = {}

controllers.getMigrationTagType = (parent, { input }, context) => _.resolve('fetchSuccess', { oData: eMigrationType.value }, 'tagType', context)

controllers.getMigrationTagDocs = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const { nSkip, nLimit, sSearch } = getPaginationValues(input)

    const data = await WPTagsModel.findById(_id, { aDocuments: 1, eType: 1 }).lean()
    if (!data) _.throwError('notFound', context, 'migrateData')

    const oData = {}
    if (data.eType === 'player') {
      if (!data.aDocuments.length) {
        oData.nCount = await PlayersModel.countDocuments({ sFullName: new RegExp(`^.*${sSearch}.*`, 'i') })
        oData.oPlayerTag = await PlayersModel.find({ sFullName: new RegExp(`^.*${sSearch}.*`, 'i') }).skip(nSkip).limit(nLimit).lean()
      } else {
        oData.nCount = data.aDocuments.filter(doc => doc.sFullName.match(new RegExp(`^${sSearch}`, 'i'))).length
        oData.oPlayerTag = data.aDocuments.filter(doc => doc.sFullName.match(new RegExp(`^${sSearch}`, 'i'))).slice(nSkip).slice(0, nLimit)
      }
    } else if (data.eType === 'team') {
      if (!data.aDocuments.length) {
        oData.nCount = await TeamsModel.countDocuments({ sTitle: new RegExp(`^.*${sSearch}.*`, 'i') })
        oData.oTeamTag = await TeamsModel.find({ sTitle: new RegExp(`^.*${sSearch}.*`, 'i') }).skip(nSkip).limit(nLimit).lean()
      } else {
        oData.nCount = data.aDocuments.filter(doc => doc.sTitle.match(new RegExp(`^${sSearch}`, 'i'))).length
        oData.oTeamTag = data.aDocuments.filter(doc => doc.sTitle.match(new RegExp(`^${sSearch}`, 'i'))).slice(nSkip).slice(0, nLimit)
      }
    } else if (data.eType === 'venue') {
      if (!data.aDocuments.length) {
        oData.nCount = await VenuesModel.countDocuments({ sName: new RegExp(`^.*${sSearch}.*`, 'i') })
        oData.oVenueTag = await VenuesModel.find({ sName: new RegExp(`^.*${sSearch}.*`, 'i') }).skip(nSkip).limit(nLimit).lean()
      } else {
        oData.nCount = data.aDocuments.filter(doc => doc.sName.match(new RegExp(`^${sSearch}`, 'i'))).length
        oData.oVenueTag = data.aDocuments.filter(doc => doc.sName.match(new RegExp(`^${sSearch}`, 'i'))).slice(nSkip).slice(0, nLimit)
      }
    } else {
      oData.oSimpleTag = data.aDocuments
    }

    return _.resolve('success', oData, 'migrateData', context)
  } catch (error) {
    return error
  }
}

controllers.getMigrationTags = async (parent, { input }, context) => {
  try {
    const { bIsAssigned = false, eType } = input
    const { nSkip, nLimit, oSorting, sSearch } = getPaginationValues(input)

    const aType = !eType ? eMigrationType.value : [eType]

    const query = { bIsAssigned, eStatus: 'a', eType: { $in: aType } }

    if (sSearch) Object.assign(query, { name: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } })

    const nTotal = await WPTagsModel.countDocuments(query)

    const aResults = await WPTagsModel.find(query, { dCreated: 1, dUpdated: 1, eType: 1, iId: 1, sAssignedName: 1, eStatus: 1, aDocuments: 1, sName: '$name', iTermId: '$term_id', sSlug: '$slug', iTermTaxonomyId: '$term_taxonomy_id', nCount: '$count', sTaxonomy: '$taxonomy', sDescription: '$description' }).sort(oSorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults, eType: eMigrationType.value }
  } catch (error) {
    return error
  }
}

controllers.updateMigrationTagType = async (parent, { input }, context) => {
  try {
    const { eType, iTermId } = input

    const data = await WPTagsModel.findOne({ term_id: iTermId }).lean()
    if (!data) _.throwError('notFound', context, 'migrateData')

    if (data.eType === eType) _.throwError('alreadyExists', context, 'migrateData')

    const oData = await updateMigrateTags(data, eType)

    const obj = { oData }
    if (eType === 'player') {
      obj.oPlayerTag = oData.aDocuments
    } else if (eType === 'team') {
      obj.oTeamTag = oData.aDocuments
    } else if (eType === 'venue') {
      obj.oVenueTag = oData.aDocuments
    } else {
      obj.oSimpleTag = oData.aDocuments
    }

    return _.resolve('changeSuccess', obj, 'tagType', context)
  } catch (error) {
    return error
  }
}

controllers.updateMigrationTag = async (parent, { input }, context) => {
  try {
    const { _id, iId } = input

    const isExist = await WPTagsModel.findOne({ _id }, { aDocuments: 1, eType: 1 }).lean()

    const oAssignDoc = isExist.aDocuments.find(doc => doc._id.toString() === iId.toString())

    const updateObj = { iId, bIsAssigned: true }
    if (isExist.eType === 'player') {
      const player = await PlayersModel.findById(iId, { sFullName: 1 }).lean()
      updateObj.sAssignedName = !oAssignDoc?.sFullName ? player?.sFullName : oAssignDoc?.sFullName
    } else if (isExist.eType === 'team') {
      const team = await TeamsModel.findById(iId, { sTitle: 1 }).lean()
      updateObj.sAssignedName = !oAssignDoc?.sTitle ? team?.sTitle : oAssignDoc?.sTitle
    } else if (isExist.eType === 'venue') {
      const venue = await VenuesModel.findById(iId, { sName: 1 }).lean()
      updateObj.sAssignedName = !oAssignDoc?.sName ? venue?.sName : oAssignDoc?.sName
    } else {
      updateObj.aDocuments = []
      updateObj.eType = 'simple'
      updateObj.iId = null
      updateObj.bIsAssigned = false
    }

    const data = await WPTagsModel.findOneAndUpdate({ _id }, updateObj, { new: true }).lean()
    const { name: sName, term_id: iTermId } = data
    const oData = { ...data, sName, iTermId }

    return _.resolve('assignedSuccess', { oData }, 'tag', context)
  } catch (error) {
    return error
  }
}

controllers.bulkMigrationTagUpdate = async (parent, { input }, context) => {
  try {
    let { aId } = input

    aId = aId.map(id => _.mongify(id))

    const data = await WPTagsModel.updateMany({ _id: { $in: aId } }, { eStatus: 'd' })
    if (!data.modifiedCount) _.throwError('notFound', context, 'migrateData')

    return _.resolve('updateSuccess', null, 'migrateData', context)
  } catch (error) {
    return error
  }
}

const updateMigrateTags = async (payload, eType) => {
  return new Promise((resolve, reject) => {
    (async (payload, eType) => {
      try {
        const data = payload
        if (data.eType !== eType) {
          let Model, fieldName
          if (eType === 'player') {
            Model = PlayersModel
            fieldName = 'sFullName'
          } else if (eType === 'team') {
            Model = TeamsModel
            fieldName = 'sTitle'
          } else if (eType === 'venue') {
            Model = VenuesModel
            fieldName = 'sName'
          }

          if (['player', 'team', 'venue'].includes(eType)) {
            const filters = { $and: [] }
            if (data.name) {
              filters.$and.push({
                $or: [
                  { [`${fieldName}`]: { $regex: new RegExp('^.*' + data.name + '.*', 'i') } }
                ]
              })
            }

            const dataExact = await Model.findOne({ [`${fieldName}`]: new RegExp(`^${data.name}$`, 'i') })
            const dataMulti = await Model.aggregate([{ $match: filters }])

            if (dataExact) {
              const aData = []
              if (dataExact[`${fieldName}`].toLowerCase().includes(data.name.toLowerCase())) {
                aData.push(dataExact)
              }

              if (aData.length) {
                const updateObj = { aDocuments: aData, eType }
                if (aData.length === 1) {
                  updateObj.iId = dataExact._id
                  updateObj.sAssignedName = dataExact[`${fieldName}`]
                  updateObj.bIsAssigned = true
                  updateObj.aDocuments = []
                } else {
                  updateObj.iId = null
                  updateObj.bIsAssigned = false
                }
                const newTags = await WPTagsModel.findByIdAndUpdate(data._id, updateObj, { new: true }).lean()
                const { description: sDescription, slug: sSlug, name: sName, term_id: iTermId, term_taxonomy_id: iTermTaxonomyId, count: nCount, taxonomy: sTaxonomy } = newTags
                resolve({ ...newTags, sDescription, sTaxonomy, iTermTaxonomyId, sName, nCount, iTermId, sSlug })
              }
            } else if (dataMulti.length) {
              const aPlayers = []
              dataMulti.forEach(el => {
                if (el[`${fieldName}`].toLowerCase().split(' ').includes(data.name.toLowerCase())) {
                  aPlayers.push(el)
                }
              })

              if (aPlayers.length) {
                const updateObj = { aDocuments: aPlayers, eType }
                if (aPlayers.length === 1) {
                  updateObj.iId = aPlayers[0]._id
                  updateObj.sAssignedName = aPlayers[0][`${fieldName}`]
                  updateObj.bIsAssigned = true
                  updateObj.aDocuments = []
                } else {
                  updateObj.iId = null
                  updateObj.bIsAssigned = false
                }
                const newTagsMulti = await WPTagsModel.findByIdAndUpdate(data._id, updateObj, { new: true }).lean()
                const { description: sDescription, slug: sSlug, name: sName, term_id: iTermId, term_taxonomy_id: iTermTaxonomyId, count: nCount, taxonomy: sTaxonomy } = newTagsMulti
                resolve({ ...newTagsMulti, sDescription, sTaxonomy, iTermTaxonomyId, sName, nCount, iTermId, sSlug })
              } else {
                const updateObj = { aDocuments: [], eType, iId: null, bIsAssigned: false }
                const newTags = await WPTagsModel.findByIdAndUpdate(data._id, updateObj, { new: true }).lean()
                const { description: sDescription, slug: sSlug, name: sName, term_id: iTermId, term_taxonomy_id: iTermTaxonomyId, count: nCount, taxonomy: sTaxonomy } = newTags
                resolve({ ...newTags, sDescription, sTaxonomy, iTermTaxonomyId, sName, nCount, iTermId, sSlug })
              }
            } else {
              const updateObj = { aDocuments: [], eType, iId: null, bIsAssigned: false }
              const newTags = await WPTagsModel.findByIdAndUpdate(data._id, updateObj, { new: true }).lean()
              const { description: sDescription, slug: sSlug, name: sName, term_id: iTermId, term_taxonomy_id: iTermTaxonomyId, count: nCount, taxonomy: sTaxonomy } = newTags
              resolve({ ...newTags, sDescription, sTaxonomy, iTermTaxonomyId, sName, nCount, iTermId, sSlug })
            }
          } else {
            const updateObj = { aDocuments: [], eType, iId: null, bIsAssigned: false }
            const newTags = await WPTagsModel.findByIdAndUpdate(data._id, updateObj, { new: true }).lean()
            const { description: sDescription, slug: sSlug, name: sName, term_id: iTermId, term_taxonomy_id: iTermTaxonomyId, count: nCount, taxonomy: sTaxonomy } = newTags
            resolve({ ...newTags, sDescription, sTaxonomy, iTermTaxonomyId, sName, nCount, iTermId, sSlug })
          }
        }
      } catch (error) { reject(error) }
    })(payload, eType)
  })
}

controllers.getMigrationCounts = async (parent, { input }, context) => {
  try {
    updateCounts()
    const { eType } = input

    const res = await CountsModel.findOne({ eType }).lean()
    return res
  } catch (error) {
    return error
  }
}

controllers.clearList = async (parent, { input }, context) => {
  try {
    await WPTagsModel.updateOne({ _id: input._id }, { aDocuments: [] })

    return _.resolve('updateSuccess', null, 'migrateData', context)
  } catch (error) {
    console.log(error)
    return error
  }
}
module.exports = controllers
