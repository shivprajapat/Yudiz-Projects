import axios from '../axios'
import { CLEAR_RULE_MESSAGE, DELETE_RULE, REWARDS_LIST, RULE_DETAILS, RULE_LIST, UPDATE_RULE } from './constants'
const errMsg = 'Server is unavailable.'

export const getRuleList = token => async (dispatch) => {
  await axios.get('/rules/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: RULE_LIST,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: RULE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const deleteRule = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_RULE_MESSAGE })
  await axios.delete(`/rules/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: DELETE_RULE,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: DELETE_RULE,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getRuleDetails = (ID, token) => async (dispatch) => {
  await axios.get(`/rules/${ID}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: RULE_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: RULE_DETAILS,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const updateRule = (updateRuleData) => async (dispatch) => {
  dispatch({ type: CLEAR_RULE_MESSAGE })
  const { ruleShortName, selectRule, amount, Type, ReferActive, expiryDays, reward, Id, token } = updateRuleData
  try {
    if (ruleShortName === 'RR') {
      await axios.put(`/rules/${Id}/v1`, {
        eRule: ruleShortName,
        sRuleName: selectRule,
        nAmount: amount,
        eType: Type,
        eStatus: ReferActive,
        nExpireDays: expiryDays,
        sRewardOn: reward
      }, { headers: { Authorization: token } }).then((response) => {
        dispatch({
          type: UPDATE_RULE,
          payload: {
            resStatus: true,
            resMessage: response.data.message
          }
        })
      })
    } else {
      await axios.put(`/rules/${Id}/v1`, {
        eRule: ruleShortName,
        sRuleName: selectRule,
        nAmount: amount,
        eType: Type,
        eStatus: ReferActive,
        nExpireDays: expiryDays
      }, { headers: { Authorization: token } }).then((response2) => {
        dispatch({
          type: UPDATE_RULE,
          payload: {
            resStatus: true,
            resMessage: response2.data.message
          }
        })
      })
    }
  } catch (error) {
    dispatch({
      type: UPDATE_RULE,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg
      }
    })
  }
}

export const getRewardsList = token => async (dispatch) => {
  await axios.get('/rules/rewards/list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: REWARDS_LIST,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: REWARDS_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
