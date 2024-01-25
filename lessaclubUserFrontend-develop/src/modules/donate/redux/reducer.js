/* eslint-disable no-unused-vars */
import {
  DONATE_DETAILS,
  CLEAR_DONATE_DETAILS_RESPONSE,
  DONATE_PURCHASE_CREATE,
  CLEAR_DONATE_PURCHASE_CREATE_RESPONSE,
  DONATE_PURCHASE_UPDATE,
  CLEAR_DONATE_PURCHASE_UPDATE_RESPONSE,
  DONATE_PURCHASE,
  CLEAR_DONATE_PURCHASE
} from './action'

export const donate = (state = {}, action = {}) => {
  switch (action.type) {
    case DONATE_DETAILS:
      return {
        ...state,
        donateDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case DONATE_PURCHASE_CREATE:
      return {
        ...state,
        donatePurchaseCreate: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        error: action.payload.error
      }
    case DONATE_PURCHASE_UPDATE:
      return {
        ...state,
        donatePurchaseUpdate: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case DONATE_PURCHASE:
      return {
        ...state,
        donatePurchaseCreateUsingCard: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_DONATE_PURCHASE:
      return {
        ...state,
        donatePurchaseCreateUsingCard: null,
        resStatus: false,
        resMessage: ''
      }

    case CLEAR_DONATE_PURCHASE_UPDATE_RESPONSE:
      return {
        ...state,
        donatePurchaseUpdate: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_DONATE_DETAILS_RESPONSE:
      return {
        ...state,
        donateDetails: null,
        resStatus: false,
        resMessage: ''
      }
    case CLEAR_DONATE_PURCHASE_CREATE_RESPONSE:
      return {
        ...state,
        donatePurchaseCreate: null,
        resStatus: false,
        resMessage: '',
        error: false
      }

    default:
      return state
  }
}
