import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import { storeReducer } from '../reducer/headerReducers/index'
import { productFilterReducer } from '../reducer/productFilterReducer'
import { productDetails } from '@/reducer/productDetailReducer'
import { productSearchReducer } from '@/reducer/productSearchReducer'
import { cartReducer } from '@/reducer//cartReducers'
import { toast } from '@/reducer/toastReducers'
import { productWishlistReducer } from '@/reducer/productWishlistReducer'
import { accountReducer } from '@/reducer/accountDetailReducer'
const rootReducer = combineReducers({
  // Add your reducers here
  storeReducer,
  productDetails,
  productFilterReducer,
  productSearchReducer,
  toast,
  cartReducer,
  productWishlistReducer,
  accountReducer,
})

const composeEnhancers =
  typeof window !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export default store
