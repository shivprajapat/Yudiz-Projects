const { getPlaylists, getVideos, listSeriesVideos, bulkPlaylistUpdate, updatePlaylist, getSingleVideo, listSimpleCategoryVideos, listCategoryRelatedVideos, getVideoSearch, topPlaylists, listCategoryWiseVideo, listWithoutCategoryVideo, getTrendingVideos, getHomePageVideo, getVideoByPlaylist, getPlaylistByIdFront } = require('./controllers')

const Mutation = {
  bulkPlaylistUpdate,
  updatePlaylist
}

const Query = {
  getVideos,
  getPlaylists,
  listSeriesVideos,
  listSimpleCategoryVideos,
  getSingleVideo,
  listCategoryRelatedVideos,
  getVideoSearch,
  topPlaylists,
  listCategoryWiseVideo,
  listWithoutCategoryVideo,
  getTrendingVideos,
  getHomePageVideo,
  getVideoByPlaylist,
  getPlaylistByIdFront
}

const oVideoData = {
  oSeo: (video) => {
    return { __typename: 'Seo', iId: video._id }
  }
}

const oPlaylistData = {
  oSeo: (playlist) => {
    if (playlist.iCategoryId) {
      return { __typename: 'Seo', iId: playlist.iCategoryId }
    } else {
      return { __typename: 'Seo', iId: playlist._id }
    }
  }
}

const oCategoryVideo = {
  oSeo: (category) => {
    if (category._id) {
      return { __typename: 'Seo', iId: category._id }
    } else {
      return { __typename: 'Seo', iId: category.iPlaylistId }
    }
  }
}

const resolvers = { Mutation, Query, oVideoData, oPlaylistData, oCategoryVideo }

module.exports = resolvers
