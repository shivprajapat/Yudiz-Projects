const authorServices = require('./services')
// const { body } = require('express-validator')

module.exports = (router) => {
  router.get('/author/migrate', authorServices.Authors.migrateAuthors)
  router.get('/author/update/counts', authorServices.Authors.updateArticleViewCount)
}
