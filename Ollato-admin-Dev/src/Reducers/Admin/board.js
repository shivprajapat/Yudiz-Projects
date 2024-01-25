import constants from '../../Shared/Types/constants'

/* initial state */
const initialAuthState = {
  resStatus: null,
  resMessage: null,
  isBoardAdded: null,
  boardsList: null,
  boardCount: null,
  specificBoardData: null,
  isBoardEdited: null,
  isDeleted: null,
  isLoading: false

}

export default (state = initialAuthState, action) => {
  switch (action.type) {
    case constants.ADD_BOARD_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isBoardAdded: action.payload.isBoardAdded
      }
    case constants.CLEAR_ADD_BOARD_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isBoardAdded: null
      }
    case constants.GET_ALL_BOARD_DATA:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        boardList: action.payload.boardList,
        boardCount: action.payload.boardCount,
        isLoading: false
      }
    case constants.CLEAR_GET_ALL_BOARD_DATA:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        boardCount: null,
        isLoading: true
      }
    case constants.GET_SPECIFIC_BOARD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        specificBoardData: action.payload.specificBoardData
      }
    case constants.CLEAR_GET_SPECIFIC_BOARD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        specificBoardData: null
      }
    case constants.EDIT_SPECIFIC_BOARD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isBoardEdited: action.payload.isBoardEdited
      }
    case constants.CLEAR_EDIT_SPECIFIC_BOARD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isBoardEdited: null
      }
    case constants.DELETE_BOARD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        isDeleted: action.payload.isDeleted
      }
    case constants.CLEAR_DELETE_BOARD:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        isDeleted: null
      }
    default:
      return state
  }
}
