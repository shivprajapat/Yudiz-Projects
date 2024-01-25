import {
  CHANGE_PASSWORD,
  KYC_DETAIL,
  ADD_KYC,
  UPDATE_KYC,
  BANK_DETAIL,
  ADD_BANK_DETAIL,
  UPDATE_BANK_DETAIL,
  WITHDRAW_LIMIT,
  GET_USER_PROFILE,
  GET_PREFERENCE_DETAILS,
  UPDATE_USER_PROFILE,
  UPDATE_PREFERENCE_DETAILS,
  GET_PROMO_CODE,
  APPLY_PROMO_CODE,
  GET_PAYMENT_OPTIONS,
  CLEAR_APPLY_PROMOCODE,
  CLEAR_PROFILE_MESSAGE,
  ADD_DEPOSIT,
  ADD_WITHDRAW,
  GET_MATCH_PROMO_CODE,
  CLEAR_GET_MATCH_PROMO_CODE,
  CLEAR_ADD_WITHDRAW,
  CLEAR_DEPOSIT_MESSAGE,
  CLEAR_ADD_KYC,
  CLEAR_UPDATE_KYC,
  APPLY_MATCH_PROMO_CODE,
  CLEAR_WITHDRAW_MESSAGE,
  CREATE_PAYMENT,
  CLEAR_PAYMENT,
  CLEAR_DEPOSIT_VALIDATION,
  DEPOSIT_VALIDATION,
  ADD_CASHFREE,
  CLEAR_ADD_CASHFREE,
  CITY_LIST,
  STATE_LIST,
  CLEAR_PROFILE_STATISTICS,
  GET_USER_STATISTICS,
  CLEAR_PAYMENT_OPTION,
  GET_STREAM_BUTTON,
  CLEAR_GET_STREAM_BUTTON,
  GET_LIVE_STREAM_LIST,
  CLEAR_GET_LIVE_STREAM_LIST,
  PAYMENT_OPTION,
  BANK_LIST,
  CLEAR_BANK_LIST,
  GET_DISCLAIMER,
  SEND_KYC_OTP,
  CURRENT_REFER_RULE,
  USERS_REFERRAL_LIST,
  REMIND_REFER_USER
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        nChangedPassword: action.payload.nChangedPassword
      }
    case GET_STREAM_BUTTON:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isShowingStreamButton: action.payload.data
      }
    case CLEAR_GET_STREAM_BUTTON:
      return {
        ...state,
        isShowingStreamButton: null
      }
    case GET_LIVE_STREAM_LIST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        getStreamList: action.payload.data
      }
    case CLEAR_GET_LIVE_STREAM_LIST:
      return {
        ...state,
        getStreamList: null
      }
    case KYC_DETAIL:
      return {
        ...state,
        kycDetail: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case APPLY_MATCH_PROMO_CODE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        applyPromocodeData: action.payload.data,
        appliedPromocode: action.payload.appliedPromocode
      }
    case ADD_KYC:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        kycAdded: action.payload.kycAdded
      }
    case CLEAR_ADD_KYC:
      return {
        ...state,
        kycAdded: null,
        resStatus: null,
        resMessage: ''
      }
    case PAYMENT_OPTION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        paymentList: action.payload.data
      }
    case CLEAR_PAYMENT_OPTION:
      return {
        ...state,
        paymentList: null,
        resStatus: null,
        resMessage: ''
      }
    case CLEAR_UPDATE_KYC:
      return {
        ...state,
        kycUpdated: null,
        resStatus: null
      }
    case ADD_DEPOSIT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        addDeposit: action.payload.addDeposit
      }
    case CLEAR_PROFILE_STATISTICS:
      return {
        ...state,
        statisticsData: null
      }
    case GET_USER_STATISTICS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        statisticsData: action.payload.statisticsData
      }
    case ADD_CASHFREE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        addDeposit: action.payload.addDeposit,
        resMessage: action.payload.resMessage,
        paymentData: action.payload.paymentData
      }
    case WITHDRAW_LIMIT:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        withdrawMessage: action.payload.withdrawMessage,
        withdrawPending: action.payload.withdrawPending,
        userWithdraw: action.payload.userWithdraw
      }
    case CLEAR_ADD_CASHFREE:
      return {
        ...state,
        paymentData: null,
        resMessage: null,
        resStatus: null,
        addDeposit: null
      }
    case ADD_WITHDRAW:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        addWithdraw: action.payload.addWithdraw
      }
    case CLEAR_ADD_WITHDRAW:
      return {
        ...state,
        addWithdraw: null
      }
    case UPDATE_KYC:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        kycUpdated: action.payload.kycUpdated
      }
    case BANK_DETAIL:
      return {
        ...state,
        bankData: action.payload.bankData,
        resStatus: action.payload.resStatus
      }
    case ADD_BANK_DETAIL:
      return {
        ...state,
        bankData: action.payload.bankData,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        bankDetails: action.payload.bankDetails
      }
    case UPDATE_BANK_DETAIL:
      return {
        ...state,
        bankData: action.payload.bankData,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        updateBankDetails: action.payload.updateBankDetails
      }
    case GET_USER_PROFILE:
      return {
        ...state,
        userInfo: action.payload.userInfo,
        resStatus: action.payload.resStatus
        // resMessage: action.payload.resMessage
      }
    case GET_PREFERENCE_DETAILS:
      return {
        ...state,
        preferenceDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_USER_PROFILE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        updateProfilePic: action.payload.updateProfilePic,
        isUpdatedProfile: action.payload.isUpdatedProfile
      }
    case UPDATE_PREFERENCE_DETAILS:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_PROMO_CODE:
      return {
        ...state,
        promoCode: action.payload.promoCode,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case GET_MATCH_PROMO_CODE:
      return {
        ...state,
        matchPromoCodeList: action.payload.matchPromoCodeList,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case APPLY_PROMO_CODE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        checkPromocode: action.payload.checkPromocode
      }
    case GET_PAYMENT_OPTIONS:
      return {
        ...state,
        pList: action.payload.pList,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_PROFILE_MESSAGE:
      return {
        ...state,
        resMessage: null,
        resStatus: null,
        updateProfilePic: null,
        updateBankDetails: null,
        checkPromocode: null,
        isUpdatedProfile: null,
        nChangedPassword: null
      }
    case CLEAR_WITHDRAW_MESSAGE:
      return {
        ...state,
        resMessage: null,
        resStatus: null,
        withdrawPending: null
      }
    case CLEAR_APPLY_PROMOCODE:
      return {
        ...state,
        applyPromocodeData: {},
        appliedPromocode: null
      }
    case DEPOSIT_VALIDATION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        settingValidation: action.payload.settingValidation
      }
    case CLEAR_DEPOSIT_VALIDATION:
      return {
        ...state,
        settingValidation: null
      }
    case CLEAR_DEPOSIT_MESSAGE:
      return {
        ...state,
        resMessage: '',
        resStatus: null,
        addDeposit: null
      }
    case CREATE_PAYMENT:
      return {
        ...state,
        paymentResStatus: action.payload.paymentResStatus,
        paymentResMessage: action.payload.paymentResMessage,
        paymentToken: action.payload.paymentToken
      }
    case CLEAR_PAYMENT:
      return {
        ...state,
        paymentResStatus: null,
        paymentResMessage: '',
        paymentToken: null
      }
    case BANK_LIST:
      return {
        ...state,
        bankList: action.payload.bankList,
        resStatus: action.payload.resStatus,
        bankTotalList: action.payload.bankTotalList
      }
    case CLEAR_BANK_LIST:
      return {
        ...state,
        bankList: null,
        resStatus: ''
      }
    case CLEAR_GET_MATCH_PROMO_CODE:
      return {
        ...state,
        matchPromoCodeList: null,
        resStatus: null
      }
    case STATE_LIST:
      return {
        ...state,
        stateList: action.payload.stateList,
        resStatus: action.payload.resStatus
      }
    case CITY_LIST:
      return {
        ...state,
        cityList: action.payload.cityList,
        resStatus: action.payload.resStatus
      }
    case GET_DISCLAIMER:
      return {
        ...state,
        disclaimer: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case SEND_KYC_OTP:
      return {
        ...state,
        aadhaarData: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case CURRENT_REFER_RULE:
      return {
        ...state,
        currentReferRule: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case USERS_REFERRAL_LIST:
      return {
        ...state,
        userReferralsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case REMIND_REFER_USER:
      return {
        ...state,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    default:
      return state
  }
}
