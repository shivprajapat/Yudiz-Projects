import { allRoutes } from './allRoutes'

export const seriesCategoryNav = ({ slug, activePath, isSeries, totalTeams, tabName, tabSlug, reWriteURLS = [], categoryId }) => {
  // const mActivePath = activePath.slice(0, -1)

  const urls = {}
  reWriteURLS?.forEach(e => {
    urls[e?.eTabType] = `/${e?.sSlug}/`
  })

  if (isSeries === 'as') {
    const nav = totalTeams > 2 ? [
      { navItem: 'Home', url: allRoutes.seriesHome(slug), active: allRoutes.seriesHome(slug) === activePath },
      { navItem: 'News', url: allRoutes.seriesNews(`/${slug}/`), active: allRoutes.seriesNews(`/${slug}/`) === activePath },
      { navItem: 'Videos', url: allRoutes.seriesVideos(`/${slug}/`), active: allRoutes.seriesVideos(`/${slug}/`) === activePath },
      // { navItem: 'Fantasy Articles', url: allRoutes.seriesFantasyArticles(slug), active: allRoutes.seriesFantasyArticles(slug) === activePath },
      {
        navItem: 'Fixtures',
        url: urls?.fixtures || allRoutes.seriesFixtures(`/${slug}/`),
        active: (allRoutes.seriesFixtures(`/${slug}/`) === activePath || urls?.fixtures === activePath)
      },
      {
        navItem: 'Standings',
        url: urls?.standings || allRoutes.seriesStandings(`/${slug}/`),
        active: (allRoutes.seriesStandings(`/${slug}/`) === activePath || urls?.standings === activePath)
      },
      {
        navItem: 'Stats',
        url: urls?.stats || allRoutes.seriesStats(`/${slug}/`),
        active: (allRoutes.seriesStats(`/${slug}/`) === activePath || urls?.stats === activePath)
      },
      {
        navItem: 'Teams',
        url: urls?.teams || allRoutes.seriesTeams(`/${slug}/`),
        active: (allRoutes.seriesTeams(`/${slug}/`) === activePath || urls?.teams === activePath)
      },
      {
        navItem: 'Squads',
        url: urls?.squads || allRoutes.seriesSquads(`/${slug}/`),
        active: (allRoutes.seriesSquads(`/${slug}/`) === activePath || urls?.squads === activePath)
      },
      { navItem: 'Archives', url: allRoutes.seriesArchives(`/${slug}/`), active: allRoutes.seriesArchives(`/${slug}/`) === activePath },
      { navItem: 'Fantasy Tips', url: allRoutes.seriesFantasyTips(`/${slug}/`), active: allRoutes.seriesFantasyTips(`/${slug}/`) === activePath }
    ] : [
      { navItem: 'Home', url: allRoutes.seriesHome(slug), active: allRoutes.seriesHome(slug) === activePath },
      { navItem: 'News', url: allRoutes.seriesNews(`/${slug}/`), active: allRoutes.seriesNews(`/${slug}/`) === activePath },
      { navItem: 'Videos', url: allRoutes.seriesVideos(`/${slug}/`), active: allRoutes.seriesVideos(`/${slug}/`) === activePath },
      // { navItem: 'Fantasy Articles', url: allRoutes.seriesFantasyArticles(slug), active: allRoutes.seriesFantasyArticles(slug) === activePath },
      {
        navItem: 'Fixtures',
        url: urls?.fixtures || allRoutes.seriesFixtures(`/${slug}/`),
        active: (allRoutes.seriesFixtures(`/${slug}/`) === activePath || urls?.fixtures === activePath)
      },
      {
        navItem: 'Stats',
        url: urls?.stats || allRoutes.seriesStats(`/${slug}/`),
        active: (allRoutes.seriesStats(`/${slug}/`) === activePath || urls?.stats === activePath)
      },
      {
        navItem: 'Squads',
        url: urls?.squads || allRoutes.seriesSquads(`/${slug}/`),
        active: (allRoutes.seriesSquads(`/${slug}/`) === activePath || urls?.squads === activePath)
      },
      { navItem: 'Archives', url: allRoutes.seriesArchives(`/${slug}/`), active: allRoutes.seriesArchives(`/${slug}/`) === activePath },
      { navItem: 'Fantasy Tips', url: allRoutes.seriesFantasyTips(`/${slug}/`), active: allRoutes.seriesFantasyTips(`/${slug}/`) === activePath }
    ]
    return nav
  } else if (isSeries === 's' || isSeries === 'pct') {
    return [
      { navItem: 'Home', internalName: 'home' },
      { navItem: 'News', internalName: 'news' },
      { navItem: 'Videos', internalName: 'videos' }
    ]
  } else if (categoryId !== '623184b5f5d229bacb010197' && (isSeries === 'gt' || isSeries === 'p' || isSeries === 't' || isSeries === 'fac')) {
    return [
      { navItem: 'Home', internalName: 'home' },
      { navItem: 'News', internalName: 'news' },
      { navItem: 'Fantasy Articles', internalName: 'fantasyArticle' }
    ]
  } else if (categoryId === '623184b5f5d229bacb010197') { // For dream11-fantasy-tips
    return [
      { navItem: 'Home', internalName: 'home' },
      // { navItem: 'News', internalName: 'news' },
      { navItem: 'Fantasy Articles', internalName: 'fantasyArticle' }
    ]
  } else {
    return []
  }
}

export const matchDetailNav = (slug, activePath, isSeriesSlug, status, seriesTotalTeams, isCommentryStart, isLiveBlog, isGlanceView) => {
  const conditions = {
    scheduled: status === 'scheduled',
    finished: status === 'live' || status === 'completed' || status === 'cancelled',
    isScoreCard: () => conditions.scheduled || conditions.finished,
    isStandings: () => conditions.isScoreCard() && seriesTotalTeams > 2 && !isGlanceView,
    isGlanceView: isGlanceView
  }
  const isActive = (url) => url === activePath?.split('?')[0]

  const commonNavTabs = [
    { navItem: 'Commentary', url: allRoutes.matchDetailCommentary(slug), active: isActive(allRoutes.matchDetailCommentary(slug)), show: conditions.finished },
    { navItem: 'Overview', url: allRoutes.matchDetail(slug), active: isActive(allRoutes.matchDetail(slug)), show: conditions.scheduled },
    { navItem: 'Scorecard', url: allRoutes.matchDetailScorecard(`/${slug}/`), active: isActive(allRoutes.matchDetailScorecard(`/${slug}/`)), show: conditions.isScoreCard() },
    { navItem: 'Standings', url: allRoutes.seriesStandings(`/${isSeriesSlug}/`), active: isActive(allRoutes.seriesStandings(`/${isSeriesSlug}/`)), show: conditions.isStandings() },
    { navItem: 'Overs', url: allRoutes.matchDetailOvers(`/${slug}/`), active: isActive(allRoutes.matchDetailOvers(`/${slug}/`)), show: true },
    { navItem: 'News', url: allRoutes.matchDetailNews(`/${slug}/`), active: isActive(allRoutes.matchDetailNews(`/${slug}/`)), show: true },
    { navItem: 'Live Blog', url: allRoutes.matchDetailLiveBlog(`/${slug}/`), active: isActive(allRoutes.matchDetailLiveBlog(`/${slug}/`)), show: isLiveBlog && !conditions.isGlanceView },
    { navItem: 'Stats', url: allRoutes.seriesStats(`/${isSeriesSlug}/`), active: isActive(allRoutes.seriesStats(`/${isSeriesSlug}/`)), show: !conditions.isGlanceView },
    { navItem: 'Fantasy Tips', url: allRoutes.matchDetailFantasyTips(`/${slug}/`), active: isActive(allRoutes.matchDetailFantasyTips(`/${slug}/`)), show: !conditions.isGlanceView },
    { navItem: 'Upcoming', url: allRoutes.matchDetailUpcoming(`/${slug}/`), active: isActive(allRoutes.matchDetailUpcoming(`/${slug}/`)), show: !conditions.isGlanceView },
    { navItem: 'Results', url: allRoutes.matchDetailResult(`/${slug}/`), active: isActive(allRoutes.matchDetailResult(`/${slug}/`)), show: !conditions.isGlanceView }
  ]
  return commonNavTabs.filter(tab => tab?.show)
}

export const searchNav = (type) => {
  return [
    { navItem: 'All', url: allRoutes.search, active: !type },
    { navItem: 'News', url: allRoutes.searchNews, active: type === 'news' },
    { navItem: 'Video', url: allRoutes.searchVideo, active: type === 'video' },
    { navItem: 'Series', url: allRoutes.searchSeries, active: type === 'series' },
    { navItem: 'Players', url: allRoutes.searchPlayer, active: type === 'players' },
    { navItem: 'Team', url: allRoutes.searchTeam, active: type === 'team' }
  ]
}
