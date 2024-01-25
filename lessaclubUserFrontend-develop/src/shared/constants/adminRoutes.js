export const adminRoutes = {
  home: '/admin/home',
  categories: '/admin/categories',
  customers: '/admin/customers',
  assets: '/admin/assets',
  analytics: '/admin/analytics',
  settings: '/admin/settings',
  manageBanners: '/admin/manage-banners',
  api: '/admin/api',
  previewApi: (id) => `/admin/api-preview/${id}`,
  nuuCoin: '/admin/nuuCoin',
  transactions: '/admin/transactions',
  transactionDetails: (id) => `/admin/transaction-details/${id}`,
  orders: '/admin/orders',
  donations: '/admin/donations',
  policy: '/admin/policy',
  downloads: '/admin/downloads'
}
