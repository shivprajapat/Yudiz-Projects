import {
  GET_ADS_LIST
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ADS_LIST:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        adsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    default:
      return state
  }
}
