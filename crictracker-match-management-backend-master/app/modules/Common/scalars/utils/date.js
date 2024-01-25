const { GraphQLScalarType, Kind } = require('graphql')

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return new Date(new Date(value).getUTCFullYear(),
      new Date(value).getUTCMonth(),
      new Date(value).getUTCDate(),
      new Date(value).getUTCHours(),
      new Date(value).getUTCMinutes(),
      new Date(value).getUTCSeconds()).getTime() // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value) // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)) // Convert hard-coded AST string to integer and then to Date
    }
    return null // Invalid hard-coded value (not an integer)
  }
})

module.exports = DateScalar
