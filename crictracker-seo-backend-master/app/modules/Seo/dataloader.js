const DataLoader = require('dataloader')
const { SeoModel } = require('../../model')
const _ = require('../../../global')

/*

 here i Created closure for creating dataLoader for seo ref resolver. here i use closure because i need to pass info object into data loader function
 for fetching selected fields only. if we found better way to do this we can improve code complexity.
*/

function createSeoDataLoader() {
  let dataLoader

  async function getSeosById(aSeoId, info) {
    const selections = { ..._.extractSelection(info?.fieldNodes[0]?.selectionSet), iId: 1 }
    delete selections.__typename

    const seos = await SeoModel.find({ iId: { $in: aSeoId }, eType: { $ne: 'cu' }, eSubType: null }, selections).lean()
    const aCustomSeo = await SeoModel.find({ iId: { $in: aSeoId }, $or: [{ eType: 'cu' }, { eTabType: { $exists: true } }] }, selections).lean()

    const customSeoObject = aCustomSeo.reduce((acc, seoItem) => {
      acc[seoItem.iId] = acc[seoItem.iId] ?? []
      acc[seoItem.iId].push()
      return acc
    }, {})

    const groupById = seos.reduce((acc, seo) => {
      acc[seo.iId] = acc[seo.iId] ?? {}
      if (customSeoObject[seo.iId]) Object.assign(seo, { aCustomSeo: customSeoObject[seo.iId] })
      Object.assign(acc[seo.iId], seo)
      return acc
    }, {})

    return aSeoId.map((iId) => groupById[iId])
  }

  return {
    getDataLoader: (info) => {
      if (!dataLoader) {
        dataLoader = new DataLoader((keys) => getSeosById(keys, info), { cache: false })
      }
      return dataLoader
    }
  }
}

module.exports = { createSeoDataLoader }
