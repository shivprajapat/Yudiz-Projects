import axios from '../../axios/instanceAxios'
import storage from '../../localStorage/localStorage'

import {
  CHANGE_LANGUAGE,
  GET_CURRENCY,
  GET_BACKGROUND,
  CLEAR_BACKGROUND_MESSAGE,
  CLEAR_CURRENCY_MESSAGE,
  MAINTENANCE_MODE,
  CLEAR_MAINTENANCE_MODE,
  FIX_DEPOSIT_AMOUNTS,
  GET_POLICIES
} from '../constants'

// change the languages
export const changeLanguage = ({ language = 'en-US' }) => {
  return (dispatch) => {
    storage.setItem('language', language)
    dispatch({
      type: CHANGE_LANGUAGE,
      payload: { language }
    })
  }
}

// get currency logo
export const getCurrency = () => async (dispatch) => {
  dispatch({ type: CLEAR_CURRENCY_MESSAGE })
  axios
    .get('/gaming/user/currency/v1')
    .then((response) => {
      dispatch({
        type: GET_CURRENCY,
        payload: {
          currencyLogo: response.data.data.sLogo,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: GET_CURRENCY,
        payload: {
          currencyLogo: '₹',
          resStatus: false
        }
      })
    })
}

// get the background image
export const getBackground = () => async (dispatch) => {
  dispatch({ type: CLEAR_BACKGROUND_MESSAGE })
  axios
    .get('/gaming/user/side-background/v1')
    .then((response) => {
      dispatch({
        type: GET_BACKGROUND,
        payload: {
          sImage: response.data.data.sImage,
          sBackImage: response.data.data.sBackImage,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: GET_BACKGROUND,
        payload: {
          sImage: '',
          sBackImage: '',
          resStatus: false
        }
      })
    })
}

// Get the maintaince data
export const isMaintenanceMode = () => async (dispatch) => {
  dispatch({
    type: CLEAR_MAINTENANCE_MODE
  })
  axios
    .get('/statics/user/maintenance-mode/v1')
    .then((response) => {
      dispatch({
        type: MAINTENANCE_MODE,
        payload: {
          data: response.data.data,
          resStatus: true
        }
      })
    })
    .catch(() => {
      dispatch({
        type: MAINTENANCE_MODE,
        payload: {
          data: null,
          resStatus: false
        }
      })
    })
}

export const getFixDepositAmounts = () => async (dispatch) => {
  await axios.get('/gaming/user/setting/fix-deposit/v1').then((response) => {
    dispatch({
      type: FIX_DEPOSIT_AMOUNTS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  })
    .catch(() => {
      dispatch({
        type: FIX_DEPOSIT_AMOUNTS,
        payload: {
          data: null,
          resStatus: false
        }
      })
    })
}

export const getPolicies = () => async (dispatch) => {
  await axios.get('/statics/user/cms/register-policy/v1').then((response) => {
    dispatch({
      type: GET_POLICIES,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_POLICIES,
      payload: {
        data: null,
        resStatus: false
      }
    })
  })
}
