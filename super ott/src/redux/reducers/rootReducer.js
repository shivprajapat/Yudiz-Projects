// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import category from './category-management'
import genre from './genre'
import cast from './cast'
import user from './user'
import movie from './movie'
import webSeries from './web-series'
import episode from './episode'

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  category,
  genre,
  cast,
  user,
  movie,
  webSeries,
  episode
})

export default rootReducer
