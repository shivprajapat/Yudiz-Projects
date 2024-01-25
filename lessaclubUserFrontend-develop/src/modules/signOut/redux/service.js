import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { CLEAR_CONNECT_WALLET, CLEAR_WALLET_ACCOUNT } from 'modules/wallet/redux/action'
import { CLEAR_USER_RESPONSE } from 'modules/user/redux/action'

export const signOut = (callback) => (dispatch) => {
  dispatch({ type: CLEAR_CONNECT_WALLET })
  dispatch({ type: CLEAR_WALLET_ACCOUNT })
  dispatch({ type: CLEAR_USER_RESPONSE })
  dispatch({
    type: SHOW_TOAST,
    payload: {
      message: 'You are signed out successfully',
      type: TOAST_TYPE.Success
    }
  })
  if (callback) {
    callback()
  }
}
