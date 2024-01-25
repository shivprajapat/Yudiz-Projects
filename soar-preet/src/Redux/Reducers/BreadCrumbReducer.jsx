import { CLEAR_BREADCRUMB, SET_BREADCRUMB, UPDATE_BREADCRUMB } from 'Redux/Actions/ActionTypes'

const initialState = []

const breadcrumbReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BREADCRUMB:
      return state.concat(action.breadcrumb)
    case CLEAR_BREADCRUMB:
      return []
    case UPDATE_BREADCRUMB:
      const { index } = action

      const updatedBreadcrumb = state.slice(0, index + 1)

      return updatedBreadcrumb
    default:
      return state
  }
}

export default breadcrumbReducer
