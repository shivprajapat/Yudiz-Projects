import { allRoutes } from './allRoutes'

export const seriesCategoryNav = ({ slug, activePath, isSeries, totalTeams, tabName, tabSlug, reWriteURLS = [] }) => {
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
  } else if (isSeries === 's') {
    return [
      { navItem: 'Home', internalName: 'home' },
      { navItem: 'News', internalName: 'news' },
      { navItem: 'Videos', internalName: 'videos' }
    ]
  } else if (isSeries === 'gt' || isSeries === 'p' || isSeries === 't' || isSeries === 'fac') {
    return [
      { navItem: 'Home', internalName: 'home' },
      { navItem: 'News', internalName: 'news' },
      { navItem: 'Fantasy Articles', internalName: 'fantasyArticle' }
    ]
  } else {
    return []
  }
}

export const matchDetailNav = (slug, activePath, isStandingSlug, status, seriesTotalTeams, isCommentryStart) => {
  if (status === 'scheduled' || !isCommentryStart) {
    if (seriesTotalTeams > 2) {
      return [
        { navItem: 'Overview', url: allRoutes.matchDetail(slug), active: allRoutes.matchDetail(slug) === activePath },
        { navItem: 'Scorecard', url: allRoutes.matchDetailScorecard(`/${slug}/`), active: allRoutes.matchDetailScorecard(`/${slug}/`) === activePath },
        seriesTotalTeams > 2 && { navItem: 'Standings', url: allRoutes.seriesStandings(`/${isStandingSlug}/`), active: allRoutes.seriesStandings(`/${isStandingSlug}/`) === activePath },
        { navItem: 'News', url: allRoutes.matchDetailNews(`/${slug}/`), active: allRoutes.matchDetailNews(`/${slug}/`) === activePath },
        { navItem: 'Overs', url: allRoutes.matchDetailOvers(`/${slug}/`), active: allRoutes.matchDetailOvers(`/${slug}/`) === activePath },
        { navItem: 'Upcoming', url: allRoutes.matchDetailUpcoming(`/${slug}/`), active: allRoutes.matchDetailUpcoming(`/${slug}/`) === activePath },
        { navItem: 'Results', url: allRoutes.matchDetailResult(`/${slug}/`), active: allRoutes.matchDetailResult(`/${slug}/`) === activePath },
        { navItem: 'Fantasy Tips', url: allRoutes.matchDetailFantasyTips(`/${slug}/`), active: allRoutes.matchDetailFantasyTips(`/${slug}/`) === activePath }
      ]
    } else {
      return [
        { navItem: 'Overview', url: allRoutes.matchDetail(slug), active: allRoutes.matchDetail(slug) === activePath },
        { navItem: 'Scorecard', url: allRoutes.matchDetailScorecard(`/${slug}/`), active: allRoutes.matchDetailScorecard(`/${slug}/`) === activePath },
        { navItem: 'News', url: allRoutes.matchDetailNews(`/${slug}/`), active: allRoutes.matchDetailNews(`/${slug}/`) === activePath },
        { navItem: 'Overs', url: allRoutes.matchDetailOvers(`/${slug}/`), active: allRoutes.matchDetailOvers(`/${slug}/`) === activePath },
        { navItem: 'Upcoming', url: allRoutes.matchDetailUpcoming(`/${slug}/`), active: allRoutes.matchDetailUpcoming(`/${slug}/`) === activePath },
        { navItem: 'Results', url: allRoutes.matchDetailResult(`/${slug}/`), active: allRoutes.matchDetailResult(`/${slug}/`) === activePath },
        { navItem: 'Fantasy Tips', url: allRoutes.matchDetailFantasyTips(`/${slug}/`), active: allRoutes.matchDetailFantasyTips(`/${slug}/`) === activePath }
      ]
    }
  } else if (status === 'live' || status === 'completed' || status === 'cancelled') {
    if (seriesTotalTeams > 2) {
      return [
        { navItem: 'Commentary', url: allRoutes.matchDetailCommentary(slug), active: allRoutes.matchDetailCommentary(slug) === activePath },
        { navItem: 'Scorecard', url: allRoutes.matchDetailScorecard(`/${slug}/`), active: allRoutes.matchDetailScorecard(`/${slug}/`) === activePath },
        seriesTotalTeams > 2 && { navItem: 'Standings', url: allRoutes.seriesStandings(`/${isStandingSlug}/`), active: allRoutes.seriesStandings(`/${isStandingSlug}/`) === activePath },
        { navItem: 'News', url: allRoutes.matchDetailNews(`/${slug}/`), active: allRoutes.matchDetailNews(`/${slug}/`) === activePath },
        { navItem: 'Overs', url: allRoutes.matchDetailOvers(`/${slug}/`), active: allRoutes.matchDetailOvers(`/${slug}/`) === activePath },
        { navItem: 'Upcoming', url: allRoutes.matchDetailUpcoming(`/${slug}/`), active: allRoutes.matchDetailUpcoming(`/${slug}/`) === activePath },
        { navItem: 'Results', url: allRoutes.matchDetailResult(`/${slug}/`), active: allRoutes.matchDetailResult(`/${slug}/`) === activePath },
        { navItem: 'Fantasy Tips', url: allRoutes.matchDetailFantasyTips(`/${slug}/`), active: allRoutes.matchDetailFantasyTips(`/${slug}/`) === activePath }
      ]
    } else {
      return [
        { navItem: 'Commentary', url: allRoutes.matchDetailCommentary(slug), active: allRoutes.matchDetailCommentary(slug) === activePath },
        { navItem: 'Scorecard', url: allRoutes.matchDetailScorecard(`/${slug}/`), active: allRoutes.matchDetailScorecard(`/${slug}/`) === activePath },
        { navItem: 'News', url: allRoutes.matchDetailNews(`/${slug}/`), active: allRoutes.matchDetailNews(`/${slug}/`) === activePath },
        { navItem: 'Overs', url: allRoutes.matchDetailOvers(`/${slug}/`), active: allRoutes.matchDetailOvers(`/${slug}/`) === activePath },
        { navItem: 'Upcoming', url: allRoutes.matchDetailUpcoming(`/${slug}/`), active: allRoutes.matchDetailUpcoming(`/${slug}/`) === activePath },
        { navItem: 'Results', url: allRoutes.matchDetailResult(`/${slug}/`), active: allRoutes.matchDetailResult(`/${slug}/`) === activePath },
        { navItem: 'Fantasy Tips', url: allRoutes.matchDetailFantasyTips(`/${slug}/`), active: allRoutes.matchDetailFantasyTips(`/${slug}/`) === activePath }
      ]
    }
  }
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

export const seriesNav = (id, activePath, totalTeams) => {
  const nav = totalTeams > 2 ? [
    { navItem: 'Fixtures', url: allRoutes.seriesHomeAsFixtures(id), active: allRoutes.seriesHomeAsFixtures(id) === activePath },
    { navItem: 'Standings', url: allRoutes.seriesStandings(`/${id}/`), active: allRoutes.seriesStandings(`/${id}/`) === activePath },
    { navItem: 'Stats', url: allRoutes.seriesStats(`/${id}/`), active: allRoutes.seriesStats(`/${id}/`) === activePath },
    { navItem: 'Teams', url: allRoutes.seriesTeams(`/${id}/`), active: allRoutes.seriesTeams(`/${id}/`) === activePath },
    { navItem: 'Squads', url: allRoutes.seriesSquads(`/${id}/`), active: allRoutes.seriesSquads(`/${id}/`) === activePath },
    { navItem: 'Fantasy Tips', url: allRoutes.seriesFantasyTips(`/${id}/`), active: allRoutes.seriesFantasyTips(`/${id}/`) === activePath }
  ] : [
    { navItem: 'Fixtures', url: allRoutes.seriesHomeAsFixtures(id), active: allRoutes.seriesHomeAsFixtures(id) === activePath },
    { navItem: 'Stats', url: allRoutes.seriesStats(`/${id}/`), active: allRoutes.seriesStats(`/${id}/`) === activePath },
    { navItem: 'Squads', url: allRoutes.seriesSquads(`/${id}/`), active: allRoutes.seriesSquads(`/${id}/`) === activePath },
    { navItem: 'Fantasy Tips', url: allRoutes.seriesFantasyTips(`/${id}/`), active: allRoutes.seriesFantasyTips(`/${id}/`) === activePath }
  ]
  return nav
}
