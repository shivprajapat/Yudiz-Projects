import { gql } from '@apollo/client'

export const LIST_SERIES_FANTASY_TIPS = gql`
query ListSeriesFantasyTipsFront($input: oListSeriesFantasyTipsInput!) {
  listSeriesFantasyTipsFront(input: $input) {
    _id
    dStartDate
    aFantasyTips {
      ePlatformType
      _id
      oSeo {
        sSlug
      }
    }
    oSeries {
      sTitle
    }
    oTeamA {
      sAbbr
      oImg {
        sUrl
      }
      sTitle
    }
    oTeamB {
      sAbbr
      oImg {
        sUrl
      }
      sTitle
    }
    oVenue {
      sLocation
    }
    sFormatStr
    sSubtitle
  }
}
`
