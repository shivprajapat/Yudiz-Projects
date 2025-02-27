import React from 'react'
import { allRoutes } from 'shared/constants/AllRoutes'

const Login = React.lazy(() => import('views/auth/login'))
const ForgotPassword = React.lazy(() => import('views/auth/forgot-password'))
const ResetPassword = React.lazy(() => import('views/auth/reset-password'))

const Dashboard = React.lazy(() => import('views/dashboard'))
const SubAdmins = React.lazy(() => import('views/settings/sub-admins'))
const AddEditSubAdmin = React.lazy(() => import('views/settings/add-edit-sub-admins'))
const Roles = React.lazy(() => import('views/settings/roles'))
const ArticleLIst = React.lazy(() => import('views/article/article-list'))
const AddEditArticle = React.lazy(() => import('views/article/add-edit-article'))
const Tags = React.lazy(() => import('views/management/tags'))
const AddTag = React.lazy(() => import('views/management/add-edit-tag'))
const Categories = React.lazy(() => import('views/management/categories'))
const AddCategory = React.lazy(() => import('views/management/add-edit-category'))
const ArticleComments = React.lazy(() => import('views/comments/article-comments'))
const FantasyArticleComments = React.lazy(() => import('views/comments/fantasy-article-comments'))
const EditProfile = React.lazy(() => import('views/profile'))
const AddEditFantasyTips = React.lazy(() => import('views/fantasy-tips/add-edit-fantasy'))
const EditFantasyOverview = React.lazy(() => import('views/fantasy-tips/edit-fantasy-overview'))
const FantasyTips = React.lazy(() => import('views/fantasy-tips/fantasy-tips-list'))
const Feedbacks = React.lazy(() => import('views/help/feedbacks'))
const Contacts = React.lazy(() => import('views/help/contacts'))
const DetailContact = React.lazy(() => import('views/help/detail-contact'))
const DetailFeedback = React.lazy(() => import('views/help/detail-feedback'))
const YouTubeVideo = React.lazy(() => import('views/settings/youtube-video'))
const Players = React.lazy(() => import('views/management/players'))
const Success = React.lazy(() => import('views/pages/Success'))
const EditPlayers = React.lazy(() => import('views/management/edit-player'))
const Teams = React.lazy(() => import('views/management/teams'))
const EditTeams = React.lazy(() => import('views/management/edit-team'))
const SeoRedirects = React.lazy(() => import('views/settings/seo-redirects'))
const Seo = React.lazy(() => import('views/settings/seo'))
const AddEditSeo = React.lazy(() => import('views/settings/add-edit-seo'))
const JobPost = React.lazy(() => import('views/settings/job-post'))
const AddEditJobPost = React.lazy(() => import('views/settings/add-edit-job-post'))
const DetailEnquiry = React.lazy(() => import('views/settings/detail-enquiry'))
const TagMigrationManagement = React.lazy(() => import('views/settings/tag-migration-management'))
const CurrentSeries = React.lazy(() => import('views/settings/current-series'))
const EndUsers = React.lazy(() => import('views/settings/end-user'))
const DetailEndUser = React.lazy(() => import('views/settings/detail-end-user'))
const Cms = React.lazy(() => import('views/settings/cms'))
const AddEditCms = React.lazy(() => import('views/settings/add-edit-cms'))
const Ads = React.lazy(() => import('views/settings/add-ads'))
const MediaPlugin = React.lazy(() => import('views/media-plugin'))

const Router = [
  {
    path: '',
    isRequiredLoggedIn: false,
    children: [
      { path: allRoutes.login, component: Login, exact: true },
      { path: allRoutes.forgotPassword, component: ForgotPassword, exact: true },
      { path: allRoutes.resetPassword, component: ResetPassword, exact: true },
      { path: allRoutes.fetchplaylistSuccess, component: Success, exact: true }
    ]
  },
  {
    path: '',
    isRequiredLoggedIn: true,
    children: [
      { path: allRoutes.dashboard, component: Dashboard, exact: true },
      { path: allRoutes.subAdmins, component: SubAdmins, exact: true, isAllowedTo: 'LIST_SUBADMIN' },
      { path: allRoutes.roles, component: Roles, exact: true, isAllowedTo: 'LIST_ROLE' },
      { path: allRoutes.addSubAdmin, component: AddEditSubAdmin, exact: true, isAllowedTo: 'ADD_SUBADMIN' },
      { path: allRoutes.editSubAdmin(':id'), component: AddEditSubAdmin, exact: true, isAllowedTo: 'EDIT_SUBADMIN' },
      { path: allRoutes.articleList, component: ArticleLIst, exact: true, isAllowedTo: 'LIST_ARTICLE' },
      { path: allRoutes.addArticle, component: AddEditArticle, exact: true, isAllowedTo: 'CREATE_ARTICLE' },
      { path: allRoutes.editArticle(':id'), component: AddEditArticle, exact: true },
      { path: allRoutes.tags, component: Tags, exact: true },
      { path: allRoutes.addTag, component: AddTag, exact: true, isAllowedTo: 'CREATE_TAG' },
      { path: allRoutes.editTag(':id'), component: AddTag, exact: true, isAllowedTo: 'EDIT_ACTIVE_TAG' },
      { path: allRoutes.categories, component: Categories, exact: true, isAllowedTo: 'LIST_CATEGORY' },
      { path: allRoutes.addCategory, component: AddCategory, exact: true, isAllowedTo: 'CREATE_CATEGORY' },
      { path: allRoutes.editCategory(':id'), component: AddCategory, exact: true, isAllowedTo: 'EDIT_CATEGORY' },
      { path: allRoutes.articleComments, component: ArticleComments, exact: true, isAllowedTo: 'LIST_COMMENT' },
      { path: allRoutes.fantasyArticleComments, component: FantasyArticleComments, exact: true, isAllowedTo: 'LIST_COMMENT' },
      { path: allRoutes.editProfile, component: EditProfile, exact: true },
      { path: allRoutes.addFantasyTips(':type', ':id'), component: AddEditFantasyTips, exact: true },
      { path: allRoutes.editFantasyTips(':type', ':id'), component: AddEditFantasyTips, exact: true },
      { path: allRoutes.editFantasyOverview(':id'), component: EditFantasyOverview, exact: true },
      { path: allRoutes.fantasyTipsList, component: FantasyTips, exact: true, isAllowedTo: 'FANTASY_LIST_ARTICLE' },
      { path: allRoutes.feedbacks, component: Feedbacks, exact: true, isAllowedTo: 'LIST_FEEDBACK' },
      { path: allRoutes.contacts, component: Contacts, exact: true, isAllowedTo: 'LIST_CONTACT' },
      { path: allRoutes.detailContact(':id'), component: DetailContact, exact: true, isAllowedTo: 'GET_CONTACT' },
      { path: allRoutes.detailFeedback(':id'), component: DetailFeedback, exact: true, isAllowedTo: 'GET_FEEDBACK' },
      { path: allRoutes.youtubeVideo, component: YouTubeVideo, exact: true, isAllowedTo: 'LIST_PLAYLIST' },
      { path: allRoutes.players, component: Players, exact: true, isAllowedTo: 'LIST_PLAYER_TAGS' },
      { path: allRoutes.editPlayer(':id'), component: EditPlayers, exact: true, isAllowedTo: 'EDIT_PLAYER' },
      { path: allRoutes.teams, component: Teams, exact: true, isAllowedTo: 'LIST_TEAM_TAGS' },
      { path: allRoutes.editTeam(':id'), component: EditTeams, exact: true, isAllowedTo: 'EDIT_TEAM' },
      { path: allRoutes.seo, component: Seo, exact: true, isAllowedTo: 'LIST_SEO' },
      { path: allRoutes.addSeo, component: AddEditSeo, exact: true, isAllowedTo: 'ADD_SEO' },
      { path: allRoutes.editSeo(':type', ':id'), component: AddEditSeo, exact: true, isAllowedTo: 'EDIT_SEO' },
      { path: allRoutes.seoRedirects, component: SeoRedirects, exact: true, isAllowedTo: 'LIST_SEO_REDIRECT' },
      { path: allRoutes.jobPost, component: JobPost, exact: true, isAllowedTo: 'LIST_JOB' },
      { path: allRoutes.addJobPost, component: AddEditJobPost, exact: true, isAllowedTo: 'CREATE_JOB' },
      { path: allRoutes.editJobPost(':type', ':id'), component: AddEditJobPost, exact: true, isAllowedTo: 'EDIT_JOB' },
      { path: allRoutes.detailEnquiry(':id'), component: DetailEnquiry, exact: true, isAllowedTo: 'LIST_JOB' },
      { path: allRoutes.tagMigrationManagement, component: TagMigrationManagement, exact: true, isAllowedTo: 'LIST_MIGRATION_TAG' },
      { path: allRoutes.currentSeries, component: CurrentSeries, exact: true, isAllowedTo: 'VIEW_CURRENT_SERIES' },
      { path: allRoutes.endUsers, component: EndUsers, exact: true, isAllowedTo: 'LIST_USER' },
      { path: allRoutes.detailEndUser(':id'), component: DetailEndUser, exact: true, isAllowedTo: 'VIEW_USER' },
      { path: allRoutes.cms, component: Cms, exact: true, isAllowedTo: 'LIST_SEO' },
      { path: allRoutes.addCms, component: AddEditCms, exact: true, isAllowedTo: 'ADD_SEO' },
      { path: allRoutes.editCms(':id'), component: AddEditCms, exact: true, isAllowedTo: 'EDIT_SEO' },
      { path: allRoutes.ads, component: Ads, exact: true },
      { path: allRoutes.media, component: MediaPlugin, exact: true }
    ]
  }
]

export default Router
