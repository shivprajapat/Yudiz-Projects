import React from 'react'
import { adminRoutes } from 'shared/constants/adminRoutes'
import { allRoutes } from 'shared/constants/allRoutes'

const Login = React.lazy(() => import('pages/login'))
const Signup = React.lazy(() => import('pages/signup'))
const SetPassword = React.lazy(() => import('pages/set-password'))
const ForgotPassword = React.lazy(() => import('pages/forgot-password'))
const ChangePassword = React.lazy(() => import('pages/change-password'))
const CreateAsset = React.lazy(() => import('pages/create-asset'))
const Profile = React.lazy(() => import('pages/profile'))
const Checkout = React.lazy(() => import('pages/checkout'))
const MysteryBoxCheckout = React.lazy(() => import('pages/mystery-box-checkout'))
const LootBoxCheckout = React.lazy(() => import('pages/loot-box-checkout'))
const Nuucoins = React.lazy(() => import('pages/nuucoins'))
const Donate = React.lazy(() => import('pages/donate'))
const Referrals = React.lazy(() => import('pages/referrals'))
const Home = React.lazy(() => import('pages/home'))
const Explore = React.lazy(() => import('pages/explore'))
const Auction = React.lazy(() => import('pages/auction'))
const AssetDetails = React.lazy(() => import('pages/asset-details-view'))
const TermsAndConditions = React.lazy(() => import('pages/terms-and-conditions'))
const PrivacyPolicy = React.lazy(() => import('pages/privacy-policy'))
const Community = React.lazy(() => import('pages/community'))
const Crates = React.lazy(() => import('pages/crates'))
const EditProfile = React.lazy(() => import('pages/edit-profile'))
const ProfileCollected = React.lazy(() => import('pages/profile-collected'))
const ProfileCreated = React.lazy(() => import('pages/profile-created'))
const ProfileCommunities = React.lazy(() => import('pages/profile-communities'))
const ProfilePrivate = React.lazy(() => import('pages/profile-private'))
const ProfileWishlist = React.lazy(() => import('pages/profile-wishlist'))
const ProfileMyWallets = React.lazy(() => import('pages/profile-my-wallets'))
const ProfileOrders = React.lazy(() => import('pages/profile-orders'))
const ProfileOrdersToSend = React.lazy(() => import('pages/profile-orders-to-send'))
const ProfileCardsAndAddresses = React.lazy(() => import('pages/profile-cards-and-addresses'))
const PurchaseNuucoins = React.lazy(() => import('pages/purchase-nuucoins'))
const CreatePost = React.lazy(() => import('pages/create-post'))
const FinalizePost = React.lazy(() => import('pages/finalize-post'))
const PostDetails = React.lazy(() => import('pages/post-details'))
const Communities = React.lazy(() => import('pages/communities'))
const MyPosts = React.lazy(() => import('pages/my-posts'))
const Drop = React.lazy(() => import('pages/drop'))
const MyDrops = React.lazy(() => import('pages/my-drops'))
const TrendingNfts = React.lazy(() => import('pages/trending-nfts'))
const OrderDetails = React.lazy(() => import('pages/order-details'))
const GiftAsset = React.lazy(() => import('pages/gift-asset'))
const DonatePayment = React.lazy(() => import('pages/donate-payment'))
const Faq = React.lazy(() => import('pages/faq'))
const ProfileTransactions = React.lazy(() => import('pages/profile-transactions'))

// admin routes with user layout
const AdminCreateMysteryLootBox = React.lazy(() => import('pages/create-mystery-loot-box'))
const MysteryBoxDetails = React.lazy(() => import('pages/crate-details/mystery-box'))
const LootBoxDetails = React.lazy(() => import('pages/crate-details/loot-box'))
const CustomerSupport = React.lazy(() => import('pages/customer-support'))

// admin routes
const AdminAnalytics = React.lazy(() => import('admin/pages/analytics'))
const AdminCustomers = React.lazy(() => import('admin/pages/customers'))
const AdminAssets = React.lazy(() => import('admin/pages/assets'))
const AdminSettings = React.lazy(() => import('admin/pages/settings'))
const AdminManageBanners = React.lazy(() => import('admin/modules/banners/index'))
const AdminApis = React.lazy(() => import('admin/modules/api/index'))
const AdminCategory = React.lazy(() => import('admin/pages/categories'))
const AdminDownloads = React.lazy(() => import('admin/modules/downloads'))
const AdminPolicy = React.lazy(() => import('admin/pages/policy'))
const nuuCoinSettings = React.lazy(() => import('admin/modules/nuucoin/index'))
const PreviewAsset = React.lazy(() => import('shared/components/asset-preview'))
const ApiPreview = React.lazy(() => import('admin/modules/api/api-preview'))
const AdminOrders = React.lazy(() => import('admin/pages/orders'))
const Transactions = React.lazy(() => import('admin/modules/transaction/index'))
const transactionDetails = React.lazy(() => import('admin/modules/transaction/TransactionDetails'))
const Donations = React.lazy(() => import('admin/modules/donations/index'))

const Router = [
  {
    path: '',
    isAuth: true,
    children: [
      { path: allRoutes.changePassword, component: ChangePassword, exact: true, isAuth: true, isForChangePassword: true },
      { path: allRoutes.login, component: Login, exact: true, isAuth: true },
      { path: allRoutes.signUp, component: Signup, exact: true, isAuth: true },
      { path: allRoutes.setPassword, component: SetPassword, exact: true, isAuth: true, isForPassword: true },
      { path: allRoutes.forgotPassword, component: ForgotPassword, exact: true, isAuth: true, isForPassword: true }
    ]
  },
  {
    path: '',
    isAuth: false,
    children: [
      { path: allRoutes.home, component: Home, exact: true },
      { path: allRoutes.explore, component: Explore, exact: true },
      { path: allRoutes.auction, component: Auction, exact: true },
      { path: allRoutes.dropAssets(':id'), component: Explore, exact: true },
      { path: allRoutes.termsAndConditions, component: TermsAndConditions, exact: true },
      { path: allRoutes.privacyPolicy, component: PrivacyPolicy, exact: true },
      { path: allRoutes.resellAssetDetails(':type', ':id'), component: AssetDetails, exact: true },
      { path: allRoutes.assetDetails(':id'), component: AssetDetails, exact: true },
      { path: allRoutes.resellCreateAsset(':type', ':id', ':assetId'), component: CreateAsset, exact: true },
      { path: allRoutes.createAsset, component: CreateAsset, exact: true },
      { path: allRoutes.checkout(':id'), component: Checkout, exact: true },
      { path: allRoutes.mysteryBoxCheckout(':id'), component: MysteryBoxCheckout, exact: true },
      { path: allRoutes.lootBoxCheckout(':id'), component: LootBoxCheckout, exact: true },
      { path: allRoutes.nuuCoins, component: Nuucoins, exact: true },
      { path: allRoutes.donate, component: Donate, exact: true },
      { path: allRoutes.referrals, component: Referrals, exact: true },
      { path: allRoutes.editViewCommunity(':id'), component: Community, exact: true },
      { path: allRoutes.community, component: Community, exact: true },
      { path: allRoutes.giftAsset(':id'), component: GiftAsset, exact: true },
      {
        path: allRoutes.profile,
        component: Profile,
        exact: true,
        isNested: true,
        nestedChild: [
          { nestedComponent: ProfileCollected, exact: true, path: allRoutes.profileChildRoutes.collected },
          { nestedComponent: ProfileCreated, exact: true, path: allRoutes.profileChildRoutes.created },
          { nestedComponent: ProfileCommunities, exact: true, path: allRoutes.profileChildRoutes.communities },
          { nestedComponent: ProfilePrivate, exact: true, path: allRoutes.profileChildRoutes.private },
          { nestedComponent: ProfileWishlist, exact: true, path: allRoutes.profileChildRoutes.wishlist },
          { nestedComponent: ProfileMyWallets, exact: true, path: allRoutes.profileChildRoutes.myWallets },
          { nestedComponent: ProfileOrders, exact: true, path: allRoutes.profileChildRoutes.orders },
          { nestedComponent: ProfileOrdersToSend, exact: true, path: allRoutes.profileChildRoutes.orderToSend },
          { nestedComponent: ProfileCardsAndAddresses, exact: true, path: allRoutes.profileChildRoutes.cardsAndAddresses },
          { nestedComponent: ProfileTransactions, exact: true, path: allRoutes.profileChildRoutes.transactions }
        ]
      },
      {
        path: allRoutes.creatorProfile,
        component: Profile,
        exact: true,
        isNested: true,
        nestedChild: [
          { nestedComponent: ProfileCollected, exact: true, path: allRoutes.creatorCollected(':id') },
          { nestedComponent: ProfileCreated, exact: true, path: allRoutes.creatorCreated(':id') },
          { nestedComponent: ProfileCommunities, exact: true, path: allRoutes.creatorCommunities(':id') }
        ]
      },
      { path: allRoutes.crates, component: Crates, exact: true },
      { path: allRoutes.editProfile, component: EditProfile, exact: true },
      { path: allRoutes.purchaseNuuCoins, component: PurchaseNuucoins, exact: true },
      { path: allRoutes.createPost, component: CreatePost, exact: true },
      { path: allRoutes.editPost(':id'), component: CreatePost, exact: true },
      { path: allRoutes.finalizePost(':id'), component: FinalizePost, exact: true },
      { path: allRoutes.postDetails(':id'), component: PostDetails, exact: true },
      { path: allRoutes.communities, component: Communities, exact: true },
      { path: allRoutes.myPosts, component: MyPosts, exact: true },
      { path: allRoutes.drop, component: Drop, exact: true },
      { path: allRoutes.myDrops, component: MyDrops, exact: true },
      { path: allRoutes.trendingNfts, component: TrendingNfts, exact: true },
      { path: allRoutes.orderDetails, component: OrderDetails, exact: true },
      { path: allRoutes.createMysteryLootBox, component: AdminCreateMysteryLootBox, exact: true },
      { path: allRoutes.mysteryBoxDetails(':id'), component: MysteryBoxDetails, exact: true },
      { path: allRoutes.lootBoxDetails(':id'), component: LootBoxDetails, exact: true },
      { path: allRoutes.adminAssetDetails(':type', ':id'), component: AssetDetails, exact: true },
      { path: allRoutes.previewAsset(':link'), component: PreviewAsset, exact: true },
      { path: allRoutes.donatePayment, component: DonatePayment, exact: true },
      { path: allRoutes.faq, component: Faq, exact: true },
      { path: allRoutes.customerSupport, component: CustomerSupport, exact: true }
    ]
  },
  {
    path: '',
    isAuth: false,
    isAdmin: true,
    children: [
      { path: adminRoutes.analytics, component: AdminAnalytics, exact: true },
      { path: adminRoutes.customers, component: AdminCustomers, exact: true },
      { path: adminRoutes.assets, component: AdminAssets, exact: true },
      { path: adminRoutes.settings, component: AdminSettings, exact: true },
      { path: adminRoutes.manageBanners, component: AdminManageBanners, exact: true },
      { path: adminRoutes.api, component: AdminApis, exact: true },
      { path: adminRoutes.previewApi(':id'), component: ApiPreview, exact: true },
      { path: adminRoutes.nuuCoin, component: nuuCoinSettings, exact: true },
      { path: adminRoutes.transactions, component: Transactions, exact: true },
      { path: adminRoutes.orders, component: AdminOrders, exact: true },
      { path: adminRoutes.categories, component: AdminCategory, exact: true },
      { path: adminRoutes.downloads, component: AdminDownloads, exact: true },
      { path: adminRoutes.transactionDetails(':id'), component: transactionDetails, exact: true },
      { path: adminRoutes.donations, component: Donations, exact: true },
      { path: adminRoutes.policy, component: AdminPolicy, exact: true }
    ]
  }
]

export default Router
