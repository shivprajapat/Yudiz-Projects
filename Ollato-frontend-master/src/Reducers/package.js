import constants from '../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  ressMessage: null,
  packagesData: null,
  packageDataById: null,
  activePackagesArray: null,
  addOnPackagesArray: null,
  packageHistoryArray: null,
  isDownloaded: null,
  otherPackagesData: null,
  isLoading: true,
  isPackagePurchase: null,
  applyCoupon: null,
  CouponCodeData: null
}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.GET_ALL_PACKAGES_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        packagesData: action.payload.packagesData,
        isLoading: action.payload.isLoading
      }
    case constants.CLEAR_GET_ALL_PACKAGES_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        packagesData: null,
        isLoading: true
      }
    case constants.GET_PACKAGES_DATA_ID:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        packageDataById: action.payload.packageDataById
      }
    case constants.CLEAR_GET_PACKAGES_DATA_ID:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        packageDataById: null
      }
    case constants.GET_ACTIVE_PACKAGES:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        activePackagesArray: action.payload.activePackagesArray
      }
    case constants.CLEAR_GET_ACTIVE_PACKAGES:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        activePackagesArray: null
      }
    case constants.GET_ADD_ON_PACKAGES:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        addOnPackagesArray: action.payload.addOnPackagesArray
      }
    case constants.CLEAR_GET_ADD_ON_PACKAGES:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        addOnPackagesArray: null
      }
    case constants.GET_PACKAGE_HISTORY_LIST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        packageHistoryArray: action.payload.packageHistoryArray
      }
    case constants.CLEAR_GET_PACKAGE_HISTORY_LIST:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        packageHistoryArray: null
      }
    case constants.DOWNLOAD_INVOICE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDownloaded: action.payload.isDownloaded
      }
    case constants.CLEAR_DOWNLOAD_INVOICE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDownloaded: null
      }
    case constants.GET_OTHER_PACKAGES:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        otherPackagesData: action.payload.otherPackagesData
      }
    case constants.CLEAR_GET_OTHER_PACKAGES:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        otherPackagesData: null
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
