require('graphql-import-node/register')
const { gql } = require('apollo-server')

// const query = require('./schema/query.gql')
const subscription = require('./schema/subscription.gql')
// const mutation = require('./schema/mutation.gql')

const typeDefs = gql`
    ${subscription}
`

module.exports = typeDefs
