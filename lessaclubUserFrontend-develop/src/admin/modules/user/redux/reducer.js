import { ADMIN_BLOCK_UNBLOCK_USER, ADMIN_CLEAR_BLOCK_UNBLOCK_USER, ADMIN_CLEAR_GET_USERS, ADMIN_GET_USERS } from './action'

export const adminUser = (state = {}, action = {}) => {
  switch (action.type) {
    case ADMIN_GET_USERS:
      return {
        ...state,
        getAdminUsers: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case ADMIN_CLEAR_GET_USERS:
      return {
        ...state,
        getAdminUsers: {},
        resStatus: false,
        resMessage: ''
      }
    case ADMIN_BLOCK_UNBLOCK_USER :
      return {
        ...state,
        blockUnblockUser: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        getAdminUsers: (() => {
          if (action.payload.resStatus) {
            return {
              ...state.getAdminUsers,
              users: state.getAdminUsers.users.map((item) => {
                if (item.id === action.payload.data.user.id) {
                  return action.payload.data.user
                }
                return item
              })
            }
          } else {
            return state.getAdminUsers
          }
        })()
      }
    case ADMIN_CLEAR_BLOCK_UNBLOCK_USER :
      return {
        ...state,
        blockUnblockUser: {},
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
