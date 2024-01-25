require('graphql-import-node/register')

const { gql } = require('graphql-tag')

const mutation = require('./schema/mutation.gql')

const typeDefs = gql`
    ${mutation}
`

module.exports = typeDefs
