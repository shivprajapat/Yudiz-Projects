import React from 'react'
import PropTypes from 'prop-types'

import PlayerRoles from '../playerRoles'
import useTranslation from 'next-translate/useTranslation'
import MyImage from '@shared/components/myImage'
import Logo from '@assets/images/logo.png'
import infoIcon from '@assets/images/icon/info-icon.svg'
import { getMatchPlayers } from '@shared/libs/match-detail'

export default function SingleFantasyLeague({ styles, data, indexJ, type, teamAID, leagueType, playerTeam = {} }) {
  const { t } = useTranslation()
  const totalCredits = 100
  // NOTE: -----For only match detail page
  const matchPlayer = getMatchPlayers()

  const credits = data?.aSelectedPlayerFan?.reduce((acc, credit) => data?.oTPFan?._id !== credit._id && acc + credit.nRating, 0)

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
            <div className={`${styles.teamDetails} d-flex align-items-center`}>
              <div className={`${styles.name} ${teamAID === data?.oTeam?._id ? styles.nameDark : ''} ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3 mt-0 px-2 mx-1 mx-md-2 d-flex align-items-center`}>
                {data?.oTeamA?.oTeam?.sAbbr || data?.oTeamA?.oTeam?.sTitle}
              </div>
              <p className="flex-shrink-0 ms-2 me-2 ms-sm-3 me-sm-3 mb-0">
                {data?.oTeamA?.nCount} : {data?.oTeamB?.nCount}
              </p>
              <div className={`${styles.name} ${styles.nameDark} ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3 mt-0 px-2 mx-1 mx-md-2 d-flex align-items-center`}>
                {data?.oTeamB?.oTeam?.sAbbr || data?.oTeamB?.oTeam?.sTitle}
              </div>
            </div>
          </div>
          <p className="text-end mb-0">
            <span className="text-muted font-semi">{t('common:CreditsLeft')}</span> <br />
            {totalCredits - credits}/100
          </p>
        </div>
        <div className={`${styles.team} d-flex flex-column align-items-center position-relative`}>
          <div className={`${styles.teamInfo} position-absolute end-0 top-0 rounded-circle mt-2 me-2 d-block d-md-none`}>
            <MyImage src={infoIcon} alt="info" />
            <div className={`${styles.teamDesc} position-absolute end-0 top-0 overflow-hidden rounded-pill mt-4 text-nowrap text-capitalize px-2 xsmall-text`}>
              {leagueType}
            </div>
          </div>
          <div className={`${styles.waterMark} position-absolute`}>
            <MyImage src={Logo} alt="logo" />
          </div>
          <label className={`${styles.label} xsmall-text text-uppercase mt-2 mt-sm-3`}>{t('common:WicketKeeper')}</label>
          <div className={`${styles.playerList} d-flex justify-content-center w-100 flex-wrap text-center mt-1 mt-md-2`}>
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return (
                (player?.eRole === 'wk' || player?.eRole === 'wkbat') && (
                  <PlayerRoles
                    styles={styles}
                    key={index}
                    data={player}
                    capData={data}
                    playerTeam={playerTeam[player?.oTeam?._id] || matchPlayer[player?.oPlayer?._id]?.oTeam}
                    teamA={teamAID}
                  />
                )
              )
            })}
          </div>
          <label className={`${styles.label} xsmall-text text-uppercase mt-2 mt-sm-3`}>{t('common:Batter')}</label>
          <div className={`${styles.playerList} d-flex justify-content-center w-100 flex-wrap text-center mt-1 mt-md-2`}>
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'bat' && (
                <PlayerRoles
                  styles={styles}
                  key={index}
                  data={player}
                  capData={data}
                  teamA={teamAID}
                  playerTeam={playerTeam[player?.oTeam?._id] || matchPlayer[player?.oPlayer?._id]?.oTeam}
                />
              )
            })}
          </div>
          <label className={`${styles.label} xsmall-text text-uppercase mt-2 mt-sm-3`}>{t('common:AllRounder')}</label>
          <div className={`${styles.playerList} d-flex justify-content-center w-100 flex-wrap text-center mt-1 mt-md-2`}>
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'all' && (
                <PlayerRoles
                  styles={styles}
                  key={index}
                  data={player}
                  capData={data}
                  playerTeam={playerTeam[player?.oTeam?._id] || matchPlayer[player?.oPlayer?._id]?.oTeam}
                  teamA={teamAID}
                />
              )
            })}
          </div>
          <label className={`${styles.label} xsmall-text text-uppercase mt-2 mt-sm-3`}>{t('common:Bowler')}</label>
          <div className={`${styles.playerList} d-flex justify-content-center w-100 flex-wrap text-center mt-1 mt-md-2`}>
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'bowl' && (
                <PlayerRoles
                  styles={styles}
                  key={index}
                  data={player}
                  capData={data}
                  teamA={teamAID}
                  playerTeam={playerTeam[player?.oTeam?._id] || matchPlayer[player?.oPlayer?._id]?.oTeam}
                />
              )
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
  teamAID: PropTypes.string,
  leagueType: PropTypes.string,
  playerTeam: PropTypes.object
}
