import ReactGA from 'react-ga'

export const callEvent = (category, action, pathname) => {
  ReactGA.event({
    category,
    action
  })

  ReactGA.set({ page: pathname })
  ReactGA.pageview(pathname)
}

export const viewMatch = (matchName, matchId, pathname) => {
  ReactGA.event({
    category: 'view_match',
    action: 'view the match',
    label: matchName,
    value: matchId,
    nonInteraction: true
  })

  ReactGA.set({ page: pathname })
  ReactGA.pageview(pathname)
}

export const viewContest = (contestName, leagueId, pathname) => {
  ReactGA.event({
    category: 'view_contest',
    action: 'viewing the contest',
    label: contestName,
    value: leagueId,
    nonInteraction: true
  })

  ReactGA.set({ page: pathname })
  ReactGA.pageview(pathname)
}

export const viewMatchTips = (matchName, matchId, pathname) => {
  ReactGA.event({
    category: 'view_match_tips',
    action: 'viewing the match tips',
    label: matchName,
    value: matchId,
    nonInteraction: true
  })

  ReactGA.set({ page: pathname })
  ReactGA.pageview(pathname)
}

export const viewLiveMatch = (matchName, matchId, pathname) => {
  ReactGA.event({
    category: 'view_live_match',
    action: 'viewing the Live match',
    label: matchName,
    value: matchId,
    nonInteraction: true
  })

  ReactGA.set({ page: pathname })
  ReactGA.pageview(pathname)
}

export const createPrivateContest = (contestName, matchId, pathname) => {
  ReactGA.event({
    category: 'create_private_contest',
    action: 'Creating a Private contest',
    label: contestName,
    value: matchId,
    nonInteraction: true
  })

  ReactGA.set({ page: pathname })
  ReactGA.pageview(pathname)
}

export const joinPrivateContest = (contestName, matchId, pathname) => {
  ReactGA.event({
    category: 'join_private_contest',
    action: 'joining a Private contest',
    label: contestName,
    value: matchId,
    nonInteraction: true
  })

  ReactGA.set({ page: pathname })
  ReactGA.pageview(pathname)
}

export const createTeam = (matchName, matchId, pathname) => {
  ReactGA.event({
    category: 'create_team',
    action: 'Creating a Team',
    label: matchName,
    value: matchId,
    nonInteraction: true
  })

  ReactGA.set({ page: pathname })
  ReactGA.pageview(pathname)
}

export const joinTeam = (contestId, matchId, pathname) => {
  ReactGA.event({
    category: 'join_team',
    action: 'joining with a Team',
    label: contestId,
    value: matchId,
    nonInteraction: true
  })

  ReactGA.set({ page: pathname })
  ReactGA.pageview(pathname)
}
