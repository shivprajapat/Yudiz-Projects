const { GET_CATEGORY_DATA, CLEAR_CATEGORY_RESPONSE } = require('./action')

export const category = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_CATEGORY_DATA:
      return {
        ...state,
        categories: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_CATEGORY_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
