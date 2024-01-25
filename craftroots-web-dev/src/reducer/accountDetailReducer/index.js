import { constants } from '@/actions/type'

const initialState = Object.freeze({
  accountData: {},
  loading: true,
})

export const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_ACCOUNT_DATA:
      return { ...state, accountData: action.payload, loading: false }
    case constants.RESET_ACCOUNT_STATE:
      return initialState // Reset the state to its initial values
    default:
      return state
  }
}
