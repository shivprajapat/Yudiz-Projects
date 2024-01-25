const categoryServices = require('./services')
const { updateSeries, updateRedirection } = require('../common')

module.exports = (router) => {
  router.put('/dump-category', categoryServices.dumpCategorySQLToMongo)
  router.put('/category-seo', categoryServices.getCategorySeo)
  router.put('/series-slug', updateSeries)
  router.put('/series-redirection', updateRedirection)
}
