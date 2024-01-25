require('graphql-import-node/register')
const { gql } = require('graphql-tag')

const query = require('./schema/query.gql')
const mutation = require('./schema/mutation.gql')

const typeDefs = gql`
    ${mutation},
    ${query},
`

module.exports = typeDefs
