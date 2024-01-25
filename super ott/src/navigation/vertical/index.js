import { Grid, Home, Image, Layers, Music, Star, Type, User, Video, Film, SkipForward } from 'react-feather'

export default [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
    id: 'usermanagement',
    title: 'User Management',
    icon: <User size={20} />,
    navLink: '/user-management'
  },
  {
    id: 'categoriesmanagement',
    title: 'Categories Management',
    icon: <Grid size={20} />,
    navLink: '/category-management'
  },

  {
    id: 'subcategorymanagement',
    title: 'Sub Category Management',
    icon: <Layers size={20} />,
    navLink: '/subcategory-management'
  },
  {
    id: 'genremanagement',
    title: 'Genre Management',
    icon: <Music size={20} />,
    navLink: '/genre-management'
  },
  {
    id: 'castmanagement',
    title: 'Cast Management',
    icon: <Star size={20} />,
    navLink: '/cast-management'
  },
  {
    id: 'moviesmanagement',
    title: 'Movies Management',
    icon: <Film size={20} />,
    navLink: '/movie-management'
  },
  {
    id: 'webseriesmanagement',
    title: 'Web series Management',
    icon: <Video size={20} />,
    navLink: '/web-series-management'
  },
  {
    id: 'episodemanagement',
    title: 'Episode Management',
    icon: <SkipForward size={20} />,
    navLink: '/episode-management'
  },
  // {
  //   id: 'videomanagement',
  //   title: 'Video Management',
  //   icon: <Video size={20} />,
  //   navLink: '/video-management'
  // },
  {
    id: 'bannerimagesmanagement',
    title: 'Banner Images Management',
    icon: <Image size={20} />,
    navLink: '/banner-images-management'
  },
  {
    id: 'cmsmanagement',
    title: 'CMS Management',
    icon: <Type size={20} />,
    navLink: '/cms-management'
  }
]
