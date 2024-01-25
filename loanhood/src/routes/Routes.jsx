import React from 'react'

const Login = React.lazy(() => import('views/auth/login'))
const Transactions = React.lazy(() => import('views/transactions'))
const AccessCodes = React.lazy(() => import('views/access-codes/access-code-list'))
const Notifications = React.lazy(() => import('views/notifications'))
const Reports = React.lazy(() => import('views/reports/reports-list'))
const ReportDetail = React.lazy(() => import('views/reports/reports-detail'))
const Chat = React.lazy(() => import('views/chat'))
const Rentals = React.lazy(() => import('views/rentals/rentals-list'))
const RentalDetail = React.lazy(() => import('views/rentals/rental-detail'))
const RentalTransactionDetail = React.lazy(() => import('views/rentals/rental-transaction-detail'))
const UsersList = React.lazy(() => import('views/users/users-list'))
const UserAdd = React.lazy(() => import('views/users/user-add'))
const UserDetail = React.lazy(() => import('views/users/user-detail'))
const Brands = React.lazy(() => import('views/meta/brands'))
const BrandAddEdit = React.lazy(() => import('views/meta/brand-add-edit'))
const Materials = React.lazy(() => import('views/meta/materials'))
const MaterialAddEdit = React.lazy(() => import('views/meta/material-add-edit'))
const Colors = React.lazy(() => import('views/meta/colors'))
const ColorAddEdit = React.lazy(() => import('views/meta/color-add-edit'))
const Categories = React.lazy(() => import('views/meta/categories'))
const CategoryAddEdit = React.lazy(() => import('views/meta/category-add-edit'))
const SubCategories = React.lazy(() => import('views/meta/sub-categories'))
const SubCategoryAddEdit = React.lazy(() => import('views/meta/sub-category-add-edit'))
const SizeGroups = React.lazy(() => import('views/meta/size-groups'))
const SizeGroupAddEdit = React.lazy(() => import('views/meta/size-group-add-edit'))
const Sizes = React.lazy(() => import('views/meta/sizes'))
const SizesAddEdit = React.lazy(() => import('views/meta/sizes-add-edit'))
const SplashScreen = React.lazy(() => import('views/app/splash-screen'))
const SplashScreenAddEdit = React.lazy(() => import('views/app/splash-screen-add-edit'))
const BannerTexts = React.lazy(() => import('views/app/banner-texts'))
const BannerTextAddEdit = React.lazy(() => import('views/app/banner-text-add-edit'))
const BannerImages = React.lazy(() => import('views/app/banner-images'))
const BannerImageAddEdit = React.lazy(() => import('views/app/banner-image-add-edit'))
const AccessCodesAddEdit = React.lazy(() => import('views/access-codes/access-code-add-edit'))
const Fees = React.lazy(() => import('views/fees'))

const Routes = [
  {
    path: '/',
    isRequiredLoggedIn: false,
    children: [{ path: '', component: Login, exact: true }]
  },
  {
    path: '/',
    isRequiredLoggedIn: true,
    children: [
      { path: 'transactions', component: Transactions, exact: true },
      { path: 'reports', component: Reports, exact: true },
      { path: 'reports/?page=page', component: Reports, exact: true },
      { path: 'reports/:type/:id', component: ReportDetail, exact: true },
      { path: 'notifications', component: Notifications, exact: true },
      { path: 'chat', component: Chat, exact: true },
      { path: 'chat/:rentalTransactionId/sender/:senderId/receiver/:receiverId', component: Chat, exact: true },
      { path: 'rentals', component: Rentals, exact: true },
      { path: 'rentals/?page=page', component: Rentals, exact: true },
      { path: 'rentals/add', component: RentalDetail, exact: true },
      { path: 'rentals/:type/:id', component: RentalDetail, exact: true },
      { path: 'rentals/transaction/:type/:id', component: RentalTransactionDetail, exact: true },
      { path: 'users', component: UsersList, exact: true },
      { path: 'users/?page=page', component: UsersList, exact: true },
      { path: 'users/add', component: UserAdd, exact: true },
      { path: 'users/:type/:id', component: UserDetail, exact: true },
      { path: 'brands', component: Brands, exact: true },
      { path: 'brands/add', component: BrandAddEdit, exact: true },
      { path: 'brands/:type/:id', component: BrandAddEdit, exact: true },
      { path: 'materials', component: Materials, exact: true },
      { path: 'materials/add', component: MaterialAddEdit, exact: true },
      { path: 'materials/:type/:id', component: MaterialAddEdit, exact: true },
      { path: 'colors', component: Colors, exact: true },
      { path: 'colors/add', component: ColorAddEdit, exact: true },
      { path: 'colors/:type/:id', component: ColorAddEdit, exact: true },
      { path: 'categories', component: Categories, exact: true },
      { path: 'categories/add', component: CategoryAddEdit, exact: true },
      { path: 'categories/edit/:id', component: CategoryAddEdit, exact: true },
      { path: 'categories/:id/sub-categories', component: SubCategories, exact: true },
      { path: 'categories/:categoryId/sub-categories/add', component: SubCategoryAddEdit, exact: true },
      { path: 'categories/:categoryId/sub-categories/:type/:id', component: SubCategoryAddEdit, exact: true },
      { path: 'size-groups', component: SizeGroups, exact: true },
      { path: 'size-groups/add', component: SizeGroupAddEdit, exact: true },
      { path: 'size-groups/edit/:id', component: SizeGroupAddEdit, exact: true },
      { path: 'size-groups/:id/sizes', component: Sizes, exact: true },
      { path: 'size-groups/:sizegroupId/sizes/add', component: SizesAddEdit, exact: true },
      { path: 'size-groups/:sizegroupId/sizes/:type/:id', component: SizesAddEdit, exact: true },
      { path: 'splash-screen', component: SplashScreen, exact: true },
      { path: 'splash-screen/add', component: SplashScreenAddEdit, exact: true },
      { path: 'splash-screen/:type/:id', component: SplashScreenAddEdit, exact: true },
      { path: 'banner-texts', component: BannerTexts, exact: true },
      { path: 'banner-texts/add', component: BannerTextAddEdit, exact: true },
      { path: 'banner-texts/:type/:id', component: BannerTextAddEdit, exact: true },
      { path: 'banner-images', component: BannerImages, exact: true },
      { path: 'banner-images/add', component: BannerImageAddEdit, exact: true },
      { path: 'banner-images/:type/:id', component: BannerImageAddEdit, exact: true },
      { path: 'access-codes', component: AccessCodes, exact: true },
      { path: 'access-codes/add', component: AccessCodesAddEdit, exact: true },
      { path: 'access-codes/:type/:id', component: AccessCodesAddEdit, exact: true },
      { path: 'fees', component: Fees, exact: true }
    ]
  }
]
export default Routes
