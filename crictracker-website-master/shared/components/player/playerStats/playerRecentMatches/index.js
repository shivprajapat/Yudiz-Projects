import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import PropTypes from 'prop-types'
import { Nav } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'

import { tableLoader } from '@shared/libs/allLoader'
import { GET_PLAYER_RECENT_MATCH } from '@graphql/players/players.query'
import { convertDt24h } from '@shared/utils'
import usePlayerMatchStatsLabels from '@shared/hooks/usePlayerMatchStatsLabels'

const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })
const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })
const Title = dynamic(() => import('@shared/components/player/playerStats/title'))
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })

function PlayerRecentMatches({ playerDetails, playerRecentMatch }) {
  const { t } = useTranslation()
  const [playerRecentMatchData, setPlayerRecentMatchData] = useState(playerRecentMatch?.[0]?.aMatchData)
  const options = {
    isBattingData: playerRecentMatchData?.some(data => data?.aBattingData?.length),
    isBowlingData: playerRecentMatchData?.some(data => data?.aBowlingData?.length)
  }

  const labels = usePlayerMatchStatsLabels(playerDetails?.sPlayingRole, options)
  const selectedMatch = useRef('all')

  const [getPlayerRecentMatches, { loading }] = useLazyQuery(GET_PLAYER_RECENT_MATCH, {
    fetchPolicy: 'no-cache',
    onCompleted: (playerRecentMatches) => {
      setPlayerRecentMatchData(playerRecentMatches.getRecentMatchesOfPlayer?.[0]?.aMatchData)
    }
  })

  const handleSelectedMatch = (value) => {
    selectedMatch.current = value
    getPlayerRecentMatches({ variables: { input: { _id: playerDetails?._id, aFormatStr: [value] } } })
  }

  useEffect(() => {
    setPlayerRecentMatchData(playerRecentMatch?.[0]?.aMatchData)
  }, [playerRecentMatch])

  if (playerRecentMatch?.length) {
    return (
      <section className="common-box">
        <div className="d-lg-flex align-items-center">
          <Title heading={'RecentForm'} />
          <Nav className="text-uppercase equal-width-nav mb-2 ms-lg-3 ms-xl-4 mt-2 mt-lg-0" variant="pills">
            <Nav.Item>
              <Nav.Link
                className={`nav-link py-1 py-lg-2 px-3 ${selectedMatch.current === 'all' && 'active'}`}
                onClick={() => handleSelectedMatch('all')}
              >
                {t('common:All')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={`nav-link py-1 py-lg-2 px-3 ms-2 ${selectedMatch.current === 'test' && 'active'}`}
                onClick={() => handleSelectedMatch('test')}
              >
                {t('common:Test')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={`nav-link py-1 py-lg-2 px-3 ms-2 ${selectedMatch.current === 'odi' && 'active'}`}
                onClick={() => handleSelectedMatch('odi')}
              >
                {t('common:ODI')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={`nav-link py-1 py-lg-2 px-3 ms-2 ${selectedMatch.current === 't20' && 'active'}`}
                onClick={() => handleSelectedMatch('t20')}
              >
                {t('common:T20')}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        {playerRecentMatchData?.length > 0 ? (
          <ThemeTable labels={(selectedMatch.current !== 'all') ? labels[1] : labels[0]} isDark headClass={{ index: 0, className: 'text-start text-sm-center position-sticky start-0' }}>
            {playerRecentMatchData?.map((element, index) => {
              const { aBattingData, aBowlingData } = element
              const oMatch = element?.aMatch?.[0]
              const battingLength = aBattingData?.length
              const bowlingLength = aBowlingData?.length

              return (
                <React.Fragment key={element?._id}>
                  {!loading &&
                    <tr>
                      <td className="text-start text-sm-center position-sticky start-0">{oMatch?.sShortTitle || oMatch?.sTitle || '-'}</td>
                      {options?.isBattingData ? <td>
                        {battingLength ? aBattingData?.map((bat, i) =>
                          <React.Fragment key={`bat${i}`}>
                            {bat?.nRuns ?? '--'}{bat?.bIsBatting ? '*' : ''}{(battingLength - 1) !== i ? ' & ' : ''}
                          </React.Fragment>
                        ) : '-'}
                      </td> : null}
                      {options?.isBowlingData ? <td>
                        {bowlingLength ? aBowlingData?.map((bowl, i) =>
                          <React.Fragment key={`bowl${i}`}>
                            {bowl?.nWickets || 0}/{bowl?.nRunsConceded || 0}{(bowlingLength - 1) !== i ? ' & ' : ''}
                          </React.Fragment>
                        ) : '-'}
                      </td> : null}
                      <td>{convertDt24h(oMatch?.dStartDate)}</td>
                      <td>{element?.oVenue?.sLocation}</td>
                      {(selectedMatch.current === 'all') && <td className={'text-uppercase'}>{oMatch?.sFormatStr}</td>}
                    </tr>
                  }
                  {loading &&
                    <tr>
                      <td><Skeleton /></td>
                      {options?.isBattingData ? <td>
                        <Skeleton />
                      </td> : null}
                      {options?.isBowlingData ? <td>
                        <Skeleton />
                      </td> : null}
                      <td><Skeleton /></td>
                      <td><Skeleton /></td>
                      {(selectedMatch.current === 'all') && <td className={'text-uppercase'}><Skeleton /></td>}
                    </tr>
                  }
                </React.Fragment>
              )
            })}
          </ThemeTable>
        ) : <NoData />}
      </section>
    )
  } else return null
}
PlayerRecentMatches.propTypes = {
  playerDetails: PropTypes.object,
  playerRecentMatch: PropTypes.array
}
export default PlayerRecentMatches
