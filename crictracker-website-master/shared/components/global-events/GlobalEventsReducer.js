export default (stateGlobalEvents = {}, action) => {
  switch (action.type) {
    case 'CHANGE_PROFILE':
      return {
        ...stateGlobalEvents,
        profileData: action.payload.profileData
      }
    case 'CHANGE_FAVOURITE':
      return {
        ...stateGlobalEvents,
        favouriteData: action.payload.favouriteData
      }
    case 'HOME_ARTICLE_UPDATE':
      return {
        ...stateGlobalEvents,
        homeArticle: action.payload.homeArticle
      }
    case 'MATCH_LIVE_INNING_DATA':
      return {
        ...stateGlobalEvents,
        liveInning: action.payload.liveInning
      }
    default:
      return stateGlobalEvents
  }
}
