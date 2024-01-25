// let email
// if (process.env === 'development') email = 'zarna.p@yudiz.com'
// if (process.env === 'development') email = 'keval.j@yudiz.in'
// if (process.env === 'production') email = 'seracedu@gmail.com'

module.exports = {
  SHARE_SOCIAL_TITLE: process.env.SHARE_SOCIAL_TITLE || 'Play Fantasy and win real cash | Fantasy',
  SHARE_SOCIAL_DESCRIPTION: process.env.SHARE_SOCIAL_DESCRIPTION || 'Fantasy is one of finest Fantasy sports game where more probability of numbers can make you win loads of cash!',
  PRIVATE_CONTEST_SOCIAL_TITLE: process.env.PRIVATE_CONTEST_SOCIAL_TITLE || 'Private Contest Invitation of Fantasy',
  PRIVATE_CONTEST_SOCIAL_DESCRIPTION: process.env.PRIVATE_CONTEST_SOCIAL_DESCRIPTION || 'Fantasy is one of finest Fantasy sports game where more probability of numbers can make you win loads of cash!',
  DYNAMIC_LINK_DOMAIN_URI_PREFIX: process.env.DYNAMIC_LINK_DOMAIN_URI_PREFIX || 'https://wlfantasy.page.link',
  DYNAMIC_LINK_ANDROID_PACKAGE_NAME: process.env.DYNAMIC_LINK_ANDROID_PACKAGE_NAME || 'com.fantasy.wl',
  IOS_BUNDLE_ID: process.env.IOS_BUNDLE_ID || 'com.app.FantasyApp',
  IOS_CUSTOM_SCHEME: process.env.IOS_CUSTOM_SCHEME || 'fantasyapp.firebase.scheme',
  IOS_APPS_TORE_ID: process.env.IOS_APPS_TORE_ID || '1551942282'
}
