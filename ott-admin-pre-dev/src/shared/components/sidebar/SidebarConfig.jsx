import {
  // iconFilm,
  iconGlobe,
  iconGrid,
  iconHome,
  // iconImage,
  // iconLayers,
  // iconMusic,
  // iconSkipForward,
  // iconStar,
  // iconTV,
  // iconType,
  iconUser,
  iconUsers
  // iconVideo
} from 'assets/images/icons'
import { route } from 'shared/constants/AllRoutes'

export const sidebarConfig = [
  {
    path: route.dashboard,
    icon: iconHome,
    title: 'Home',
    isAllowedToModule: 'DASHBOARD',
    isAllowedTo: 'R'
  },
  {
    path: route.subAdmins,
    icon: iconUsers,
    title: 'Sub Admin',
    isAllowedToModule: 'SUBADMIN',
    isAllowedTo: 'R'
  },
  {
    path: route.customerManagement,
    icon: iconUser,
    title: 'Customer Management',
    isAllowedToModule: 'CUSTOMER',
    isAllowedTo: 'R'
  },
  {
    path: route.languages,
    icon: iconGlobe,
    title: 'Language Management',
    isAllowedToModule: 'LANGUAGE',
    isAllowedTo: 'R'
  },
  {
    path: route.categoryManagement,
    icon: iconGrid,
    title: 'Category Management',
    isAllowedToModule: 'CUSTOMER',
    isAllowedTo: 'R'
  }
  // {
  //   path: 'subcategoryManagement',
  //   icon: iconLayers,
  //   title: 'Sub Category Management',
  //   isAllowedToModule: 'SUBCATEGORY',
  //   isAllowedTo: 'R'
  // },
  // {
  //   path: 'genreManagement',
  //   icon: iconMusic,
  //   title: 'Genre Management',
  //   isAllowedToModule: 'GENRE',
  //   isAllowedTo: 'R'
  // },
  // {
  //   path: 'castManagement',
  //   icon: iconStar,
  //   title: 'Cast Management',
  //   isAllowedToModule: 'CAST',
  //   isAllowedTo: 'R'
  // },
  // {
  //   path: 'moviesManagement',
  //   icon: iconFilm,
  //   title: 'Movies Management',
  //   isAllowedToModule: 'MOVIES',
  //   isAllowedTo: 'R'
  // },
  // {
  //   path: 'theatreManagement',
  //   icon: iconTV,
  //   title: 'Theater Management',
  //   isAllowedToModule: 'THEATER',
  //   isAllowedTo: 'R'
  // },
  // {
  //   path: 'webservicesManagement',
  //   icon: iconVideo,
  //   title: 'Web series Management',
  //   isAllowedToModule: 'WEBSERIES',
  //   isAllowedTo: 'R'
  // },
  // {
  //   path: 'episodeManagement',
  //   icon: iconSkipForward,
  //   title: 'Episode Management',
  //   isAllowedToModule: 'EPISODE',
  //   isAllowedTo: 'R'
  // },
  // {
  //   path: 'videoManagement',
  //   icon: iconVideo,
  //   title: 'Video Management',
  //   isAllowedToModule: 'VIDEOS',
  //   isAllowedTo: 'R'
  // },
  // {
  //   path: 'bannerManagement',
  //   icon: iconImage,
  //   title: 'Banner Images Management',
  //   isAllowedToModule: 'BANNER',
  //   isAllowedTo: 'R'
  // },
  // {
  //   path: 'cmsManagement',
  //   icon: iconType,
  //   title: 'CMS Management',
  //   isAllowedToModule: 'CMS',
  //   isAllowedTo: 'R'
  // }
]
