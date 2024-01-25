import { gql } from '@apollo/client'

export const STATS = gql`
  query FetchSeriesStats($input: fetchSeriesStatsInput) {
    fetchSeriesStats(input: $input) {
      _id
      dCreated
      dUpdated
      dModified
      eProvider
      oPlayer {
        sFirstName
        sFullName
      }
      iSeriesId
      iSeriesStatsId
      nBalls
      nAverage
      nCatches
      nHighest
      nInnings
      nMatches
      nNotout
      nRun4
      nRun6
      nRun50
      nRun100
      nRuns
      nStumpings
      sStrike
      nEcon
      nMaidens
      nRunsConceded
      nOvers
      nWicket4i
      nWicket5i
      nWicket10m
      nWickets
      sBestInning
      sBestMatch
      oTeam {
        _id
        sAbbr
        sTitle
      }
    }
  }
`

export const FETCH_SERIES_STATS_TYPE = gql`
  query FetchSeriesStatsTypes($input: fetchSeriesStatsTypesInput) {
    fetchSeriesStatsTypes(input: $input) {
      _id
      eGroupTitle
      sDescription
      sType
      aHeaders
      eFullTitle
      sSeoType
    }
  }
`

export const MATCH_TYPES = gql`
  query Query($input: oListSeriesStatsFormatInput!) {
    listSeriesStatsFormat(input: $input)
  }
`
