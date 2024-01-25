import { UPDATE_MANUAL_LOGISTICS_DATA, CLEAR_MANUAL_LOGISTICS_DATA } from './action'

export const manualLogistics = (state = {}, action = {}) => {
  switch (action.type) {
    case UPDATE_MANUAL_LOGISTICS_DATA:
      return {
        ...state,
        manualLogistics: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        logistcsUpdated: true
      }
    case CLEAR_MANUAL_LOGISTICS_DATA:
      return {
        ...state,
        manualLogistics: {},
        resStatus: false,
        resMessage: '',
        logistcsUpdated: false
      }
    default:
      return state
  }
}
