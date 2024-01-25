import constants from '../../Shared/Types/constants'

/* initial state */
const initialCareerProfileState = {
  resStatus: null,
  resMessage: null,
  isCareerProfileAdded: null,
  careerProfileList: null,
  careerProfileCount: null,
  isCareerProfileEdited: false,
  isDeleted: null,
  resData: {},
  isLoading: false
}

export default (state = initialCareerProfileState, action) => {
  switch (action.type) {
    case constants.GET_ALL_CAREER_PROFILE_LIST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        careerProfileData: action.payload.careerProfileData,
        isLoading: true
      }
    case constants.CLEAR_GET_ALL_CAREER_PROFILE_LIST:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isLoading: false
      }
    case constants.ADD_CAREER_PROFILE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCareerProfileAdded: action.payload.isCareerProfileAdded
      }
    case constants.CLEAR_ADD_CAREER_PROFILE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCareerProfileAdded: null
      }
    case constants.GET_ALL_CAREER_PROFILE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        careerProfileList: action.payload.careerProfileList,
        careerProfileCount: action.payload.careerProfileCount
      }
    case constants.CLEAR_GET_ALL_CAREER_PROFILE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        careerProfileCount: null
      }
    case constants.GET_SPECIFIC_CAREER_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_CAREER_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_CAREER_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCareerProfileEdited: action.payload.isCareerProfileEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_CAREER_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCareerProfileEdited: null
      }
    case constants.DELETE_CAREER_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_CAREER_PROFILE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    case constants.CLEAR_DELETE_CAREER_PROFILE_DETAIL:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    case constants.DELETE_CAREER_PROFILE_DETAIL:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    default:
      return state
  }
}
