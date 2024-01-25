import { createStore, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'

import reducers from 'redux/reducers'

const componentEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(reducers, {}, componentEnhancers(applyMiddleware(ReduxThunk)))
