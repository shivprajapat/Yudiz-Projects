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
import { communities } from 'modules/communities/redux/reducer'
import { post } from 'modules/post/redux/reducer'
import { comments } from 'modules/comments/redux/reducer'
import { follower } from 'modules/follower/redux/reducer'
import { paymentCards } from 'modules/paymentCard/redux/reducer'
import { drop } from 'modules/drop/redux/reducer'
import { wishlist } from 'modules/wishlist/redux/reducer'
import { crates } from 'modules/crates/redux/reducer'
import { address } from 'modules/address/redux/reducer'
import { card } from 'modules/card/redux/reducer'
import { referral } from 'modules/referral/redux/reducer'
import { gift } from 'modules/gifts/redux/reducer'
import { notifications } from 'modules/pushNotifications/redux/reducer'
import { donate } from 'modules/donate/redux/reducer'
import { manualLogistics } from 'modules/manualLogistics/redux/reducer'

// admin
import { adminUser } from 'admin/modules/user/redux/reducer'
import { adminAssetManagement } from 'admin/modules/assetManagement/redux/reducer'
import { adminSettings } from 'admin/modules/adminSettings/redux/reducer'
import { bannerManagement } from 'admin/modules/banners/redux/reducer'
import { adminOrders } from 'admin/modules/orders/redux/reducer'

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
  nuuCoins,
  communities,
  post,
  comments,
  follower,
  paymentCards,
  drop,
  wishlist,
  crates,
  address,
  card,
  adminUser,
  adminAssetManagement,
  adminSettings,
  adminOrders,
  referral,
  bannerManagement,
  gift,
  notifications,
  donate,
  manualLogistics
})
