import { createStore, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'

import reducers from './reducers'

const componentEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(reducers, {}, componentEnhancers(applyMiddleware(ReduxThunk)))
