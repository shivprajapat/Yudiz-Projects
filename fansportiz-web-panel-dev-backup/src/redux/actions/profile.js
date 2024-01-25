import axios from '../../axios/instanceAxios'
import {
  CHANGE_PASSWORD,
  KYC_DETAIL,
  CLEAR_PROFILE_MESSAGE,
  ADD_KYC,
  UPDATE_KYC,
  BANK_DETAIL,
  ADD_BANK_DETAIL,
  UPDATE_BANK_DETAIL,
  WITHDRAW_LIMIT,
  CLEAR_WITHDRAW_MESSAGE,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  GET_PROMO_CODE,
  APPLY_PROMO_CODE,
  GET_PAYMENT_OPTIONS,
  GET_PREFERENCE_DETAILS,
  APPLY_MATCH_PROMO_CODE,
  CLEAR_APPLY_PROMOCODE,
  UPDATE_PREFERENCE_DETAILS,
  GET_MATCH_PROMO_CODE,
  CLEAR_GET_MATCH_PROMO_CODE,
  ADD_WITHDRAW,
  CLEAR_DEPOSIT_MESSAGE,
  CLEAR_ADD_WITHDRAW,
  CLEAR_ADD_KYC,
  CLEAR_UPDATE_KYC,
  CLEAR_PAYMENT,
  CREATE_PAYMENT,
  ADD_CASHFREE,
  CLEAR_ADD_CASHFREE,
  CLEAR_DEPOSIT_VALIDATION,
  DEPOSIT_VALIDATION,
  CLEAR_PROFILE_STATISTICS,
  GET_USER_STATISTICS,
  GET_STREAM_BUTTON,
  CLEAR_GET_STREAM_BUTTON,
  CLEAR_PAYMENT_OPTION,
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
import { catchError, catchBlankDataObj, catchBlankData } from '../../utils/helper'

const errMsg = 'Server is unavailable.'

export const ChangePassword = (oldPassword, newPassword, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  // const encryptedOldPass = encryption(oldPassword);
  // const encryptedNewPass = encryption(newPassword);
  axios
    .post(
      '/gaming/user/auth/change-password/v3',
      { sOldPassword: oldPassword, sNewPassword: newPassword },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: CHANGE_PASSWORD,
        payload: {
          resMessage: response.data.message,
          resStatus: true,
          nChangedPassword: true
        }
      })
    })
    .catch((error) => {
      dispatch(catchError(CHANGE_PASSWORD, error))
    })
}
// get kyc detail
export const GetKycDetail = (token) => async (dispatch) => { // get the kyc details
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .get('/user-info/user/kyc/v2', { headers: { Authorization: token } })
    .then((response) => {
      const data = response.data.data || {}
      dispatch({
        type: KYC_DETAIL,
        payload: {
          data,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: KYC_DETAIL,
        payload: {
          data: {},
          resStatus: false
        }
      })
    })
}

// Add kyc detail
export const AddKycDetail = (type, panNumber, PanName, aadharNo, token) => async (dispatch) => {
  dispatch({ type: CLEAR_ADD_KYC })
  if (type === 'PAN') {
    await axios.post(
      '/user-info/user/kyc/add/v1',
      { sNo: panNumber, eType: type, sName: PanName },
      { headers: { Authorization: token } }
    )
      .then((resp) => {
        dispatch({
          type: ADD_KYC,
          payload: {
            resMessage: resp.data.message,
            resStatus: true,
            kycAdded: true
          }
        })
      })
      .catch((error) => {
        dispatch(catchError(ADD_KYC, error))
      })
  } else {
    dispatch({ type: CLEAR_ADD_KYC })
    await axios.post(
      '/user-info/user/kyc/add/v1',
      {
        nNo: aadharNo,
        eType: type
      },
      { headers: { Authorization: token } }
    ).then((resp) => {
      dispatch({
        type: ADD_KYC,
        payload: {
          resMessage: resp.data.message,
          resStatus: true,
          kycAdded: true
        }
      })
    }).catch((error) => {
      dispatch(catchError(ADD_KYC, error))
    })
  }
}
// Update kyc detail
export const UpdateKycDetail = (type, panNumber, PanName, aadharNo, token) => async (dispatch) => {
  dispatch({ type: CLEAR_UPDATE_KYC })
  if (type === 'PAN') {
    await axios.put(
      '/user-info/user/kyc/v1',
      { sNo: panNumber, eType: type, sName: PanName },
      { headers: { Authorization: token } }
    )
      .then((resp) => {
        dispatch({
          type: UPDATE_KYC,
          payload: {
            resMessage: resp.data.message,
            resStatus: true,
            kycUpdated: true
          }
        })
      })
      .catch((error) => {
        dispatch(catchError(UPDATE_KYC, error))
      })
  } else {
    await axios.put(
      '/user-info/user/kyc/v1',
      {
        nNo: aadharNo,
        eType: type
      },
      { headers: { Authorization: token } }
    ).then((resp) => {
      dispatch({
        type: UPDATE_KYC,
        payload: {
          resMessage: resp.data.message,
          resStatus: true,
          kycUpdated: true
        }
      })
    })
      .catch((error) => {
        dispatch(catchError(UPDATE_KYC, error))
      })
  }
}

// get kyc detail
export const GetBankDetail = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .get('/user-info/user/bank-details/v2', { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: BANK_DETAIL,
        payload: {
          bankData: response.data.data,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: BANK_DETAIL,
        payload: {
          bankData: {},
          resStatus: false
        }
      })
    })
}

export const GetBankList = (start, limit, search, token) => async (dispatch) => {
  dispatch({ type: CLEAR_BANK_LIST })
  axios
    .get(`/user-info/user/bank/v1?start=${start}&limit=${limit}&search=${search}`, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: BANK_LIST,
        payload: {
          bankList: response.data.data.aData,
          bankTotalList: response.data.data.nTotal,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: BANK_LIST,
        payload: {
          bankList: [],
          bankTotalList: null,
          resStatus: false
        }
      })
    })
}

// Add Bank detail
export const AddBankDetail = (bankData, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .post('/user-info/user/bank-details/v2', bankData, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: ADD_BANK_DETAIL,
        payload: {
          bankData: response.data.data,
          resMessage: response.data.message,
          resStatus: true,
          bankDetails: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: ADD_BANK_DETAIL,
        payload: {
          resMessage: error.response.data.message,
          resStatus: false,
          bankDetails: false
        }
      })
    })
}

// update Bank details
export const UpdateBankDetails = (bankData, ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .put('/user-info/user/bank-details/v2', bankData, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: UPDATE_BANK_DETAIL,
        payload: {
          bankData: response.data.data,
          resMessage: response.data.message,
          resStatus: true,
          updateBankDetails: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UPDATE_BANK_DETAIL,
        payload: {
          resMessage: error.response.data.message,
          resStatus: false,
          updateBankDetails: false
        }
      })
    })
}

// get User Profile
export const GetUserProfile = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .get('/gaming/user/profile/v2')
    .then((response) => {
      dispatch({
        type: GET_USER_PROFILE,
        payload: {
          userInfo: response.data.data,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_USER_PROFILE,
        payload: {
          userInfo: {},
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetUserStatastics = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_STATISTICS })
  axios
    .get('/gaming/user/profile-statistics/v1', { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: GET_USER_STATISTICS,
        payload: {
          statisticsData: response.data.data,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_USER_STATISTICS,
        payload: {
          statisticsData: {},
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

// Update Profile
export const UpdateUserProfile = (platform, type, userData, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  if (type === 'data') {
    await axios.put('/gaming/user/profile/v1', userData, { headers: { Authorization: token } }).then((response) => {
      dispatch({
        type: UPDATE_USER_PROFILE,
        payload: {
          data: response.data.data,
          resMessage: response.data.message,
          resStatus: true,
          isUpdatedProfile: true
        }
      })
    }).catch((error) => {
      dispatch(catchError(UPDATE_USER_PROFILE, error))
    })
  } else if (type === 'img') {
    await axios.post(
      '/gaming/user/profile/pre-signed-url/v1',
      { sFileName: userData.name, sContentType: userData.type },
      { headers: { Authorization: token } }
    ).then(async (response) => {
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, userData, { headers: { 'Content-Type': 'multipart/form-data' } })
      await axios.put('/gaming/user/profile/v1', { sProPic: sImage }, { headers: { Authorization: token } }).then((resp) => {
        dispatch({
          type: UPDATE_USER_PROFILE,
          payload: {
            resMessage: resp.data.message,
            resStatus: true,
            updateProfilePic: true
          }
        })
      })
    }).catch((error) => {
      dispatch({
        type: UPDATE_USER_PROFILE,
        payload: {
          resStatus: false,
          resMessage: error.response
            ? error.response.data.message
            : errMsg,
          updateProfilePic: false
        }
      })
    })
  }
}

export const GetPromoCode = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .get('/gaming/user/promocode/list/v1', { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: GET_PROMO_CODE,
        payload: {
          promoCode: response.data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_PROMO_CODE,
        payload: {
          promoCode: [],
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const GetMatchPromoCode = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  dispatch({ type: CLEAR_APPLY_PROMOCODE })
  dispatch({ type: CLEAR_GET_MATCH_PROMO_CODE })
  axios
    .get(`/gaming/user/promocode/match/list/${ID}/v1`, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: GET_MATCH_PROMO_CODE,
        payload: {
          matchPromoCodeList: response.data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_MATCH_PROMO_CODE,
        payload: {
          matchPromoCodeList: [],
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
// Check promocode
export const ApplyPromoCode = (promoData, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .post('/gaming/user/promocode/check/v1', promoData, {
      headers: { Authorization: token }
    })
    .then((response) => {
      dispatch({
        type: APPLY_PROMO_CODE,
        payload: {
          resMessage: response.data.message,
          resStatus: true,
          checkPromocode: true
        }
      })
    })
    .catch((error) => {
      dispatch(
        dispatch({
          type: APPLY_PROMO_CODE,
          payload: {
            resMessage: error.response ? error.response.data.message : errMsg,
            resStatus: false,
            checkPromocode: false
          }
        })
      )
    })
}

export const ApplyMatchPromoCode = (data, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  await axios.post('/gaming/user/promocode/match/check/v1', data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: APPLY_MATCH_PROMO_CODE,
      payload: {
        data: response.data.data,
        resStatus: true,
        appliedPromocode: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: APPLY_MATCH_PROMO_CODE,
      payload: {
        appliedPromocode: false,
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

// get PaymentOption
export const GetPaymentOption = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .get('/payment/user/payment-option/list/v2', { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: GET_PAYMENT_OPTIONS,
        payload: {
          pList: response.data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_PAYMENT_OPTIONS,
        payload: {
          pList: [],
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const depositValidationList = (type, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  dispatch({ type: CLEAR_DEPOSIT_VALIDATION })
  await axios.get(`/gaming/user/setting/${type}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DEPOSIT_VALIDATION,
      payload: {
        settingValidation: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch(catchBlankData(DEPOSIT_VALIDATION))
  })
}

export const getPreferenceDetails = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .get('/gaming/user/preferences/v1', { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: GET_PREFERENCE_DETAILS,
        payload: {
          data: response.data.data ? response.data.data : {},
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch(catchBlankDataObj(GET_PREFERENCE_DETAILS))
    })
}

export const UpdatePreferenceDetails = (preferenceInformation, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  axios
    .put('/gaming/user/preferences/v1', preferenceInformation, {
      headers: { Authorization: token }
    })
    .then((response) => {
      dispatch({
        type: UPDATE_PREFERENCE_DETAILS,
        payload: {
          resMessage: response.data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch(catchError(UPDATE_PREFERENCE_DETAILS, error))
    })
}

export const ClearDeposit = () => async (dispatch) => {
  dispatch({ type: CLEAR_DEPOSIT_MESSAGE })
}

export const AddCashfree = (Amount, Type, PlatForm, OrderCurrency, Promocode, token) => async (dispatch) => {
  dispatch({ type: CLEAR_ADD_CASHFREE })
  await axios
    .post(
      '/payment/user/payment/create/v2',
      {
        nAmount: Amount,
        sPromocode: Promocode,
        eType: Type,
        ePlatform: PlatForm,
        sOrderCurrency: OrderCurrency
      },
      { headers: { Authorization: token, Platform: PlatForm } }
    )
    .then((response) => {
      dispatch({
        type: ADD_CASHFREE,
        payload: {
          paymentData: response.data.data,
          resStatus: true,
          addDeposit: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: ADD_CASHFREE,
        payload: {
          resMessage: error && error.response && error.response.data.message.reason
            ? error.response.data.message.reason
            : error.response.data.message,
          resStatus: false,
          paymentData: {},
          addDeposit: false
        }
      })
    })
}

// Add withdraw
export const AddWithdraw = (PaymentGateway, Amount, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_MESSAGE })
  dispatch({ type: CLEAR_ADD_WITHDRAW })
  axios
    .post(
      `/payment/user/withdraw/${PaymentGateway}/v2`,
      {
        nAmount: Amount,
        ePaymentStatus: 'P'
      },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: ADD_WITHDRAW,
        payload: {
          resMessage: response.data.message,
          resStatus: true,
          addWithdraw: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: ADD_WITHDRAW,
        payload: {
          resMessage: error.response.data.message,
          resStatus: false,
          addWithdraw: false
        }
      })
    })
}

// Check withdraw limit
export const CheckWithdrawLimit = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_WITHDRAW_MESSAGE })
  axios
    .get('/payment/user/withdraw-request/v2', { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: WITHDRAW_LIMIT,
        payload: {
          withdrawMessage: response.data.message,
          resStatus: true,
          withdrawPending: response.data.data.pending,
          userWithdraw: response.data.data.userWithdraw
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: WITHDRAW_LIMIT,
        payload: {
          resMessage: error && error.response && error.response.data && error.response.data.message,
          resStatus: false,
          withdrawPending: error && error.response && error.response.data && error.response.data.data && error.response.data.data.pending,
          userWithdraw: error && error.response && error.response.data && error.response.data.data && error.response.data.data.userWithdraw
        }
      })
    })
}

export const createPayment = (data, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PAYMENT })
  axios
    .post('/payment/user/payment/create/v1', data, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: CREATE_PAYMENT,
        payload: {
          paymentResMessage: response.data.message,
          paymentResStatus: true,
          paymentToken: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: CREATE_PAYMENT,
        payload: {
          paymentResMessage: error.response
            ? error.response.data.message
            : errMsg,
          paymentResStatus: false,
          paymentToken: null
        }
      })
    })
}

// get State List
export const paymentOptionList = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_PAYMENT_OPTION })
  axios
    .get('/payment/user/payout-option/list/v2', { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: PAYMENT_OPTION,
        payload: {
          data: response.data.data,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: PAYMENT_OPTION,
        payload: {
          data: [],
          resStatus: false
        }
      })
    })
}

// get Stream Button
export const onGetStreamButton = () => async (dispatch) => {
  dispatch({ type: CLEAR_GET_STREAM_BUTTON })
  axios
    .get('/gaming/user/match/stream-button/v1')
    .then((response) => {
      dispatch({
        type: GET_STREAM_BUTTON,
        payload: {
          data: response.data.data,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: GET_STREAM_BUTTON,
        payload: {
          data: [],
          resStatus: false
        }
      })
    })
}

// get Stream-Button List
export const onGetLiveStreamList = (start, limit, type, token) => async (dispatch) => {
  dispatch({ type: CLEAR_GET_LIVE_STREAM_LIST })
  axios
    .get(`/gaming/user/match/stream-list/${type}/v1?start=${start}&limit=${limit}`, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: GET_LIVE_STREAM_LIST,
        payload: {
          data: response.data.data,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: GET_LIVE_STREAM_LIST,
        payload: {
          data: [],
          resStatus: false
        }
      })
    })
}

export const getDisclaimer = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_GET_LIVE_STREAM_LIST })
  await axios.get('/user-info/user/kyc/disclaimer/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_DISCLAIMER,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  })
    .catch(() => {
      dispatch({
        type: GET_DISCLAIMER,
        payload: {
          data: [],
          resStatus: false
        }
      })
    })
}

export const sendKycOtp = (nAadhaarNo, token) => async (dispatch) => {
  await axios.post('/user-info/user/kyc/aadhaar-send-otp/v1', { nAadhaarNo }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: SEND_KYC_OTP,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch(
      dispatch({
        type: SEND_KYC_OTP,
        payload: {
          data: {},
          resMessage: error.response ? error.response.data.message : errMsg,
          resStatus: false
        }
      })
    )
  })
}

export const getCurrentReferRule = (token) => async (dispatch) => {
  await axios.get('/gaming/user/rule/current-refer-rule/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CURRENT_REFER_RULE,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: CURRENT_REFER_RULE,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getUserReferralsList = (token) => async (dispatch) => {
  await axios.get('/gaming/user/referred-list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USERS_REFERRAL_LIST,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: USERS_REFERRAL_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const remindReferUser = (id, token) => async (dispatch) => {
  await axios.post('/gaming/user/remind-refer-user/v1', { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: REMIND_REFER_USER,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: REMIND_REFER_USER,
      payload: {
        resMessage: error && error.response && error.response.data && error.response.data.message ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}
