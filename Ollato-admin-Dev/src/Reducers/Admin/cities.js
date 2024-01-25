import constants from '../../Shared/Types/constants'

/* initial state */
const initialCityState = {
  resStatus: null,
  resMessage: null,
  isCityAdded: null,
  cityList: null,
  cityCount: null,
  isCityEdited: false,
  isDeleted: null,
  resData: {},
  isLoading: false
}

export default (state = initialCityState, action) => {
  switch (action.type) {
    case constants.ADD_CITY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCityAdded: action.payload.isCityAdded
      }
    case constants.CLEAR_ADD_CITY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCityAdded: null
      }
    case constants.GET_ALL_CITY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        cityList: action.payload.cityList,
        cityCount: action.payload.cityCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_CITY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        cityCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_CITY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_CITY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_CITY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCityEdited: action.payload.isCityEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_CITY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCityEdited: null
      }
    case constants.DELETE_CITY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_CITY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    default:
      return state
  }
}
