import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { getMatchPlayers } from '@shared/libs/match-detail'

const XIItems = dynamic(() => import('./XIItems'))

const MatchXI = ({ data, status, isOutSideCountryPlane }) => {
  const { t } = useTranslation()

  const team1 = mapTeamPlayer(data?.oTeam1)
  const team2 = mapTeamPlayer(data?.oTeam2)
  const allPlayers = getMatchPlayers()

  function mapTeamPlayer(team) {
    const squad = []
    const playingXI = []
    const substitutes = []
    const reserve = []
    team?.aPlayers.forEach(p => {
      if (p?.bPlaying11 && !p?.bSubstitute) playingXI.push(p)
      if (p?.bSubstitute) substitutes.push(p)
      if (!p?.bPlaying11 && !p?.bSubstitute) reserve.push(p)
      if (!p?.bPlaying11) squad.push(p)
    })
    return { squad, playingXI, substitutes, reserve, oTeam: team?.oTeam }
  }

  return (
    <>
      <h4 className="text-uppercase">{team1?.playingXI?.length > 0 ? t('common:Playing11') : t('common:Squads')}</h4>
      <section className={`${styles.matchSquads} common-box`}>
        <div className="d-flex g-1">
          <h3 className="small-head w-50 overflow-hidden text-nowrap t-ellipsis">
            {data?.oTeam1?.oTeam?.sTitle}
          </h3>
          <h3 className="small-head w-50 overflow-hidden text-nowrap t-ellipsis text-end">
            {data?.oTeam2?.oTeam?.sTitle}
          </h3>
        </div>
        {
          status !== 'scheduled' &&
          <>
            <div className={`${styles.teamItems} d-flex`}>
              <div className={`${styles.teamItem} w-50 pe-2`}>
                {team1?.playingXI?.map((player, index) => (
                  <XIItems key={`playingXI${index}`} data={allPlayers[player?.oPlayer?._id]} styles={styles} isOutSideCountryPlane={isOutSideCountryPlane} />
                ))}
              </div>
              <div className={`${styles.teamItem} w-50 ps-2`}>
                {team2?.playingXI?.map((player, index) => (
                  <XIItems key={`playingXI${index}`} data={allPlayers[player?.oPlayer?._id]} styles={styles} isOutSideCountryPlane={isOutSideCountryPlane} />
                ))}
              </div>
            </div>
            {(team1?.substitutes?.length > 0 || team2?.substitutes?.length > 0) &&
              <p className={`${styles.reserve} py-1 my-2 text-center text-uppercase`}>{t('common:substitutes')}</p>
            }
            <div className={`${styles.teamItems} d-flex`}>
              <div className={`${styles.teamItem} w-50 pe-2`}>
                {team1?.substitutes?.map((player, index) => (
                  <XIItems key={`substitutes${index}`} data={allPlayers[player?.oPlayer?._id]} styles={styles} isOutSideCountryPlane={isOutSideCountryPlane} />
                ))}
              </div>
              <div className={`${styles.teamItem} w-50 ps-2`}>
                {team2?.substitutes?.map((player, index) => (
                  <XIItems key={`substitutes${index}`} data={allPlayers[player?.oPlayer?._id]} styles={styles} isOutSideCountryPlane={isOutSideCountryPlane} />
                ))}
              </div>
            </div>
          </>
        }

        {(team1?.reserve?.length > 0 || team2?.reserve?.length > 0) && (status !== 'scheduled') &&
          <p className={`${styles.reserve} py-1 my-2 text-center text-uppercase`}>{t('common:Reserve')}</p>
        }
        <div className={`${styles.teamItems} d-flex`}>
          <div className={`${styles.teamItem} w-50 pe-2`}>
            {
              status !== 'scheduled' &&
              team1?.reserve?.map((player, index) => (
                <XIItems key={`reserve${index}`} data={allPlayers[player?.oPlayer?._id]} styles={styles} isOutSideCountryPlane={isOutSideCountryPlane} />
              ))
            }
            {status === 'scheduled' && (
              <>
                {team1?.squad?.map((player, index) => (
                  <XIItems key={`squad${index}`} data={allPlayers[player?.oPlayer?._id]} styles={styles} isOutSideCountryPlane={isOutSideCountryPlane} />
                ))}
              </>
            )}
          </div>
          <div className={`${styles.teamItem} w-50 ps-2`}>
            {
              status !== 'scheduled' &&
              team2?.reserve?.map((player, index) => (
                <XIItems key={`reserve${index}`} data={allPlayers[player?.oPlayer?._id]} styles={styles} isOutSideCountryPlane={isOutSideCountryPlane} />
              ))
            }
            {status === 'scheduled' && (
              <>
                {team2?.squad?.map((player, index) => (
                  <XIItems key={`squad${index}`} data={allPlayers[player?.oPlayer?._id]} styles={styles} isOutSideCountryPlane={isOutSideCountryPlane} />
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

MatchXI.propTypes = {
  data: PropTypes.object,
  isOutSideCountryPlane: PropTypes.bool,
  status: PropTypes.string
}

export default MatchXI
