import { combineReducers } from 'redux'

import { auth } from 'modules/auth/redux/reducer'
import { user } from 'modules/user/redux/reducer'
import { explore } from 'modules/explore/redux/reducer'
import { lang } from 'modules/lang/redux/reducer'
import { toast } from 'modules/toast/redux/reducer'
import { category } from 'modules/category/redux/reducer'
import { truliooKyc } from 'modules/truliooKyc/redux/reducer'
import { currencyConverter } from 'modules/currencyConverter/redux/reducer'
import { asset } from 'modules/assets/redux/reducer'
import { checkout } from 'modules/checkout/redux/reducer'
import { wallet } from 'modules/wallet/redux/reducer'
import { orders } from 'modules/orders/redux/reducer'
import { auction } from 'modules/auction/redux/reducer'
import { exchangeRate } from 'modules/exchangeRate/redux/reducer'
import { nuuCoins } from 'modules/nuuCoins/redux/reducer'

export default combineReducers({
  auth,
  user,
  explore,
  lang,
  toast,
  category,
  truliooKyc,
  currencyConverter,
  asset,
  checkout,
  wallet,
  orders,
  auction,
  exchangeRate,
  nuuCoins
})
