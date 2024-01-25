export default (stateGlobalEvents = {}, action) => {
  switch (action.type) {
    case 'CHANGE_PROFILE':
      return {
        ...stateGlobalEvents,
        profileData: action.payload.profileData
      }
    case 'UPDATE_ARTICLE_COMMENT_COUNT':
      return {
        ...stateGlobalEvents,
        commentCount: action.payload.commentCount
      }
    case 'CHANGE_FAVOURITE':
      return {
        ...stateGlobalEvents,
        favouriteData: action.payload.favouriteData
      }
    case 'SERIES_MINI_SCORE_CARD_DATA':
      return {
        ...stateGlobalEvents,
        seriesMiniScoreCardData: action.payload.seriesMiniScoreCardData
      }
    default:
      return stateGlobalEvents
  }
}
