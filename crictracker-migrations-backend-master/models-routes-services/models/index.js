const players = require('./lib/players')
const matches = require('./lib/matches')
const enums = require('./lib/enums')
const venues = require('./lib/venues')
const teams = require('./lib/teams')
const series = require('./lib/series')
const seo = require('./lib/seo')
// const posts = require('./lib/wp_posts')
// const termTaxonomy = require('./lib/wp_term_taxonomy')
// const terms = require('./lib/wp_terms')
// const postsMeta = require('./lib/wp_postmeta')
const { articles } = require('./lib/articles')
const tags = require('./lib/tags')
const admins = require('./lib/admins')
const roles = require('./lib/roles')
const permissions = require('./lib/permissions')
const adminroles = require('./lib/adminroles')
const categories = require('./lib/categories')
const fantasyarticles = require('./lib/fantasyarticles')
const wptags = require('./lib/wptags')
const sitemap = require('./lib/sitemap')
const wpcategories = require('./lib/wpcategories')
const wpuser = require('./lib/wpuser')
const counts = require('./lib/counts')
const wptagcounts = require('./lib/wpTagCounts')
const jobPosts = require('./lib/job_post')
const homepages = require('./lib/homepages')
const homepagesv2 = require('./lib/homepagesv2')
const homepagemodels = require('./lib/homepagemodels')
const gallery = require('./lib/gallery')
const seoredirects = require('./lib/seoredirects')
const StickyModel = require('./lib/stickies')
const VideosModel = require('./lib/videos')
const { cms } = require('./lib/cms')
const HomePagePriorityModel = require('./lib/homepagepriority')
const { ampbrokenarticles } = require('./lib/ampbrokenarticles')
const { articlefixtrackings } = require('./lib/articleFixTrackings')

module.exports = {
  players,
  matches,
  enums,
  venues,
  teams,
  series,
  seo,
  // posts,
  articles,
  tags,
  categories,
  admins,
  roles,
  permissions,
  adminroles,
  fantasyarticles,
  // terms,
  // termTaxonomy,
  // postsMeta,
  wptags,
  wpcategories,
  sitemap,
  wpuser,
  counts,
  jobPosts,
  homepages,
  homepagesv2,
  homepagemodels,
  gallery,
  wptagcounts,
  seoredirects,
  cms,
  StickyModel,
  HomePagePriorityModel,
  ampbrokenarticles,
  articlefixtrackings,
  VideosModel
}
