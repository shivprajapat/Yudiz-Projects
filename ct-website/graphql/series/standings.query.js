import { gql } from '@apollo/client'

export const GET_ROUNDS = gql`
  query FetchSeriesRounds($input: oSeriesIdInput) {
    fetchSeriesRounds(input: $input) {
      _id
      sName
    }
  }
`

export const GET_STANDING_DATA = gql`
  query FetchSeriesStandings($input: oSeriesStandingsInput) {
    fetchSeriesStandings(input: $input) {
      _id
      dUpdated
      oRound {
        _id
        iSeriesId
        nOrder
        sName
      }
      iSeriesId
      oTeam {
        _id
        sAbbr
        sTitle
      }
      nDraw
      nLoss
      nNR
      nNetrr
      nOverAgainst
      nOverFor
      nPlayed
      nPoints
      nRunAgainst
      nRunFor
      nWin
      oSeries {
        sSeriesType
      }
    }
  }
`
