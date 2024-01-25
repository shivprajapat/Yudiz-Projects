const { getMigrationTags, updateMigrationTag, bulkMigrationTagUpdate, updateMigrationTagType, getMigrationTagType, getMigrationTagDocs, getMigrationCounts, clearList } = require('./controllers')

const Mutation = {
  updateMigrationTag,
  bulkMigrationTagUpdate,
  updateMigrationTagType,
  clearList
}

const Query = {
  getMigrationTags,
  getMigrationTagType,
  getMigrationTagDocs,
  getMigrationCounts
}

const resolvers = { Mutation, Query }

module.exports = resolvers
