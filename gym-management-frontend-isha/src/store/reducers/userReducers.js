export default (state = {
    userToken: '',
    user: ''
}, action) => {
    switch (action.type) {
        case 'USER_TOKEN':
            return {
                ...state,
                userToken: action.payload
            }
        case 'USER':
            return {
                ...state,
                user: action.payload
            }
        default:
            return state
    }
}
