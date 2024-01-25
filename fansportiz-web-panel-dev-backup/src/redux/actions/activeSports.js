// import axios from '../../axios/instanceAxios'
// import { GET_ACTIVE_SPORTS } from '../constants'
// const errMsg = 'Server is unavailable.'

// export const GetActiveSports = () => async (dispatch) => {
//   await axios.get('/gaming/user/match/active-sports/v2').then((response) => {
//     dispatch({
//       type: GET_ACTIVE_SPORTS,
//       payload: {
//         data: response.data.data,
//         resMessage: response.data.message,
//         resStatus: true
//       }
//     })
//   }).catch((error) => {
//     dispatch({
//       type: GET_ACTIVE_SPORTS,
//       payload: {
//         data: null,
//         resMessage: error.response ? error.response.data.message : errMsg,
//         resStatus: false
//       }
//     })
//   })
// }
