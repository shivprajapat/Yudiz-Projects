export const route = {
  login: '/',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  editProfile: '/dashboard/profile',
  dashboard: '/dashboard',
  subAdmins: '/sub-admins',
  languages: '/languages',
  addSubAdmins: '/sub-admins/add-sub-admins',
  editSubAdmins: (id) => `/sub-admins/edit-sub-admin/${id}`,
  customerManagement: '/customer-management',
  customerView: (id) => `/customer-management/customer/${id}`,
  categoryManagement: '/category-management'
  // roles: '/settings/roles'
}
