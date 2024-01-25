require('graphql-import-node/register')
const { gql } = require('apollo-server')

const query = require('./schema/query.gql')

const typeDefs = gql`
    ${query}
`

module.exports = typeDefs
