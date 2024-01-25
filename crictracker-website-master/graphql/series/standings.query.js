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
        eTagStatus
        oImg {
          sUrl
        }
        oSeo {
          sSlug
        }
        aMatch {
          oTeamScoreA {
            oTeam {
              sTitle
              _id
            }
          }
          oTeamScoreB {
            oTeam {
              _id
              sTitle
            }
          }
          sSubtitle
          sStatusNote
          sStatusStr
          sWinMargin
          dStartDate
          oSeo {
            sSlug
          }
          oWinner {
            _id
          }
        }
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
      bIsQualified
    }
  }
`
