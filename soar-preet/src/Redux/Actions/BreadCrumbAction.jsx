import { CLEAR_BREADCRUMB, SET_BREADCRUMB, UPDATE_BREADCRUMB } from './ActionTypes'

export const setBreadcrumb = (breadcrumb) => {
  return {
    type: SET_BREADCRUMB,
    breadcrumb
  }
}

export const clearBreadCrumb = () => ({
  type: CLEAR_BREADCRUMB
})

export const updateBreadCrumb = (clickedPath, index) => {
  return {
    type: UPDATE_BREADCRUMB,
    clickedPath,
    index
  }
}
