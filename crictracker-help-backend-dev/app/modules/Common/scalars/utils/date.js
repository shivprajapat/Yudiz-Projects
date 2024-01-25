const moment = require('moment')
const { GraphQLScalarType, Kind } = require('graphql')

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return new Date(value).getTime() // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return moment(value) // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)) // Convert hard-coded AST string to integer and then to Date
    }
    return null // Invalid hard-coded value (not an integer)
  }
})

module.exports = DateScalar
