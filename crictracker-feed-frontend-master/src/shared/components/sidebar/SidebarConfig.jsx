import { allRoutes } from 'shared/constants/AllRoutes'

export const sidebarConfig = [
  {
    path: allRoutes.dashboard,
    icon: 'icon-home',
    title: 'Home',
    roles: ['admin', 'client']
  },
  {
    path: allRoutes.secrets,
    icon: 'icon-dashboard',
    title: 'Secrets',
    roles: ['client']
  },
  {
    path: allRoutes.analytics,
    icon: 'icon-analytics_bar-chart_metrics_statistics_icon',
    title: 'Analytics',
    roles: ['client']
  },
  {
    path: allRoutes.clients,
    icon: 'icon-feed',
    title: 'Clients List',
    roles: ['admin']
  },
  {
    path: allRoutes.subscription,
    icon: 'icon-feed',
    title: 'Subscription',
    roles: ['client']
  },
  {
    path: allRoutes.clientQuery,
    icon: 'icon-feed',
    title: 'Client Query',
    roles: ['admin']
  }
]
