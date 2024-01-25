export default (state = { }, action) => {
  switch (action.type) {
    case 'USER_TOKEN':
      return {
        ...state,
        token: action.payload
      }
    default:
      return state
  }
}
