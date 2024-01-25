require('graphql-import-node/register')
const { gql } = require('graphql-tag')

const query = require('./schema/query.gql')
const mutations = require('./schema/mutation.gql')

const typeDefs = gql`
    ${query}
    ${mutations}
`

module.exports = typeDefs
