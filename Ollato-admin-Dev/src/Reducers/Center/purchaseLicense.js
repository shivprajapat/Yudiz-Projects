import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  ressMessage: null,
  packageData: null,
  packagePurchasedDetails: null,
  isPackagePurchase: null,
  revenueData: null,
  isRevenue: null,
  allcredits: null,
  redeemHistoryData: null,
  isLoading: false,
  isRedeemSuccess: false,
  specificRedeReqData: null,
  packageHistoryArray: null,
  applyCoupon: null,
  CouponCodeData: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_ALL_CENTER_CREDITS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        allcredits: action.payload.allcredits
      }
    case constants.CLEAR_GET_ALL_CENTER_CREDITS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        allcredits: null
      }
    case constants.GET_ALL_CENTER_PACKAGE_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        packageData: action.payload.packageData
      }
    case constants.CLEAR_GET_ALL_CENTER_PACKAGE_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        packageData: null
      }
    case constants.PURCHASED_PACKAGE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        ressMessage: action.payload.ressMessage,
        packagePurchasedDetails: action.payload.packagePurchasedDetails
      }
    case constants.CLEAR_PURCHASED_PACKAGE:
      return {
        ...state,
        resStatus: null,
        ressMessage: null,
        packagePurchasedDetails: null
      }
    case constants.PACKAGE_PURCHASE_SUCCESS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        ressMessage: action.payload.ressMessage,
        isPackagePurchase: action.payload.isPackagePurchase
      }
    case constants.CLEAR_PACKAGE_PURCHASE_SUCCESS:
      return {
        ...state,
        resStatus: null,
        ressMessage: null,
        isPackagePurchase: null
      }
    case constants.GET_REVENUE_SUCCESS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        revenueData: action.payload.revenueData,
        isRevenue: action.payload.isRevenue
      }
    case constants.CLEAR_GET_REVENUE_SUCCESS:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        revenueData: null,
        isRevenue: true
      }
    case constants.GET_REDEEM_HISTORY_SUCCESS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        redeemHistoryData: action.payload.redeemHistoryData,
        redeemHistoryCount: action.payload.redeemHistoryCount,
        isLoading: false
      }
    case constants.CLEAR_GET_REDEEM_HISTORY_SUCCESS:
      return {
        ...state,
        resStatus: null,
        redeemHistoryData: null,
        isLoading: true
      }
    case constants.REDEEM_REQUEST_SUCCESS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        ressMessage: action.payload.ressMessage,
        isRedeemSuccess: action.payload.isRedeemSuccess
      }
    case constants.CLEAR_REDEEM_REQUEST_SUCCESS:
      return {
        ...state,
        resStatus: null,
        ressMessage: null,
        isRedeemSuccess: null
      }
    case constants.VIEW_SPECIFIC_REDEEM_REQ:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        specificRedeReqData: action.payload.specificRedeReqData
      }
    case constants.CLEAR_VIEW_SPECIFIC_REDEEM_REQ:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        specificRedeReqData: {}
      }
    case constants.GET_PACKAGE_HISTORY_LIST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        packageHistoryArray: action.payload.packageHistoryArray,
        packageHistoryCount: action.payload.packageHistoryCount
      }
    case constants.CLEAR_GET_PACKAGE_HISTORY_LIST:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        packageHistoryArray: null
      }
    case constants.APPLY_COUPON_SUCCESS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        ressMessage: action.payload.ressMessage,
        applyCoupon: action.payload.applyCoupon,
        CouponCodeData: action.payload.CouponCodeData
      }
    case constants.CLEAR_APPLY_COUPON_SUCCESS:
      return {
        ...state,
        resStatus: null,
        ressMessage: null,
        applyCoupon: null,
        CouponCodeData: null
      }
    default:
      return state
  }
}
