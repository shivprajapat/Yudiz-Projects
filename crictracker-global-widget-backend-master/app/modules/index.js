const { gql } = require('graphql-tag')
const { shield } = require('graphql-shield')
const menu = require('./menu')
const ranking = require('./ranking')
const footer = require('./footer')
const cricspecial = require('./cricspecial')
const trendingnews = require('./trendingnews')
const popularseries = require('./popularseries')
const homeWidgets = require('./home-widgets')
const sliders = require('./sliders')
const common = require('./Common')
const homepagePriority = require('./homepagepriority')
const setting = require('../modules/settings')
const miniScoreCardPriority = require('./miniscorecardpriority')
const poll = require('../modules/poll')

const Mutation = {
  ...menu.resolvers.Mutation,
  ...footer.resolvers.Mutation,
  ...popularseries.resolvers.Mutation,
  ...sliders.resolvers.Mutation,
  ...homepagePriority.resolvers.Mutation,
  ...miniScoreCardPriority.resolvers.Mutation,
  ...poll.resolvers.Mutation,
  ...homeWidgets.resolvers.Mutation
}

const Query = {
  ...menu.resolvers.Query,
  ...ranking.resolvers.Query,
  ...footer.resolvers.Query,
  ...cricspecial.resolvers.Query,
  ...trendingnews.resolvers.Query,
  ...popularseries.resolvers.Query,
  ...homeWidgets.resolvers.Query,
  ...sliders.resolvers.Query,
  ...homepagePriority.resolvers.Query,
  ...setting.resolvers.Query,
  ...miniScoreCardPriority.resolvers.Query,
  ...miniScoreCardPriority.resolvers.Query,
  ...poll.resolvers.Query
}

const resolvers = { Mutation, Query, Cricspecial: cricspecial.resolvers.Cricspecial, TrendingNews: trendingnews.resolvers.TrendingNews, oCurrentSeriesData: popularseries.resolvers.oCurrentSeriesData, aResultType: homeWidgets.resolvers.aResultType, Date: common.resolvers.Date, poll: poll.resolvers.poll }

const permissions = shield({
  Mutation: { ...menu.permissions.Mutation, ...footer.permissions.Mutation, ...sliders.permissions.Mutation, ...popularseries.permissions.Mutation, ...homepagePriority.permissions.Mutation, ...poll.permissions.Mutation },
  Query: { ...popularseries.permissions.Query, ...homepagePriority.permissions.Query, ...poll.permissions.Query }
})

const typeDefs = gql`
  extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.3",
              import: [{ name: "@key"}, { name: "@external" }, { name: "@shareable" }])

  scalar Date

  ${menu.typeDefs}
  ${ranking.typeDefs}
  ${footer.typeDefs}
  ${cricspecial.typeDefs}
  ${trendingnews.typeDefs}
  ${popularseries.typeDefs}
  ${homeWidgets.typeDefs}
  ${sliders.typeDefs}
  ${homepagePriority.typeDefs}
  ${setting.typeDefs}
  ${miniScoreCardPriority.typeDefs}
  ${poll.typeDefs}
`
module.exports = { typeDefs, resolvers, permissions }
