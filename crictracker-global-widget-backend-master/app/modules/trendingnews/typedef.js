require('graphql-import-node/register')
const { gql } = require('graphql-tag')

const query = require('./schema/query.gql')

const typeDefs = gql`
    ${query}
`

module.exports = typeDefs
