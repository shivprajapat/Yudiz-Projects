export const route = {
  login: '/login',
  forgetPassword: '/forgot-password',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  projectOverview: '/project-overview',
  employeeManagement: '/employee-management',
  employeeManagementAdd: '/employee-management/add',
  employeeManagementDetail: (id) => `/employee-management/detail/${id}`,
  employeeManagementDetailProject: (id) => `/employee-management/detail/${id}/projects`,
  employeeManagementDetailInterview: (id) => `/employee-management/detail/${id}/interviews`,
  employeeManagementDetailReview: (id) => `/employee-management/detail/${id}/reviews`,
  employeeManagementEdit: (id, type) => `/employee-management/${type}/${id}`,
  projects: '/projects',
  projectAdd: '/projects/add',
  projectDetail: (id) => `/projects/detail/${id}`,
  projectEdit: (id, type) => `/projects/${type}/${id}`,
  interviews: '/interviews',
  interviewAdd: '/interviews/Add',
  interviewDetail: (id) => `/interviews/detail/${id}`,
  interviewEdit: (id, type) => `/interviews/${type}/${id}`,
  skillManagement: '/skill-management',
  clientManagement: '/client-management',
  clientManagementAdd: '/client-management/add',
  clientManagementDetail: (id) => `/client-management/detail/${id}`,
  clientManagementEdit: (id, type) => `/client-management/${type}/${id}`,
  changePassword: '/change-password',
  editProfile: '/edit-profile',
  myProfile: '/my-profile',
  departmentManagement: '/department-management',
  departmentManagementDetail: (id) => `/department-management/detail/${id}`,
  workLog: '/work-log',
  // changeRequest: '/change-request',
  // changeRequestAdd: '/change-request/add',
  // changeRequestEdit: (id, type) => `/change-request/${type}/${id}`,
  // changeRequestDetail: (id) => `/change-request/detail/${id}`,
  officeMasterManagement: '/office-master-management',
  jobProfile: '/job-Profile',
  technologyMaster: '/technology',
  closedProject: '/closed-project',
  closedProjectDetail: (id) => `/closed-project/detail/${id}`
}
