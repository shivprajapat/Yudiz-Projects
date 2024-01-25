// ** Initial State
const initialState = {
  suggestions: [],
  bookmarks: [],
  query: ''
}

const navbarReducer = (state = initialState, action) => {
  let objectToUpdate
  switch (action.type) {
    case 'HANDLE_SEARCH_QUERY':
      return { ...state, query: action.val }
    case 'GET_BOOKMARKS':
      return { ...state, suggestions: action.data, bookmarks: action.bookmarks }
    case 'UPDATE_BOOKMARKED':
      // ** find & update object
      // eslint-disable-next-line array-callback-return
      state.suggestions.find((item) => {
        if (item.id === action.id) {
          item.isBookmarked = !item.isBookmarked
          objectToUpdate = item
        }
      })

      // ** Get index to add or remove bookmark from array
      // eslint-disable-next-line no-case-declarations
      const bookmarkIndex = state.bookmarks.findIndex((x) => x.id === action.id)

      if (bookmarkIndex === -1) {
        state.bookmarks.push(objectToUpdate)
      } else {
        state.bookmarks.splice(bookmarkIndex, 1)
      }

      return { ...state }
    default:
      return state
  }
}

export default navbarReducer
