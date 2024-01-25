export const allRoutes = {
  login: '/',
  admin: '/admin',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  editProfile: '/profile',
  analytics: '/analytics',
  clientAnalytics: (iClientId) => `/clients/analytics/${iClientId}`,
  clients: '/clients',
  addClient: '/clients/add',
  editClient: (iClientId) => `/clients/edit/${iClientId}`,
  secrets: '/secrets',
  subscription: '/subscription',
  clientQuery: '/client-query'
}
