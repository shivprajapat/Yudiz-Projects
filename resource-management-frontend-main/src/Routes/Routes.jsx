import { lazy } from 'react'
import { route } from './route'
import { permissionsName } from 'helpers'

const PublicRoute = lazy(() => import('./PublicRoute'))
const PrivateRoute = lazy(() => import('./PrivateRoute'))

// public Routes Files
const Login = lazy(() => import('Pages/Auth/Login'))
const ForgotPassword = lazy(() => import('Pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('Pages/Auth/ResetPassword'))

// Private Routes Files
const Dashboard = lazy(() => import('Pages/Dashboard'))
const ProjectOverview = lazy(() => import('Pages/Project-Overview'))
const EmployeeManagement = lazy(() => import('Pages/Employee-Management'))
const AddEmployee = lazy(() => import('Pages/Employee-Management/Add-Employee'))
const Projects = lazy(() => import('Pages/Projects'))
const AddProject = lazy(() => import('Pages/Projects/Add-Project'))
const ProjectDetails = lazy(() => import('Pages/Projects/Project-Details/Project-Details'))
const SkillManagement = lazy(() => import('Pages/Skill-Management'))
const ClientManagement = lazy(() => import('Pages/Client-Management'))
const AddClient = lazy(() => import('Pages/Client-Management/NewClient'))
const ChangePassword = lazy(() => import('Pages/Change-Password'))
const EmployeeDetail = lazy(() => import('Pages/Employee-Management/Employee-Detail'))
const EmployeeManagementProjects = lazy(() => import('Pages/Employee-Management/Employee-Detail/Employee-Detail-Projects'))
const EmployeeManagementInterviews = lazy(() => import('Pages/Employee-Management/Employee-Detail/Employee-Detail-Interviews'))
const EmployeeManagementReviews = lazy(() => import('Pages/Employee-Management/Employee-Detail/Employee-Detail-Reviews'))
const DepartmentManagement = lazy(() => import('Pages/Department-Management'))
const DepartmentManagementDetail = lazy(() => import('Pages/Department-Management/Department-Management-Detail'))
const ClientDetail = lazy(() => import('Pages/Client-Management/Client-details'))
// const EditMyProfile = lazy(() => import('Pages/Edit-My-Profile'))
const MyProfile = lazy(() => import('Pages/My-Profile'))
const WorkLog = lazy(() => import('Pages/Worklog'))
// const ChangeRequest = lazy(() => import('Pages/Change-Request'))
// const AddChangeRequest = lazy(() => import('Pages/Change-Request/Add-Change-Request'))

// const Interviews = lazy(() => import('Pages/Interviews'))
// const AddInterview = lazy(() => import('Pages/Interviews/AddInterview'))
// const InterviewDetail = lazy(() => import('Pages/Interviews/interview-detail'))
const OfficeMasterManagement = lazy(() => import('Pages/Office-Master-Management'))
const JObProfile = lazy(() => import('Pages/Job-Profile'))
const TechnologyMaster = lazy(() => import('Pages/Technology-Master'))
const ClosedProject = lazy(() => import('Pages/Closed-Project'))
const ClosedProjectDetails = lazy(() => import('Pages/Projects/Project-Details/Project-Details'))

const RoutesDetails = [
  {
    defaultRoute: '',
    Component: PublicRoute,
    props: {},
    isPrivateRoute: false,
    children: [
      { path: '/login', Component: Login, exact: true },
      { path: '/forgot-password', Component: ForgotPassword, exact: true },
      { path: '/reset-password', Component: ResetPassword, exact: true },
    ],
  },
  {
    defaultRoute: '',
    Component: PrivateRoute,
    props: {},
    isPrivateRoute: true,
    children: [
      { path: route.dashboard, Component: Dashboard, allowed: 'noRole', exact: true },
      { path: route.projectOverview, Component: ProjectOverview, allowed: permissionsName.VIEW_PROJECT_OVERVIEW, exact: true },
      { path: route.employeeManagement, Component: EmployeeManagement, allowed: permissionsName.VIEW_EMPLOYEE, exact: true },
      { path: route.employeeManagementAdd, Component: AddEmployee, allowed: permissionsName.CREATE_EMPLOYEE, exact: true },
      { path: route.employeeManagementDetail(':id'), Component: EmployeeDetail, allowed: permissionsName.VIEW_EMPLOYEE, exact: true },
      { path: route.employeeManagementDetailProject(':id'), Component: EmployeeManagementProjects, allowed: 'noRole', exact: true },
      { path: route.employeeManagementDetailInterview(':id'), Component: EmployeeManagementInterviews, allowed: 'noRole', exact: true },
      { path: route.employeeManagementDetailReview(':id'), Component: EmployeeManagementReviews, allowed: 'noRole', exact: true },
      { path: route.employeeManagementEdit(':id', ':type'), Component: AddEmployee, allowed: permissionsName.UPDATE_EMPLOYEE, exact: true },
      { path: route.projects, Component: Projects, allowed: permissionsName.VIEW_PROJECT, exact: true },
      { path: route.projectAdd, Component: AddProject, allowed: permissionsName.CREATE_PROJECT, exact: true },
      { path: route.projectDetail(':id'), Component: ProjectDetails, allowed: permissionsName.VIEW_PROJECT, exact: true },
      { path: route.projectEdit(':id', ':type'), Component: AddProject, allowed: permissionsName.UPDATE_PROJECT, exact: true },
      // { path: route.interviews, Component: Interviews, exact: true },
      // { path: route.interviewAdd, Component: AddInterview, exact: true },
      // { path: route.interviewDetail(':id'), Component: InterviewDetail, exact: true },
      // { path: route.interviewEdit(':id', ':type'), Component: AddInterview, exact: true },
      { path: route.skillManagement, Component: SkillManagement, allowed: permissionsName.VIEW_SKILL, exact: true },
      { path: route.clientManagement, Component: ClientManagement, allowed: permissionsName.VIEW_CLIENT, exact: true },
      { path: route.clientManagementAdd, Component: AddClient, allowed: permissionsName.CREATE_CLIENT, exact: true },
      { path: route.clientManagementDetail(':id'), Component: ClientDetail, allowed: permissionsName.VIEW_CLIENT, exact: true },
      { path: route.clientManagementEdit(':id', ':type'), Component: AddClient, allowed: permissionsName.UPDATE_CLIENT, exact: true },
      { path: route.changePassword, Component: ChangePassword, allowed: 'noRole', exact: true },
      // { path: route.editProfile, Component: EditMyProfile, exact: true },
      { path: route.myProfile, Component: MyProfile, allowed: 'noRole', exact: true },
      { path: route.departmentManagement, Component: DepartmentManagement, allowed: permissionsName.VIEW_DEPARTMENT, exact: true },
      { path: route.departmentManagementDetail(':id'), Component: DepartmentManagementDetail, allowed: permissionsName.VIEW_DEPARTMENT, exact: true },
      { path: route.workLog, Component: WorkLog, allowed: permissionsName.VIEW_WORKLOGS, exact: true },
      // { path: route.changeRequest, Component: ChangeRequest, allowed: permissionsName.VIEW_CHANGE_REQUEST, exact: true },
      // { path: route.changeRequestAdd, Component: AddChangeRequest, allowed: permissionsName.CREATE_CHANGE_REQUEST, exact: true },
      // { path: route.changeRequestDetail(':id'), Component: ClientDetail, allowed: permissionsName.VIEW_CHANGE_REQUEST, exact: true },
      // { path: route.changeRequestEdit(':id', ':type'), Component: AddChangeRequest, allowed: permissionsName.UPDATE_CHANGE_REQUEST, exact: true },
      { path: route.officeMasterManagement, Component: OfficeMasterManagement, allowed: permissionsName.VIEW_ORGANIZATION_DETAILS, exact: true },
      { path: route.jobProfile, Component: JObProfile, allowed: permissionsName.VIEW_JOB_PROFILE, exact: true },
      { path: route.technologyMaster, Component: TechnologyMaster, allowed: permissionsName.VIEW_TECHNOLOGY, exact: true },
      { path: route.closedProject, Component: ClosedProject, allowed: permissionsName.VIEW_PROJECT, exact: true },
      { path: route.closedProjectDetail(':id'), Component: ClosedProjectDetails, allowed: permissionsName.VIEW_PROJECT, exact: true },
    ],
  },
]

export default RoutesDetails
