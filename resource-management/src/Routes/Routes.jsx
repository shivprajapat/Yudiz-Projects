import { lazy } from 'react'
// public Routes Files
const Login = lazy(() => import('Pages/Auth/Login'))
const ForgotPassword = lazy(() => import('Pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('Pages/Auth/ResetPassword'))

// Private Routes Files
const Dashboard = lazy(() => import('Pages/Dashboard'))
const EmployeeManagement = lazy(() => import('Pages/Employee-Management'))
const AddEmployee = lazy(() => import('Pages/Employee-Management/Add-Employee'))
const Projects = lazy(() => import('Pages/Projects'))
const AddProject = lazy(() => import('Pages/Projects/App-Project'))
const ProjectDetails = lazy(() => import('Pages/Projects/Project-Details/Project-Details'))
const Interviews = lazy(() => import('Pages/Interviews'))
const AddInterview = lazy(() => import('Pages/Interviews/AddInterview'))
const SkillManagement = lazy(() => import('Pages/Skill-Management'))
const ClientManagement = lazy(() => import('Pages/Client-Management'))
const AddClient = lazy(() => import('Pages/Client-Management/NewClient'))
const ChangePassword = lazy(() => import('Pages/Change-Password'))
const EmployeeDetail = lazy(() => import('Pages/Employee-Management/Employee-Detail'))
const DepartmentManagement = lazy(() => import('Pages/Department-Management'))
const ClientDetail = lazy(() => import('Pages/Client-Management/Client-details'))
const InterviewDetail = lazy(() => import('Pages/Interviews/interview-detail'))
const EditMyProfile = lazy(() => import('Pages/Edit-My-Profile'))
const MyProfile = lazy(() => import('Pages/My-Profile'))

const RoutesDetails = [
  {
    defaultRoute: '',
    isPrivateRoute: false,
    children: [
      { path: '/login', Component: Login, exact: true },
      { path: '/forgot-password', Component: ForgotPassword, exact: true },
      { path: '/reset-password', Component: ResetPassword, exact: true },
    ],
  },
  {
    defaultRoute: '',
    isPrivateRoute: true,
    children: [
      { path: '/dashboard', Component: Dashboard, props: {}, subRoutes: [], exact: true },
      { path: '/employee-management', Component: EmployeeManagement, props: {}, subRoutes: [], exact: false },
      { path: '/employee-management/add', Component: AddEmployee, exact: true },
      { path: '/employee-management/detail/:id', Component: EmployeeDetail, exact: true },
      { path: '/employee-management/:type/:id', Component: AddEmployee, exact: true },
      { path: '/projects', Component: Projects, exact: true },
      { path: '/projects/add', Component: AddProject, exact: true },
      { path: '/projects/detail/:id', Component: ProjectDetails, exact: true },
      { path: '/projects/:type/:id', Component: AddProject, exact: true },
      { path: '/interviews', Component: Interviews, exact: true },
      { path: '/interviews/Add', Component: AddInterview, exact: true },
      { path: '/interviews/detail/:id', Component: InterviewDetail, exact: true },
      { path: '/interviews/:type/:id', Component: AddInterview, exact: true },
      { path: '/skill-management', Component: SkillManagement, exact: true },
      { path: '/client-management', Component: ClientManagement, exact: true },
      { path: '/client-management/add', Component: AddClient, exact: true },
      { path: '/client-management/:type/:id', Component: AddClient, exact: true },
      { path: '/client-management/detail/:id', Component: ClientDetail, exact: true },
      { path: '/change-password', Component: ChangePassword, exact: true },
      { path: '/edit-profile', Component: EditMyProfile, exact: true },
      { path: '/my-profile', Component: MyProfile, exact: true },
      { path: '/department-management', Component: DepartmentManagement, exact: true },
    ],
  },
]

export default RoutesDetails
