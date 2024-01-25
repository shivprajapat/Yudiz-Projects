import axios from '../../../axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { GET_AUCTION_BIDS, CLEAR_AUCTION_BIDS_RESPONSE } from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const errMsg = 'Server is unavailable.'

export const getAuctionBids = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_AUCTION_BIDS_RESPONSE })
  axios
    .get(`${apiPaths.bids}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_AUCTION_BIDS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_AUCTION_BIDS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response ? error.response.data.message : errMsg,
          type: TOAST_TYPE.Error
        }
      })
    })
}
