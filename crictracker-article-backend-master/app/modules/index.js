const { gql } = require('graphql-tag')
const { shield } = require('graphql-shield')
const tag = require('./Tags')
const category = require('./Categories')
const comments = require('./Comments')
const youtubes = require('./youtubes')
const common = require('./Common')
const article = require('./article')
const cms = require('./cms')
const bookmark = require('./Bookmarks')
const clap = require('./Claps')
const gallery = require('./gallery')
const favourites = require('./favourites')
const liveBlogs = require('./liveBlogs')
// const poll = require('./poll')

const Mutation = {
  ...tag.resolvers.Mutation,
  ...category.resolvers.Mutation,
  ...article.resolvers.Mutation,
  ...comments.resolvers.Mutation,
  ...youtubes.resolvers.Mutation,
  ...bookmark.resolvers.Mutation,
  ...clap.resolvers.Mutation,
  ...favourites.resolvers.Mutation,
  ...cms.resolvers.Mutation,
  ...common.resolvers.Mutation,
  ...gallery.resolvers.Mutation,
  ...liveBlogs.resolvers.Mutation
  // ...poll.resolvers.Mutation
}

const Query = {
  ...tag.resolvers.Query,
  ...category.resolvers.Query,
  ...comments.resolvers.Query,
  ...article.resolvers.Query,
  ...youtubes.resolvers.Query,
  ...bookmark.resolvers.Query,
  ...clap.resolvers.Query,
  ...common.resolvers.Query,
  ...cms.resolvers.Query,
  ...favourites.resolvers.Query,
  ...gallery.resolvers.Query,
  ...liveBlogs.resolvers.Query
  // ...poll.resolvers.Query
}

const permissions = shield({
  Mutation: { ...tag.permissions.Mutation, ...category.permissions.Mutation, ...article.permissions.Mutation, ...comments.permissions.Mutation, ...youtubes.permissions.Mutation, ...bookmark.permissions.Mutation, ...clap.permissions.Mutation, ...cms.permissions.Mutation, ...favourites.permissions.Mutation, ...liveBlogs.permissions.Mutation },
  Query: { ...tag.permissions.Query, ...category.permissions.Query, ...comments.permissions.Query, ...article.permissions.Query, ...youtubes.permissions.Query, ...bookmark.permissions.Query, ...clap.permissions.Query, ...cms.permissions.Query, ...favourites.permissions.Query, ...common.permissions.Query, ...liveBlogs.permissions.Query }
})

const resolvers = { Mutation, Query, tagGetData: tag.resolvers.tagGetData, tagData: tag.resolvers.tagData, categoryGetData: category.resolvers.categoryGetData, Article: article.resolvers.Article, listArticles: article.resolvers.listArticles, comment: comments.resolvers.comment, Comment: article.resolvers.Comment, FrontArticle: article.resolvers.FrontArticle, oSimpleCategory: category.resolvers.oSimpleCategory, oSeriesCategory: category.resolvers.oSeriesCategory, oTournamentCategory: category.resolvers.oTournamentCategory, ParentCategory: category.resolvers.ParentCategory, oCategoryFront: category.resolvers.oCategoryFront, oParentCategoryFront: category.resolvers.oParentCategoryFront, frontComment: comments.resolvers.frontComment, oTagDataFront: tag.resolvers.oTagDataFront, oVideoData: youtubes.resolvers.oVideoData, oPlaylistData: youtubes.resolvers.oPlaylistData, oFavourite: favourites.resolvers.oFavourite, oCategoryVideo: youtubes.resolvers.oCategoryVideo, oCmsData: cms.resolvers.oCmsData, oSeriesMiniScorecard: category.resolvers.oSeriesMiniScorecard, oEditTagData: tag.resolvers.oEditTagData, bookmark: bookmark.resolvers.bookmark, oCategoryDetail: category.resolvers.oCategoryDetail, oImageData: gallery.resolvers.oImageData, Date: common.resolvers.Date, articleTakeOverResponse: article.resolvers.articleTakeOverResponse, getHomePage: article.resolvers.getHomePage, blogEvent: liveBlogs.resolvers.blogEvent, liveBlogContent: liveBlogs.resolvers.liveBlogContent }

const typeDefs = gql`
  extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.3",
              import: [{ name: "@key"}, { name: "@external" }, { name: "@shareable" }])
  scalar Date
  ${tag.typeDefs}
  ${category.typeDefs}
  ${article.typeDefs}
  ${comments.typeDefs}
  ${youtubes.typeDefs}
  ${bookmark.typeDefs}
  ${common.typeDefs}
  ${cms.typeDefs}
  ${clap.typeDefs}
  ${favourites.typeDefs}
  ${gallery.typeDefs}
  ${liveBlogs.typeDefs}
`

module.exports = { typeDefs, resolvers, permissions }
