const { gql } = require('graphql-tag')
const { shield } = require('graphql-shield')
const match = require('./match')
const series = require('./series')
const fantasyArticle = require('./fantasy-article')
const tags = require('./tags')
const commentaries = require('./commentaries')
const over = require('./overs')
const userComments = require('./user-comments')
const common = require('./Common')

const Mutation = {
  ...match.resolvers.Mutation,
  ...fantasyArticle.resolvers.Mutation,
  ...tags.resolvers.Mutation,
  ...commentaries.resolvers.Mutation,
  ...over.resolvers.Mutation,
  ...userComments.resolvers.Mutation,
  ...common.resolvers.Mutations
}

const Query = {
  ...match.resolvers.Query,
  ...series.resolvers.Query,
  ...fantasyArticle.resolvers.Query,
  ...tags.resolvers.Query,
  ...commentaries.resolvers.Query,
  ...over.resolvers.Query,
  ...userComments.resolvers.Query,
  ...common.resolvers.Query
}

const resolvers = {
  Query,
  Mutation,
  oFetchSeries: match.resolvers.oFetchSeries,
  FantasyArticleShort: match.resolvers.FantasyArticleShort,
  FantasyArticle: fantasyArticle.resolvers.FantasyArticle,
  oPlayer: match.resolvers.oPlayer,
  oTeams: match.resolvers.oTeams,
  FantasyArticleComment: fantasyArticle.resolvers.FantasyArticleComment,
  seriesSquadPlayer: match.resolvers.seriesSquadPlayer,
  oMatchDetailsFront: match.resolvers.oMatchDetailsFront,
  oAllFixtures: match.resolvers.oAllFixtures,
  oFixuresData: match.resolvers.oFixuresData,
  MiniScorecard: match.resolvers.MiniScorecard,
  oPlayerFront: match.resolvers.oPlayerFront,
  oTeamFront: match.resolvers.oTeamFront,
  oFantasyArticleFront: fantasyArticle.resolvers.oFantasyArticleFront,
  oFantasyMatchOverview: fantasyArticle.resolvers.oFantasyMatchOverview,
  frontFantasyArticle: fantasyArticle.resolvers.frontFantasyArticle,
  oListMatchFantasyTips: fantasyArticle.resolvers.oListMatchFantasyTips,
  oShortFantasyTips: fantasyArticle.resolvers.oShortFantasyTips,
  oCricPrediction: fantasyArticle.resolvers.oCricPrediction,
  oGetFantasyTipsFrontResponse: fantasyArticle.resolvers.oGetFantasyTipsFrontResponse,
  oFrontPlayer: fantasyArticle.resolvers.oFrontPlayer,
  oOngoingSeriesType: series.resolvers.oOngoingSeriesType,
  oShortTeam: match.resolvers.oShortTeam,
  oShortPlayer: match.resolvers.oShortPlayer,
  oShortVenue: match.resolvers.oShortVenue,
  oShortMatch: match.resolvers.oShortMatch,
  comment: userComments.resolvers.comment,
  frontFantasyComment: userComments.resolvers.frontFantasyComment,
  oShortSeries: match.resolvers.oShortSeries,
  oFixtureSeriesType: series.resolvers.oFixtureSeriesType,
  oFantasyComment: userComments.resolvers.oFantasyComment,
  oPlayerDetails: match.resolvers.oPlayerDetails,
  oFetchSeriesFront: series.resolvers.oFetchSeriesFront,
  LiveInningPlayer: match.resolvers.LiveInningPlayer,
  LiveInningTeam: match.resolvers.LiveInningTeam,
  Date: common.resolvers.Date,
  LiveInningSeries: match.resolvers.LiveInningSeries,
  fantasyArticleList: fantasyArticle.resolvers.fantasyArticleList
}

const permissions = shield({
  Mutation: { ...tags.permissions.Mutation, ...fantasyArticle.permissions.Mutation, ...common.permission.Mutation },
  Query: { ...fantasyArticle.permissions.Query, ...tags.permissions.Query }
})

const typeDefs = gql`
  extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.3",
              import: [{ name: "@key"}, { name: "@external" }, { name: "@shareable" }])

  scalar Date

  ${match.typeDefs}
  ${series.typeDefs}
  ${fantasyArticle.typeDefs}
  ${tags.typeDefs}
  ${commentaries.typeDefs}
  ${over.typeDefs}
  ${userComments.typeDefs}
  ${common.typeDefs}
`

module.exports = { typeDefs, resolvers, permissions }
