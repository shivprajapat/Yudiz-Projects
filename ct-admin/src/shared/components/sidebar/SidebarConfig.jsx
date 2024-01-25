import { allRoutes } from 'shared/constants/AllRoutes'

export const sidebarConfig = [
  {
    path: allRoutes.dashboard,
    icon: 'icon-home',
    title: 'Home'
  },
  {
    path: allRoutes.tags,
    icon: 'icon-dashboard',
    title: 'Management',
    children: [
      { path: allRoutes.tags, title: 'Tags' },
      { path: allRoutes.categories, title: 'Categories', isAllowedTo: 'LIST_CATEGORY' },
      { path: allRoutes.players, title: 'Players', isAllowedTo: 'LIST_PLAYER_TAGS' },
      { path: allRoutes.teams, title: 'Teams', isAllowedTo: 'LIST_TEAM_TAGS' }
    ]
  },
  {
    path: allRoutes.articleList,
    icon: 'icon-feed',
    title: 'Article',
    isArray: true,
    isAllowedTo: ['LIST_ARTICLE', 'FANTASY_LIST_ARTICLE'],
    children: [
      { path: allRoutes.articleList, title: 'Article', isAllowedTo: 'LIST_ARTICLE' },
      { path: allRoutes.fantasyTipsList, title: 'Fantasy Tips', isAllowedTo: 'FANTASY_LIST_ARTICLE' }
    ]
  },
  {
    path: allRoutes.media,
    icon: 'icon-image',
    title: 'Media Gallery'
  },
  {
    path: allRoutes.roles,
    icon: 'icon-settings',
    title: 'Settings',
    isArray: true,
    isAllowedTo: [
      'LIST_ROLE',
      'LIST_SUBADMIN',
      'VIEW_CURRENT_SERIES',
      'LIST_USER',
      'LIST_MIGRATION_TAG',
      'LIST_PLAYLIST',
      'LIST_SEO_REDIRECT',
      'LIST_SEO',
      'GET_JOB',
      'LIST_CMS_PAGE'
    ],
    children: [
      { path: allRoutes.roles, title: 'Role', isAllowedTo: 'LIST_ROLE' },
      { path: allRoutes.subAdmins, title: 'Sub Admin', isAllowedTo: 'LIST_SUBADMIN' },
      { path: allRoutes.currentSeries, title: 'Current Series', isAllowedTo: 'VIEW_CURRENT_SERIES' },
      { path: allRoutes.endUsers, title: 'End Users', isAllowedTo: 'LIST_USER' },
      { path: allRoutes.tagMigrationManagement, title: 'Tag Migration Management', isAllowedTo: 'LIST_MIGRATION_TAG' },
      { path: allRoutes.youtubeVideo, title: 'Youtube Video', isAllowedTo: 'LIST_PLAYLIST' },
      { path: allRoutes.seoRedirects, title: 'SEO Redirects', isAllowedTo: 'LIST_SEO_REDIRECT' },
      { path: allRoutes.seo, title: 'SEO', isAllowedTo: 'LIST_SEO' },
      { path: allRoutes.jobPost, title: 'Job Post', isAllowedTo: 'GET_JOB' },
      { path: allRoutes.cms, title: 'CMS Pages', isAllowedTo: 'LIST_CMS_PAGE' },
      { path: allRoutes.ads, title: 'Ads.txt' }
    ]
  },
  {
    path: allRoutes.feedbacks,
    icon: 'icon-help',
    title: 'Help',
    isAllowedTo: ['LIST_FEEDBACK', 'LIST_CONTACT'],
    isArray: true,
    children: [
      { path: allRoutes.feedbacks, title: 'Feedbacks', isAllowedTo: 'LIST_FEEDBACK' },
      { path: allRoutes.contacts, title: 'Contacts', isAllowedTo: 'LIST_CONTACT' }
    ]
  },
  {
    path: allRoutes.articleComments,
    icon: 'icon-comment-rounded',
    title: 'Comments',
    isAllowedTo: ['LIST_COMMENT'],
    isArray: true,
    children: [
      { path: allRoutes.articleComments, title: 'Article Comments', isAllowedTo: 'LIST_COMMENT' },
      { path: allRoutes.fantasyArticleComments, title: 'Fantasy Article Comments', isAllowedTo: 'LIST_COMMENT' }
    ]
  }
]
