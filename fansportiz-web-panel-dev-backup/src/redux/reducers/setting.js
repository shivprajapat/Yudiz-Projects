import {
  CHANGE_LANGUAGE,
  GET_CURRENCY,
  GET_BACKGROUND,
  CLEAR_BACKGROUND_MESSAGE,
  MAINTENANCE_MODE,
  CLEAR_MAINTENANCE_MODE,
  FIX_DEPOSIT_AMOUNTS,
  CLEAR_CURRENCY_MESSAGE,
  GET_POLICIES
} from '../constants'
import storage from '../../localStorage/localStorage'

let language = storage.getItem('language')
if (!language) {
  language = 'en-US'
}

export default (state = { language: language }, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.payload.language
      }
    case GET_CURRENCY:
      return {
        ...state,
        currencyLogo: action.payload.currencyLogo
      }
    case GET_BACKGROUND:
      return {
        ...state,
        backgroundImage: action.payload.sImage,
        backgroundCoverImage: action.payload.sBackImage
      }
    case CLEAR_BACKGROUND_MESSAGE:
      return {
        ...state,
        backgroundImage: null,
        backgroundCoverImage: null
      }
    case CLEAR_CURRENCY_MESSAGE:
      return {
        ...state,
        currencyLogo: null
      }
    case FIX_DEPOSIT_AMOUNTS:
      return {
        ...state,
        fixAmounts: action.payload.data
      }
    case GET_POLICIES:
      return {
        ...state,
        policies: action.payload.data
      }
    case CLEAR_MAINTENANCE_MODE:
      return {
        ...state,
        maintenanceMode: null
      }
    case MAINTENANCE_MODE:
      return {
        ...state,
        maintenanceMode: action.payload.data
      }
    default:
      return state
  }
}
