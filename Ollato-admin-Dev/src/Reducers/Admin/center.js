import constants from '../../Shared/Types/constants'

const initialAuthState = {
  resStatus: null,
  isLoading: false,
  resMessage: null,
  isCenterAdded: null,
  centerList: null,
  centerCount: null,
  resData: null,
  isCenterEdited: null,
  isDeleted: null,
  redeemHistoryCenterData: null,
  specicRedeemReqData: null,
  isRedeemReqEdited: null,
  exportedData: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_CENTER_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCenterAdded: action.payload.isCenterAdded,
        isLoading: false
      }
    case constants.CLEAR_ADD_CENTER_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCenterAdded: null,
        isLoading: true
      }
    case constants.GET_ALL_CENTER_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        centerList: action.payload.centerList,
        centerCount: action.payload.centerCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_CENTER_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        centerCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_CENTER:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resData: action.payload.resData
      }
    case constants.CLEAR_GET_SPECIFIC_CENTER:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        resData: {}
      }
    case constants.EDIT_SPECIFIC_CENTER:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCenterEdited: action.payload.isCenterEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_CENTER:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCenterEdited: null
      }
    case constants.DELETE_CENTER:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_CENTER:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    case constants.GET_REDEEM_HISTORY_CENTER_SUCCESS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        redeemHistoryCenterData: action.payload.redeemHistoryCenterData,
        redeemHistoryCenterCount: action.payload.redeemHistoryCenterCount,
        isLoading: false
      }
    case constants.CLEAR_GET_REDEEM_HISTORY_CENTER_SUCCESS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        redeemHistoryCenterData: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_REDEEM_REQ:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        specicRedeemReqData: action.payload.specicRedeemReqData
      }
    case constants.CLEAR_GET_SPECIFIC_REDEEM_REQ:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        specicRedeemReqData: {}
      }
    case constants.CLEAR_EDIT_SPECIFIC_REDEEM_REQ:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isRedeemReqEdited: null
      }
    case constants.EDIT_SPECIFIC_REDEEM_REQ:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isRedeemReqEdited: action.payload.isRedeemReqEdited
      }
    case constants.CLEAR_EXPORT_CENTERS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        exportedData: null
      }
    case constants.EXPORT_CENTERS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        exportedData: action.payload.exportedData
      }
    default:
      return state
  }
}
