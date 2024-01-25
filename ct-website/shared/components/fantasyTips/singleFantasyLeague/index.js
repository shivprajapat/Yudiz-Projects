import React from 'react'
import PropTypes from 'prop-types'

import PlayerRoles from '../playerRoles'
import useTranslation from 'next-translate/useTranslation'

export default function SingleFantasyLeague({ styles, data, indexJ, type, teamAID }) {
  const { t } = useTranslation()
  const totalCredits = 100
  const credits = data?.aSelectedPlayerFan?.reduce((acc, credit) => (data?.oTPFan?._id !== credit._id) && acc + credit.nRating, 0)

  return (
    <>
      <div className={`${styles.teamBlock} w-100 flex-shrink-0`}>
        <div className={`${styles.info} d-flex justify-content-between`}>
          <p className="mb-0">
            <span className="text-muted font-semi">{t('common:Players')}</span> <br />
            {data?.aSelectedPlayerFan?.length}/{type === 'ew' ? 12 : 11}
          </p>
          <div className="mb-0">
            <p className="text-center mb-0">
              {t('common:Team')} {indexJ + 1}
            </p>
            <div className="d-flex align-items-center">
              <div className={`${styles.point} text-dark bg-light ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3`}>{data?.oTeamA?.sTitle}</div>
              <p className="flex-shrink-0 ms-2 me-2 ms-sm-3 me-sm-3 mb-0">
                {data?.oTeamA?.nCount} : {data?.oTeamB?.nCount}
              </p>
              <div className={`${styles.point} text-light bg-dark ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3`}>{data?.oTeamB?.sTitle}</div>
            </div>
          </div>
          <p className="text-end mb-0">
            <span className="text-muted font-semi">{t('common:CreditsLeft')}</span> <br />
            {totalCredits - credits}/100
          </p>
        </div>
        <div className={`${styles.team} d-flex flex-column align-items-center`}>
          <label className={`${styles.label} xsmall-text text-light text-uppercase mt-2 mt-sm-3`}>{t('common:WicketKeeper')}</label>
          <div className={`${styles.playerList} d-flex justify-content-center w-100 flex-wrap text-center mt-2`}>
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return (player?.eRole === 'wk' || player?.eRole === 'wkbat') && <PlayerRoles styles={styles} key={index} data={player} capData={data} teamA={teamAID}/>
            })}
          </div>
          <label className={`${styles.label} xsmall-text text-light text-uppercase mt-2 mt-sm-3`}>{t('common:Batter')}</label>
          <div className={`${styles.playerList} d-flex justify-content-center w-100 flex-wrap text-center mt-2`}>
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'bat' && <PlayerRoles styles={styles} key={index} data={player} capData={data} teamA={teamAID}/>
            })}
          </div>
          <label className={`${styles.label} xsmall-text text-light text-uppercase mt-2 mt-sm-3`}>{t('common:AllRounder')}</label>
          <div className={`${styles.playerList} d-flex justify-content-center w-100 flex-wrap text-center mt-2`}>
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'all' && <PlayerRoles styles={styles} key={index} data={player} capData={data} teamA={teamAID}/>
            })}
          </div>
          <label className={`${styles.label} xsmall-text text-light text-uppercase mt-2 mt-sm-3`}>{t('common:Bowler')}</label>
          <div className={`${styles.playerList} d-flex justify-content-center w-100 flex-wrap text-center mt-2`}>
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'bowl' && <PlayerRoles styles={styles} key={index} data={player} capData={data} teamA={teamAID}/>
            })}
          </div>
        </div>
      </div>
    </>
  )
}

SingleFantasyLeague.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object,
  indexJ: PropTypes.number,
  playerData: PropTypes.array,
  type: PropTypes.string,
  teamAID: PropTypes.string
}
