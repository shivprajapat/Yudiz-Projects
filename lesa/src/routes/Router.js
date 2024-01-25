import React from 'react'

import { allRoutes } from 'shared/constants/allRoutes'

const Login = React.lazy(() => import('pages/login'))
const Signup = React.lazy(() => import('pages/signup'))
const SetPassword = React.lazy(() => import('pages/set-password'))
const ForgotPassword = React.lazy(() => import('pages/forgot-password'))

const ChangePassword = React.lazy(() => import('pages/change-password'))
const CreateAsset = React.lazy(() => import('pages/create-asset'))
const Profile = React.lazy(() => import('pages/profile'))
const Checkout = React.lazy(() => import('pages/checkout'))
const Nuucoins = React.lazy(() => import('pages/nuucoins'))
const Donate = React.lazy(() => import('pages/donate'))
const Referrals = React.lazy(() => import('pages/referrals'))

const Home = React.lazy(() => import('pages/home'))
const Explore = React.lazy(() => import('pages/explore'))
const AssetDetails = React.lazy(() => import('pages/asset-details'))
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
const ProfileCardsAndAddresses = React.lazy(() => import('pages/profile-cards-and-addresses'))
const PurchaseNuucoins = React.lazy(() => import('pages/purchase-nuucoins'))

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
      { path: allRoutes.termsAndConditions, component: TermsAndConditions, exact: true },
      { path: allRoutes.privacyPolicy, component: PrivacyPolicy, exact: true },
      { path: allRoutes.assetDetails(':id'), component: AssetDetails, exact: true },
      { path: allRoutes.resellAssetDetails(':type', ':id'), component: AssetDetails, exact: true },
      { path: allRoutes.createAsset, component: CreateAsset, exact: true },
      { path: allRoutes.resellCreateAsset(':type', ':id'), component: CreateAsset, exact: true },
      { path: allRoutes.checkout(':id'), component: Checkout, exact: true },
      { path: allRoutes.nuucoins, component: Nuucoins, exact: true },
      { path: allRoutes.donate, component: Donate, exact: true },
      { path: allRoutes.referrals, component: Referrals, exact: true },
      { path: allRoutes.community, component: Community, exact: true },
      {
        path: allRoutes.profile,
        component: Profile,
        exact: true,
        isNested: true,
        nestedChild: [
          { nestedComponent: ProfileCollected, exact: true, path: allRoutes.profileNested.collected },
          { nestedComponent: ProfileCreated, exact: true, path: allRoutes.profileNested.created },
          { nestedComponent: ProfileCommunities, exact: true, path: allRoutes.profileNested.communities },
          { nestedComponent: ProfilePrivate, exact: true, path: allRoutes.profileNested.private },
          { nestedComponent: ProfileWishlist, exact: true, path: allRoutes.profileNested.wishlist },
          { nestedComponent: ProfileMyWallets, exact: true, path: allRoutes.profileNested.myWallets },
          { nestedComponent: ProfileOrders, exact: true, path: allRoutes.profileNested.orders },
          { nestedComponent: ProfileCardsAndAddresses, exact: true, path: allRoutes.profileNested.cardsAndAddresses }
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
      { path: allRoutes.purchaseNuucoins, component: PurchaseNuucoins, exact: true }
    ]
  }
]

export default Router
