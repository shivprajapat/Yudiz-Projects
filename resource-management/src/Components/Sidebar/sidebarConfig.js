import Dashboard from 'Assets/Icons/Dashboard'
import EmployeeManagement from 'Assets/Icons/EmployeeManagement'
import Projects from 'Assets/Icons/Projects'
import Interview from 'Assets/Icons/Interview'
import SkillManagement from 'Assets/Icons/SkillManagement'
import ClientManagement from 'Assets/Icons/ClientManagement'

export const sidebarConfig = [
  { Component: Dashboard, title: 'Dashboard', link: '/dashboard', color: '#884B9D' },
  { Component: EmployeeManagement, title: 'Employee Management', link: '/employee-management', color: '#0EA085' },
  { Component: Projects, title: 'Projects', link: '/projects', color: '#2780BA' },
  { Component: Interview, title: 'Interview', link: '/interviews', color: '#E64C3B' },
  { Component: SkillManagement, title: 'Skill Management', link: '/skill-management', color: '#F29B20' },
  { Component: ClientManagement, title: 'Client Management', link: '/client-management', color: '#0B1C3C' },
  { Component: Projects, title: 'Department Management', link: '/department-management', color: '#2780BA' },
]
