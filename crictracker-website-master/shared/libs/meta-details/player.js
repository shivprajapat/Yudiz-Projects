export const getPlayerSeoData = ({ tab, seoData, player }) => {
  const name = player?.sFullName || player?.sFirstName
  if (tab === 'news') {
    return {
      ...seoData,
      sTitle: `${name} News | ${name} Latest Cricket News & Updates`,
      sDescription: `${name} Latest News: Check out the latest cricket news and updates on ${name}, including interviews, news headlines highlighting his performances and achievements on CricTracker.`,
      aKeywords: [`${name} news`, `${name} articles`, `${name} stories`, `${name} latest`, `${name} latest news`]
    }
  } else if (tab === 'stats') {
    return {
      ...seoData,
      sTitle: `${name}'s Records & Stats Info - ${name}'s Career in Numbers`,
      sDescription: `${name} Stats: Check out the career history of ${name}, including ${name}'s impressive records, runs, wickets, centuries, half-centuries, and compelling statistics that showcase his remarkable journey in cricket.`,
      aKeywords: [`${name} stats`, `${name} Batting stats`, `${name} Bowling stats`, `${name} Fielding stats`, `${name} Test match stats`, `${name} ODI stats`, `${name} T20 stats`]
    }
  } else return seoData
}
