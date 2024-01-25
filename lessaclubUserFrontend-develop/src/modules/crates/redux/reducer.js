import {
  CLEAR_CRATE_ASSETS_RESPONSE,
  CLEAR_CREATE_LOOT_BOX_RESPONSE,
  CLEAR_CREATE_MYSTERY_BOX_RESPONSE,
  CLEAR_LOOT_BOXES_RESPONSE,
  CLEAR_LOOT_BOX_DETAILS_RESPONSE,
  CLEAR_MYSTERY_BOXES_RESPONSE,
  CLEAR_MYSTERY_BOX_DETAILS_RESPONSE,
  CREATE_LOOT_BOX,
  CREATE_MYSTERY_BOX,
  GET_CRATE_ASSETS,
  GET_LOOT_BOXES,
  GET_LOOT_BOX_DETAILS,
  GET_MYSTERY_BOXES,
  GET_MYSTERY_BOX_DETAILS
} from './action'

export const crates = (state = {}, action = {}) => {
  switch (action.type) {
    case CREATE_MYSTERY_BOX:
      return {
        ...state,
        createMysteryBox: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resError: action.payload.resError
      }
    case CLEAR_CREATE_MYSTERY_BOX_RESPONSE:
      return {
        ...state,
        createMysteryBox: {},
        resStatus: '',
        resMessage: ''
      }
    case CREATE_LOOT_BOX:
      return {
        ...state,
        createLootBox: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resError: action.payload.resError
      }
    case CLEAR_CREATE_LOOT_BOX_RESPONSE:
      return {
        ...state,
        createLootBox: {},
        resStatus: '',
        resMessage: ''
      }
    case GET_CRATE_ASSETS:
      return {
        ...state,
        crateAssets: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_CRATE_ASSETS_RESPONSE:
      return {
        ...state,
        crateAssets: {},
        resStatus: '',
        resMessage: ''
      }
    case GET_MYSTERY_BOXES:
      return {
        ...state,
        mysteryBoxes: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_MYSTERY_BOXES_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    case GET_MYSTERY_BOX_DETAILS:
      return {
        ...state,
        mysteryBoxDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_MYSTERY_BOX_DETAILS_RESPONSE:
      return {
        ...state,
        mysteryBoxDetails: null,
        resStatus: '',
        resMessage: ''
      }
    case GET_LOOT_BOXES:
      return {
        ...state,
        lootBoxes: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_LOOT_BOXES_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    case GET_LOOT_BOX_DETAILS:
      return {
        ...state,
        lootBoxDetails: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_LOOT_BOX_DETAILS_RESPONSE:
      return {
        ...state,
        mysteryBoxDetails: null,
        resStatus: '',
        resMessage: ''
      }

    default:
      return state
  }
}
