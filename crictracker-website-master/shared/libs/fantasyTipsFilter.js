export function filterFantasyTips(data, format, team, series) {
  return data?.filter((data) => {
    if (format && series && team) {
      if (
        data?.sFormatStr === format &&
        data?.oSeries?.sTitle === series &&
        (data?.oTeamA?.sTitle === team || data?.oTeamB?.sTitle === team)
      ) {
        return data
      } else return null
    } else if ((format && series) || (series && team) || (format && team)) {
      if (format && series && data?.sFormatStr === format && data?.oSeries?.sTitle === series) {
        return data
      } else if (series && team && data?.oSeries?.sTitle === series && (data?.oTeamA?.sTitle === team || data?.oTeamB?.sTitle === team)) {
        return data
      } else if (format && team && data?.sFormatStr === format && (data?.oTeamA?.sTitle === team || data?.oTeamB?.sTitle === team)) {
        return data
      } else return null
    } else if (format ? data?.sFormatStr === format : series ? data?.oSeries?.sTitle === series : data?.oTeamA?.sTitle === team || data?.oTeamB?.sTitle === team) {
      return data
    } else return null
  })
}
