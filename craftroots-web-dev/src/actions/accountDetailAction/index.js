import { constants } from '../type'

export const setAccountData = (data) => ({
  type: constants.SET_ACCOUNT_DATA,
  payload: data,
})

export const resetAccountState = () => ({
  type: constants.RESET_ACCOUNT_STATE,
})
