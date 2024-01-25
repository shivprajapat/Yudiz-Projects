import constants from '../../Shared/Types/constants'

/* initial state */
const initialUniversityState = {
  resStatus: null,
  resMessage: null,
  isUniversityAdded: null,
  universityList: null,
  universityCount: null,
  isUniversityEdited: null,
  isDeleted: null,
  resData: {},
  isLoading: false
}

export default (state = initialUniversityState, action) => {
  switch (action.type) {
    case constants.ADD_UNIVERSITY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isUniversityAdded: action.payload.isUniversityAdded
      }
    case constants.CLEAR_ADD_UNIVERSITY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isUniversityAdded: null
      }
    case constants.GET_ALL_UNIVERSITY_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        universityList: action.payload.universityList,
        universityCount: action.payload.universityCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_UNIVERSITY_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        universityCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_UNIVERSITY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_UNIVERSITY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_UNIVERSITY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isUniversityEdited: action.payload.isUniversityEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_UNIVERSITY:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isUniversityEdited: null
      }
    case constants.DELETE_UNIVERSITY:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_UNIVERSITY:
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
