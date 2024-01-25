import { lazy } from 'react'

// ** Document title
const TemplateTitle = 'Super'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/user-management',
    exact: true,
    component: lazy(() => import('../../views/pages/user-management'))
  },

  {
    path: '/user-management/view/:id',
    exact: true,
    component: lazy(() => import('../../views/pages/user-management/view'))
  },
  {
    path: '/category-management',
    exact: true,
    component: lazy(() => import('../../views/pages/categories-management'))
  },
  {
    path: '/category-management/add',
    exact: true,
    component: lazy(() => import('../../views/pages/categories-management/add'))
  },
  {
    path: '/category-management/update/:id',
    exact: true,
    component: lazy(() => import('../../views/pages/categories-management/add'))
  },
  {
    path: '/subcategory-management',
    exact: true,
    component: lazy(() => import('../../views/pages/subcategory-management'))
  },
  {
    path: '/sub-category-management/add',
    exact: true,
    component: lazy(() => import('../../views/pages/subcategory-management/add'))
  },
  {
    path: '/sub-category-management/update/:id',
    exact: true,
    component: lazy(() => import('../../views/pages/subcategory-management/add'))
  },
  {
    path: '/genre-management',
    exact: true,
    component: lazy(() => import('../../views/pages/genre-management'))
  },
  {
    path: '/genremanagement/add',
    exact: true,
    component: lazy(() => import('../../views/pages/genre-management/add'))
  },
  {
    path: '/genremanagement/update/:id',
    exact: true,
    component: lazy(() => import('../../views/pages/genre-management/add'))
  },
  {
    path: '/cast-management',
    exact: true,
    component: lazy(() => import('../../views/pages/cast-management'))
  },
  {
    path: '/castmanagement/add',
    exact: true,
    component: lazy(() => import('../../views/pages/cast-management/add'))
  },
  {
    path: '/castmanagement/update/:id',
    exact: true,
    component: lazy(() => import('../../views/pages/cast-management/add'))
  },
  {
    path: '/movie-management',
    exact: true,
    component: lazy(() => import('../../views/pages/movie-management'))
  },
  {
    path: '/movie-management/add',
    exact: true,
    component: lazy(() => import('../../views/pages/movie-management/add'))
  },
  {
    path: '/movie-management/update/:id',
    exact: true,
    component: lazy(() => import('../../views/pages/movie-management/add'))
  },
  {
    path: '/web-series-management',
    exact: true,
    component: lazy(() => import('../../views/pages/web-series-management'))
  },
  {
    path: '/episode-management',
    exact: true,
    component: lazy(() => import('../../views/pages/episode-management'))
  },
  {
    path: '/video-management',
    component: lazy(() => import('../../views/pages/video-management'))
  },
  {
    path: '/banner-images-management',
    component: lazy(() => import('../../views/pages/banner-images-management'))
  },
  {
    path: '/cms-management',
    component: lazy(() => import('../../views/pages/cms-management'))
  },
  {
    path: '/pages/profile',
    component: lazy(() => import('../../views/pages/profile'))
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/auth/log-in')),
    layout: 'AuthLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/forgotpassword',
    component: lazy(() => import('../../views/auth/forgot-password')),
    layout: 'AuthLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/resetpassword',
    component: lazy(() => import('../../views/auth/reset-password')),
    layout: 'AuthLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
