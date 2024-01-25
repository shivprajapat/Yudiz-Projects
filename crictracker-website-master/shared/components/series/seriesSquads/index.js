import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import { Col, Row } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import styles from '../stats/style.module.scss'
import { GET_TEAM_PLAYER } from '@graphql/series/squads.query'
import CustomSelect from '@shared/components/customSelect'

const ArticleSkeleton = dynamic(() => import('@shared/components/skeleton/components/articleSkeleton'), { ssr: false })
const SearchCard = dynamic(() => import('@shared/components/searchComponents/searchCard'), { loading: () => <ArticleSkeleton type="t" /> })
const NoData = dynamic(() => import('@shared-components/noData'), { ssr: false })

function SeriesSquads({ team = [], players, id }) {
  const { t } = useTranslation()
  const router = useRouter()
  const selectedTeamId = router?.query?.teamId
  const [player, setPlayer] = useState(players)
  const newTeam = team?.filter((data) => data?._id !== '622d96830961155e958ac6cf')
  const selectedTeam = useRef(selectedTeamId ? newTeam?.find(item => item?._id === selectedTeamId) : newTeam[0])
  const [getPlayers, { data, loading }] = useLazyQuery(GET_TEAM_PLAYER)

  useEffect(() => {
    if (data?.listSeriesSquad) {
      setPlayer(data?.listSeriesSquad)
    }
  }, [data])

  const handleTeam = (item) => {
    selectedTeam.current = item
    router.push({
      pathname: window?.location?.pathname,
      query: { teamId: item?._id }
    }, undefined, { shallow: true })
    getPlayers({ variables: { input: { iSeriesId: id, iTeamId: item._id } } })
  }

  return (
    <>
      {(newTeam?.length !== 0 || player?.length !== 0) && (
        <>
          <div className={`${styles.filterTitle} d-flex justify-content-between align-items-center mb-2`}>
            <h4 className="text-uppercase mb-0">
              <span className="text-capitalize">{selectedTeam.current?.sTitle} <Trans i18nKey="common:Squad" /></span>
            </h4>
            <div className={styles.filterStats}>
              <CustomSelect
                options={newTeam}
                placeholder="Team"
                labelKey="sTitle"
                valueKey="_id"
                value={selectedTeam.current}
                onChange={(e) => handleTeam(e)}
                align={'end'}
                isNative
              />
            </div>
          </div>
          {player?.length !== 0 && (
            <>
              <h3 className="small-head">{t('common:Batsmen')}</h3>
              <Row className="mb-2 mb-sm-1">
                {!loading && player?.map((p) => {
                  if (p?.oPlayer?.sPlayingRole === 'bat') {
                    return (
                      <Col key={p?.oPlayer._id} md={6}>
                        <SearchCard data={{ ...p?.oPlayer, oTeam: p?.oTeam }} />
                      </Col>
                    )
                  } else {
                    return null
                  }
                })}
                {loading && [0, 1, 2, 3].map((e) => (
                  <Col key={e} md={6}>
                    <ArticleSkeleton type="t" />
                  </Col>
                ))}
              </Row>
              <h3 className="small-head">{t('common:AllRounder')}</h3>
              <Row className="mb-2 mb-sm-1">
                {!loading && player?.map((p) => {
                  if (p?.oPlayer?.sPlayingRole === 'all') {
                    return (
                      <Col key={p?.oPlayer._id} md={6}>
                        <SearchCard data={{ ...p?.oPlayer, oTeam: p?.oTeam }} />
                      </Col>
                    )
                  } else {
                    return null
                  }
                })}
                {loading && [0, 1, 2, 3].map((e) => (
                  <Col key={e} md={6}>
                    <ArticleSkeleton type="t" />
                  </Col>
                ))}
              </Row>
              <h3 className="small-head">{t('common:WicketKeeper')}</h3>
              <Row className="mb-2 mb-sm-1">
                {!loading && player?.map((p) => {
                  if (p?.oPlayer?.sPlayingRole === 'wk') {
                    return (
                      <Col key={p?.oPlayer._id} md={6}>
                        <SearchCard data={{ ...p?.oPlayer, oTeam: p?.oTeam }} />
                      </Col>
                    )
                  } else {
                    return null
                  }
                })}
                {loading && [0, 1, 2, 3].map((e) => (
                  <Col key={e} md={6}>
                    <ArticleSkeleton type="t" />
                  </Col>
                ))}
              </Row>
              <h3 className="small-head">{t('common:Bowler')}</h3>
              <Row className="mb-2 mb-sm-1">
                {!loading && player?.map((p) => {
                  if (p?.oPlayer?.sPlayingRole === 'bowl') {
                    return (
                      <Col key={p?.oPlayer._id} md={6}>
                        <SearchCard data={{ ...p?.oPlayer, oTeam: p?.oTeam }} />
                      </Col>
                    )
                  } else {
                    return null
                  }
                })}
                {loading && [0, 1, 2, 3].map((e) => (
                  <Col key={e} md={6}>
                    <ArticleSkeleton type="t" />
                  </Col>
                ))}
              </Row>
            </>
          )}
          {player?.length === 0 && <NoData />}
        </>
      )}
      {team?.length === 0 && player?.length === 0 && <NoData />}
    </>
  )
}
SeriesSquads.propTypes = {
  team: PropTypes.array,
  players: PropTypes.array,
  id: PropTypes.string
}
export default SeriesSquads
