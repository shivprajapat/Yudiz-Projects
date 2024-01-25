const enums = {
  eStatus: {
    value: ['a', 'i', 'd'],
    description: { a: 'active', i: 'inactive', d: 'deleted' },
    default: 'a'
  },
  eDesignation: {
    value: ['jsw', 'ssw', 'jc', 'sc', 'se', 'ae', 'e', 'sre', 'ce', 'eic', 'frw', 'fc', 'js', 'ss', 'gw', 'c', 'fw', 'a'],
    description: { jsw: 'Jr.Staff Writter', ssw: 'Sr.Staff Writter', jc: 'Jr.Correspondent', sc: 'Sr.Correspondent', se: 'Sub Editor', ae: 'Assistant Editor', e: 'Editor', sre: 'Sr.Editor', ce: 'Consulting Editor', eic: 'Editor In Cheif', frw: 'Freelance Writer', fc: 'Freelance Correspondent', js: 'Jr.Statistician', ss: 'Sr.Statistician', gw: 'Guest Writer', c: 'Columnist', fw: 'Featured Writer', a: 'Author' },
    default: 'a'
  },
  eUserType: {
    value: ['su', 'sb', 'writer', 'reviewer'],
    description: { su: 'superAdmin', sb: 'subAdmin' },
    default: 'sb'
  },
  eOtpVerificationType: {
    value: ['e', 'm'],
    description: { e: 'email', m: 'mobile' },
    default: 'email'
  },
  eOtpVerificationAuthType: {
    value: ['f', 'r', 'v'],
    description: { fp: 'Forgot Password', r: 'register', v: 'verification' }
  },
  eSeoType: {
    value: ['wt', 'ar'],
    description: { wt: 'writer' }
  },
  ePermissionDivisionType: {
    value: [
      'admin', 'article',
      'liveblog',
      'category', 'cms',
      'comment', 'contact',
      'fantasyArticle', 'feedback',
      'job', 'player',
      'playlist', 'role',
      'seo', 'seoRedirect',
      'series', 'slug',
      'tag', 'tags', 'user', 'widget', 'poll']
  },
  eSocailLinkType: {
    value: ['i', 'f', 't', 'l'],
    description: { i: 'instagram', f: 'facebook', t: 'twitter', l: 'linkedin' }
  },
  eUserTokenType: {
    value: ['a', 'u'],
    description: { u: 'user', a: 'admin' }
  },
  ePermissionType: {
    value: ['content', 'admin', 'analytics']
  },
  eGender: {
    value: ['m', 'f', 'o'],
    description: { m: 'male', f: 'female', o: 'other' }
  },
  eSocialType: {
    value: ['F', 'G'],
    description: { F: 'facebook', G: 'google' }
  },
  eAuthPlatform: {
    value: ['A', 'I', 'W', 'O'],
    description: { A: 'Android', I: 'IOS', W: 'Web', O: 'Other' }
  },
  eAuthType: {
    value: ['R', 'L', 'CP', 'RP'],
    description: { R: 'Register', L: 'Login', CP: 'Change Password', RP: 'Reset Password' }
  },
  ePermissionsKeys: {
    value: [
      'DELETE_ROLE',
      'ADD_SUBADMIN',
      'EDIT_ROLE',
      'EDIT_ARTICLE',
      'CREATE_ROLE',
      'CREATE_ARTICLE',
      'LIST_SUBADMIN',
      'EDIT_ACTIVE_TAG',
      'CREATE_TAG',
      'EDIT_CATEGORY',
      'LIST_ACTIVE_TAG',
      'CREATE_CATEGORY',
      'LIST_CATEGORY',
      'DELETE_CATEGORY',
      'VIEW_SUBADMIN',
      'LIST_REQUESTS_TAG',
      'LIST_ARTICLE',
      'PICK_ARTICLE',
      'PUBLISH_DATE_CHANGE_ARTICLE',
      'DISPLAY_AUTHOR_CHANGE_ARTICLE',
      'LIST_COMMENT',
      'LIST_ROLE',
      'CHANGE_STATUS_SUBADMIN',
      'DELETE_SUBADMIN',
      'EDIT_SUBADMIN',
      'VERIFY_SUBADMIN',
      'CHANGE_STATUS_CATEGORY',
      'DELETE_ACTIVE_TAG',
      'EDIT_TAG',
      'DELETE_REQUESTS_TAG',
      'APPROVE_REJECT_REQUESTS_TAG',
      'DELETE_REQUESTED_TAG',
      'CHANGE_STATUS_ACTIVE_TAG',
      'PUBLISH_ARTICLE',
      'LIST_PLAYLIST',
      'UPDATE_PLAYLIST',
      'FETCH_PLAYLIST',
      'DELETE_SEO',
      'UPDATE_SEO_STATUS',
      'ADD_SEO',
      'EDIT_SEO',
      'VIEW_SEO',
      'LIST_SEO',
      'DELETE_SEO_REDIRECT',
      'UPDATE_SEO_REDIRECT_STATUS',
      'ADD_SEO_REDIRECT',
      'EDIT_SEO_REDIRECT',
      'VIEW_SEO_REDIRECT',
      'LIST_SEO_REDIRECT',
      'CREATE_JOB',
      'EDIT_JOB',
      'GET_JOB',
      'LIST_JOB',
      'UPDATE_JOB_STATUS',
      'DELETE_JOB',
      'EDIT_ENQUIRY',
      'GET_ENQUIRY',
      'LIST_ENQUIRY',
      'DELETE_ENQUIRY',
      'LIST_MIGRATION_TAG',
      'CREATE_CMS_PAGE',
      'DELETE_CMS_PAGE',
      'UPDATE_CMS_PAGE_STATUS',
      'EDIT_CMS_PAGE',
      'VIEW_CMS_PAGE',
      'LIST_CMS_PAGE',
      'CREATE_CURRENT_SERIES',
      'DELETE_CURRENT_SERIES',
      'UPDATE_CURRENT_SERIES_STATUS',
      'EDIT_CURRENT_SERIES',
      'VIEW_CURRENT_SERIES',
      'LIST_CURRENT_SERIES',
      'LIST_USER',
      'VIEW_USER',
      'DELETE_USER',
      'UPDATE_USER_STATUS',
      'CREATE_POLL',
      'EDIT_POLL',
      'DELETE_POLL',
      'EDIT_HOME_WIDGETS',
      'VIEW_POLL'
    ]
  },
  eDeletedBy: {
    value: ['u', 'a'],
    description: { u: 'User', a: 'Admin' }
  }
}

module.exports = enums
