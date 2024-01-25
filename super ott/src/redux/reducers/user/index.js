import { USER_LIST_BEGIN, USER_LIST_FAILURE, USER_LIST_SUCCESS } from '../../actions/constants'

// ** Initial State
const initialState = {
  totalUsers: 0,
  allUsers: [],
  loading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_LIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case USER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload
      }
    case USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        allUsers: action?.payload?.data?.length ? action?.payload?.data[0].users : [],
        totalUsers: action?.payload?.data?.length ? action?.payload?.data[0].count.total : 0
      }

    default:
      return state
  }
}
