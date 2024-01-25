import constants from '../../Shared/Types/constants'

/* initial state */
const initialCoupenCodeState = {
  resStatus: null,
  resMessage: null,
  isCouponAdded: null,
  coupenCodeList: null,
  coupenCodeCount: null,
  specificCouponData: null,
  isCouponDeleted: null,
  isCouponCodeEdited: false,
  isLoading: false
}

export default (state = initialCoupenCodeState, action) => {
  switch (action.type) {
    case constants.ADD_COUPON_CODE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCouponAdded: action.payload.isCouponAdded
      }
    case constants.CLEAR_ADD_COUPON_CODE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCouponAdded: null
      }
    case constants.GET_ALL_COUPEN_CODE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        coupenCodeList: action.payload.coupenCodeList,
        coupenCodeCount: action.payload.count,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_COUPEN_CODE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        coupenCodeList: null,
        coupenCodeCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_COUPON_CODE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        specificCouponData: action.payload.specificCouponData
      }
    case constants.CLEAR_GET_SPECIFIC_COUPON_CODE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        specificCouponData: null
      }
    case constants.EDIT_SPECIFIC_COUPON_CODE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCouponCodeEdited: action.payload.isCouponCodeEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_COUPON_CODE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCouponCodeEdited: null
      }
    case constants.DELETE_COUPON_CODE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isCouponDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_COUPON_CODE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isCouponDeleted: null
      }
    default:
      return state
  }
}
