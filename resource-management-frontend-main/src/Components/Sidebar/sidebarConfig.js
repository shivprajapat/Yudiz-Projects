//Sidebar Icon
import OfficeMasterManagement from 'Assets/Icons/OfficeMasterManagement'
import EmployeeManagement from 'Assets/Icons/EmployeeManagement'
import ClientManagement from 'Assets/Icons/ClientManagement'
import TechnologyMaster from 'Assets/Icons/TechnologyMaster'
import SkillManagement from 'Assets/Icons/SkillManagement'
// import ChangeRequest from 'Assets/Icons/ChangeRequest'
import ClosedProject from 'Assets/Icons/ClosedProject'
import doughnutIcon from 'Assets/Icons/doughnutIcon'
import JobProfile from 'Assets/Icons/JobProfile'
import Department from 'Assets/Icons/Department'
import Dashboard from 'Assets/Icons/Dashboard'
import Projects from 'Assets/Icons/Projects'
import Worklog from 'Assets/Icons/Worklog'

//helper
import { permissionsName } from 'helpers'

//routes
import { route } from 'Routes/route'


export const sidebarConfig = [
  { Component: Dashboard, title: 'Dashboard', link: route.dashboard, color: '#884B9D', allowed: 'noRole' },
  { Component: doughnutIcon, title: 'Project Overview', link: route.projectOverview, color: '#bb00ff', allowed: permissionsName.VIEW_PROJECT_OVERVIEW },
  { Component: EmployeeManagement, title: 'Employee', link: route.employeeManagement, color: '#0EA085', allowed: permissionsName.VIEW_EMPLOYEE },
  { Component: Projects, title: 'Projects', link: route.projects, color: '#2780BA', allowed: permissionsName.VIEW_PROJECT },
  { Component: SkillManagement, title: 'Skill', link: route.skillManagement, color: '#F29B20', allowed: permissionsName.VIEW_SKILL },
  { Component: ClientManagement, title: 'Client', link: route.clientManagement, color: '#0B1C3C', allowed: permissionsName.VIEW_CLIENT },
  { Component: Department, title: 'Department', link: route.departmentManagement, color: '#2780BA', allowed: permissionsName.VIEW_DEPARTMENT },
  { Component: Worklog, title: 'Work Log', link: route.workLog, color: '#8ADA55', allowed: permissionsName.VIEW_WORKLOGS },
  // { Component: ChangeRequest, title: 'Change Request', link: route.changeRequest, color: '#2780BA', allowed: permissionsName.VIEW_CHANGE_REQUEST },
  { Component: OfficeMasterManagement, title: 'Office', link: route.officeMasterManagement, color: '#2780BA', allowed: permissionsName.VIEW_ORGANIZATION_DETAILS },
  { Component: JobProfile, title: 'Job Profile', link: route.jobProfile, color: '#884B9D', allowed: permissionsName.VIEW_JOB_PROFILE },
  { Component: TechnologyMaster, title: 'Technology', link: route.technologyMaster, color: '#2780BA', allowed: permissionsName.VIEW_TECHNOLOGY },
  { Component: ClosedProject, title: 'Closed Project', link: route.closedProject, color: '#7A86B6', allowed: permissionsName.VIEW_CLOSED_PROJECT },
]
