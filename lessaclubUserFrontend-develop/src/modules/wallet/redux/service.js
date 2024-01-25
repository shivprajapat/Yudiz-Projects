import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { CLEAR_CONNECT_WALLET, CONNECT_WALLET } from './action'
import { setParamsForGetRequest } from 'shared/utils'

const errMsg = 'Server is unavailable.'
export const connectWallet = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_CONNECT_WALLET })

  axios
    .post(apiPaths.connectWallet, payload)
    .then(({ data }) => {
      dispatch({ type: CONNECT_WALLET, payload: { data: data.result, resMessage: '', resStatus: true } })
    })
    .catch((error) => {
      dispatch({
        type: CONNECT_WALLET,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const connectMetaMask = () => () => {
}

export const getMyWallets = async (payload) => {
  try {
    const response = await axios.get(`${apiPaths.getMyWallets}${setParamsForGetRequest(payload)}`)
    if (response?.status === 200) {
      return response
    }
  } catch (error) {
    console.log('getMyWallets error', error)
  }
}
