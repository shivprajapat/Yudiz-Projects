import axios from '../axios'
import { catchFunc, encryption, successFunc } from '../helpers/helper'
import { ADD_BANK_DETAILS, GET_RECOMMANDED_LIST, ADD_USER_DEPOSIT, ADD_USER_WITHDRAW, CITIES_LIST, CLEAR_USERS_MESSAGE, EMAIL_TEMPLATE_DETAILS, EMAIL_TEMPLATE_LIST, GET_BALANCE_DETAILS, GET_BANK_DETAILS, GET_PREFERENCE_DETAILS, IMAGE_EMAIL_TEMPLATE, STATES_LIST, UPDATE_BANK_DETAILS, UPDATE_EMAIL_TEMPLATE, UPDATE_PREFERENCE_DETAILS, UPDATE_USER_DETAILS, USER_DETAIL_LIST, USER_LIST, USERS_TOTAL_COUNT, TDS_LIST, TDS_TOTAL_COUNT, UPDATE_TDS, GET_REFERRALS_LIST } from './constants'
const errMsg = 'Server is unavailable.'

export const getUserList = (usersData) => async (dispatch) => {
  dispatch({ type: CLEAR_USERS_MESSAGE })
  const { start, limit, sort, order, searchvalue, filterBy, startDate, endDate, isFullResponse, token } = usersData
  const url = (filterBy === 'EMAIL_VERIFIED')
    ? `/profile/v2?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&email=${true}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
    : (filterBy === 'MOBILE_VERIFIED')
        ? `/profile/v2?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&mobile=${true}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
        : (filterBy === 'INTERNAL_ACCOUNT')
            ? `/profile/v2?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&internalAccount=${true}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
            : `/profile/v2?start=${start}&limit=${limit}&sorting=${sort}&order=${order}&search=${searchvalue}&datefrom=${startDate}&dateto=${endDate}&isFullResponse=${isFullResponse}`
  await axios.get(url, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USER_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true,
        isFullResponse
      }
    })
  }).catch(() => {
    dispatch({
      type: USER_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getUserDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/profile/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USER_DETAIL_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: USER_DETAIL_LIST,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const updateUserDetails = (updateUserData) => async (dispatch) => {
  dispatch({ type: CLEAR_USERS_MESSAGE })
  const { userName, userAccount, fullname, ID, propic, email, MobNum, gender, birthdate, address, city, pincode, State, userStatus, token } = updateUserData
  try {
    if (propic && propic.file) {
      const response = await axios.post('/profile/pre-signed-url/v1', { sFileName: propic.file.name, sContentType: propic.file.type }, { headers: { Authorization: token } })
      const url = response.data.data.sUrl
      const sImage = response.data.data.sPath
      await axios.put(url, propic.file, { headers: { 'Content-Type': propic.file.type } })
      await axios.put(`/profile/${ID}/v1`, {
        bIsInternalAccount: userAccount === 'Y',
        sName: fullname,
        sProPic: sImage,
        sEmail: email,
        sMobNum: MobNum,
        eGender: gender,
        dDob: birthdate,
        sAddress: address,
        iCityId: city,
        nPinCode: pincode,
        iStateId: State,
        eStatus: userStatus,
        sUsername: userName
      }, { headers: { Authorization: token } }).then((response1) => {
        dispatch({
          type: UPDATE_USER_DETAILS,
          payload: {
            resMessage: response1.data.message,
            resStatus: true,
            type: UPDATE_USER_DETAILS
          }
        })
      })
    } else {
      await axios.put(`/profile/${ID}/v1`, {
        bIsInternalAccount: userAccount === 'Y',
        sName: fullname,
        sProPic: propic || '',
        sEmail: email,
        sMobNum: MobNum,
        eGender: gender,
        dDob: birthdate,
        sAddress: address,
        iCityId: city,
        nPinCode: pincode,
        iStateId: State,
        eStatus: userStatus,
        sUsername: userName
      }, { headers: { Authorization: updateUserData.token } }).then((response) => {
        dispatch({
          type: UPDATE_USER_DETAILS,
          payload: {
            resMessage: response.data.message,
            resStatus: true,
            type: UPDATE_USER_DETAILS
          }
        })
      })
    }
  } catch (error) {
    dispatch(catchFunc(UPDATE_USER_DETAILS, error))
  }
}

export const addAdminDeposit = (ID, balance, balanceType, cash, bonus, password, token) => async (dispatch) => {
  dispatch({ type: CLEAR_USERS_MESSAGE })
  const passwd = encryption(password)
  await axios.post('/deposit/v2', {
    iUserId: ID,
    eType: balance,
    nCash: balanceType === 'cash' ? cash : 0,
    nBonus: balanceType === 'bonus' ? bonus : 0,
    sPassword: passwd
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_USER_DEPOSIT,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        type: ADD_USER_DEPOSIT
      }
    })
  }).catch((error) => {
    dispatch(catchFunc(ADD_USER_DEPOSIT, error))
  })
}

export const addAdminWithdraw = (ID, type, amount, password, token) => async (dispatch) => {
  dispatch({ type: CLEAR_USERS_MESSAGE })
  const passwd = encryption(password)
  await axios.post('/withdraw/v2', {
    iUserId: ID,
    eType: type,
    nAmount: amount,
    sPassword: passwd
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_USER_WITHDRAW,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        type: ADD_USER_WITHDRAW
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_USER_WITHDRAW,
      payload: {
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg,
        resStatus: false,
        type: ADD_USER_WITHDRAW
      }
    })
  })
}

export const getBankDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/bank-details/${ID}/v2`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_BANK_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_BANK_DETAILS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getRecommendedList = (ID, sendId, token) => async (dispatch) => {
  await axios.get(`/user/recommendation/v1?sSearch=${ID}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_RECOMMANDED_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        isSendId: sendId,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_RECOMMANDED_LIST,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getBalanceDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/balance/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_BALANCE_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_BALANCE_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getPreferenceDetails = (ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_USERS_MESSAGE })
  await axios.get(`/preferences/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_PREFERENCE_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_PREFERENCE_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const UpdateBankDetails = (bankDetails, ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_USERS_MESSAGE })
  await axios.put(`/bank-details/${ID}/v2`, {
    // sAccountNo: bankDetails.sAccountNo,
    // sAccountHolderName: bankDetails.sAccountHolderName,
    // sBranchName: bankDetails.sBranch,
    // sIFSC: bankDetails.sIFSC,
    // sBankName: bankDetails.sBankName,
    bIsBankApproved: bankDetails.bIsChangeApprove
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_BANK_DETAILS,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        type: UPDATE_BANK_DETAILS
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_BANK_DETAILS,
      payload: {
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : 'Server is unavailable.',
        resStatus: false,
        type: UPDATE_BANK_DETAILS
      }
    })
  })
}

export const AddBankDetails = (bankDetails, ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_USERS_MESSAGE })
  await axios.post(`/bank-details/${ID}/v2`, {
    sAccountNo: bankDetails.sAccountNo,
    sAccountHolderName: bankDetails.sAccountHolderName,
    sBranchName: bankDetails.sBranch,
    sIFSC: bankDetails.sIFSC,
    sBankName: bankDetails.sBankName
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_BANK_DETAILS,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        type: ADD_BANK_DETAILS
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_BANK_DETAILS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        type: ADD_BANK_DETAILS
      }
    })
  })
}

export const UpdatePreferenceDetails = (preferenceInformation, ID, token) => async (dispatch) => {
  dispatch({ type: CLEAR_USERS_MESSAGE })
  await axios.put(`/preferences/${ID}/v1`, preferenceInformation, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_PREFERENCE_DETAILS,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        type: UPDATE_PREFERENCE_DETAILS
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_PREFERENCE_DETAILS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false,
        type: UPDATE_PREFERENCE_DETAILS
      }
    })
  })
}

export const getStates = (token) => async (dispatch) => {
  await axios.get('/states/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: STATES_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: STATES_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getCities = (start, limit, stateID, token) => async (dispatch) => {
  await axios.get(`/city/v1?start=${start}&limit=${limit}&nStateId=${stateID}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CITIES_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: CITIES_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getEmailTemplateList = (token) => async (dispatch) => {
  await axios.get('/email-template/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: EMAIL_TEMPLATE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: EMAIL_TEMPLATE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getEmailTemplateDetails = (slug, token) => async (dispatch) => {
  await axios.get(`/email-template/${slug}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: EMAIL_TEMPLATE_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: EMAIL_TEMPLATE_DETAILS,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const updateEmailTemplate = (updateEmailTemplateData) => async (dispatch) => {
  const { Slug, Title, Description, Content, Subject, EmailStatus, ID, token } = updateEmailTemplateData
  dispatch({ type: CLEAR_USERS_MESSAGE })
  await axios.put(`/email-template/${ID}/v1`, {
    sSlug: Slug,
    sTitle: Title,
    sContent: Content,
    sSubject: Subject,
    sDescription: Description,
    eStatus: EmailStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(UPDATE_EMAIL_TEMPLATE, response))
  }).catch((error) => {
    dispatch(catchFunc(UPDATE_EMAIL_TEMPLATE, error))
  })
}

export const imageUpload = (image, token) => async (dispatch) => {
  try {
    const response = await axios.post('/email-template/pre-signed-url/v1', { sFileName: image.name, sContentType: image.type }, { headers: { Authorization: token } })
    return response.data.data.sPath
  } catch (error) {
    dispatch({
      type: IMAGE_EMAIL_TEMPLATE,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  }
}

export const getUsersTotalCount = (data) => async (dispatch) => {
  const { searchvalue, filterBy, startDate, endDate, token } = data
  const url = (filterBy === 'EMAIL_VERIFIED')
    ? `/profile/counts/v1?search=${searchvalue}&email=${true}&datefrom=${startDate}&dateto=${endDate}`
    : (filterBy === 'MOBILE_VERIFIED')
        ? `/profile/counts/v1?search=${searchvalue}&mobile=${true}&datefrom=${startDate}&dateto=${endDate}`
        : (filterBy === 'INTERNAL_ACCOUNT')
            ? `/profile/counts/v1?search=${searchvalue}&internalAccount=${true}&datefrom=${startDate}&dateto=${endDate}`
            : `/profile/counts/v1?search=${searchvalue}&datefrom=${startDate}&dateto=${endDate}`
  await axios.get(url, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USERS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: USERS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const getTDSList = (data) => async (dispatch) => {
  const { start, limit, sort, order, userType, searchValue, startDate, endDate, status, isFullResponse, token } = data
  await axios.get(`/tds/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&eUserType=${userType}&search=${searchValue}&datefrom=${startDate}&dateto=${endDate}&eStatus=${status}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TDS_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true,
        isFullResponse
      }
    })
  }).catch((error) => {
    dispatch({
      type: TDS_LIST,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getLeagueTdsList = (data) => async (dispatch) => {
  const { id, start, limit, sort, order, userType, searchValue, startDate, endDate, status, isFullResponse, token } = data
  await axios.get(`/tds/match-league-tds/${id}/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&eUserType=${userType}&search=${searchValue}&datefrom=${startDate}&dateto=${endDate}&eStatus=${status}&isFullResponse=${isFullResponse}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TDS_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true,
        isFullResponse
      }
    })
  }).catch((error) => {
    dispatch({
      type: TDS_LIST,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const tdsCount = (data) => async (dispatch) => {
  const { searchValue, userType, startDate, endDate, status, token } = data
  await axios.get(`/tds/counts/v1?search=${searchValue}&eUserType=${userType}&datefrom=${startDate}&dateto=${endDate}&eStatus=${status}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TDS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TDS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const tdsLeagueCount = (data) => async (dispatch) => {
  const { id, searchValue, userType, startDate, endDate, status, token } = data
  await axios.get(`/tds/match-league-tds/${id}/v1?search=${searchValue}&datefrom=${startDate}&dateto=${endDate}&eStatus=${status}&eUserType=${userType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TDS_TOTAL_COUNT,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TDS_TOTAL_COUNT,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}

export const updateTds = (status, id, token) => async (dispatch) => {
  await axios.put(`/tds/${id}/v1`, { eStatus: status }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_TDS,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_TDS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getReferredList = (data) => async (dispatch) => {
  const { start, limit, sort, order, search, userId, token } = data
  await axios.get(`/referred-list/${userId}/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_REFERRALS_LIST,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_REFERRALS_LIST,
      payload: {
        data: {},
        resStatus: false
      }
    })
  })
}
