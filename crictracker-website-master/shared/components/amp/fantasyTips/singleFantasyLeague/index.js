import React from 'react'
import PropTypes from 'prop-types'

import PlayerRoles from '../playerRoles'
import useTranslation from 'next-translate/useTranslation'
import infoIcon from '@assets/images/icon/info-icon.svg'
export default function SingleFantasyLeague({ data, indexJ, type, teamAID, leagueType, playerTeam }) {
  const { t } = useTranslation()
  const credits = data?.aSelectedPlayerFan?.reduce((acc, credit) => (data?.oTPFan?._id !== credit._id) && acc + credit.nRating, 0)
  return (
    <>
      <style jsx amp-custom>{`
      .flex-wrap{flex-wrap:wrap;-webkit-flex-wrap:wrap}.text-end{text-align:right}.text-center{text-align:center}.bg-dark{background:#23272e;color:#fff}.bg-light{background:#fff}.point{margin:4px 4px 0px;padding:0px 4px;border-radius:3px}.teamBlock{background:var(--light);border-radius:32px}.info{padding:12px 24px 8px;-webkit-justify-content:space-between;justify-content:space-between}.info>p{width:30%}p{margin:0}.toss{background:var(--theme-bg);border-radius:8px}.toss .icon{display:block;width:28px}.waterMark{width:480px;max-width:75%;left:50%;top:50%;-webkit-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);transform:translate(-50%, -50%);opacity:.05;position:absolute}.teamDetails .name{width:auto}.name{width:100%;margin-top:2px;padding:4px;color:#23272e;position:relative;font-size:11px;line-height:13px;background:#fff;border-radius:3px;word-break:break-word}.name span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.name.nameDark{background:#23272e;color:#fff}.team{margin-bottom:0px;flex-grow:1;padding:8px 16px 24px;background:#14b305 url(/static/cricket-ground.svg) no-repeat center center/cover;border-radius:32px;text-align:center;justify-content:center;position:relative}.label{letter-spacing:1px;opacity:.56;color:#fff}.playerList{display:flex;display:-webkit-flex;-webkit-justify-content:center;justify-content:center}.teamInfo{background:#fff;height:20px;width:20px;cursor:pointer;white-space:nowrap;z-index:5}.teamDesc{background:#fff;color:#23272e;opacity:0}.teamInfo:hover .teamDesc{opacity:1}@media(max-width: 767px){.team,.teamBlock{border-radius:16px}.info{padding-left:12px;padding-right:12px}.info>p{font-size:12px}.label{margin-top:8px}.team{margin-bottom:0px;flex-grow:1;padding:8px 8px 24px}}/*# sourceMappingURL=style.css.map */

      `}</style>
      <div className="teamBlock d-flex flex-column">
        <div className="info d-flex justify-content-between">
          <p className="mb-0">
            <span className="text-muted font-semi">{t('common:Players')}</span> <br />
            {data?.aSelectedPlayerFan?.length}/{type === 'ew' ? 12 : 11}
          </p>
          <div className="mb-0">
            <p className="text-center mb-0">
              {t('common:Team')} {indexJ + 1}
            </p>
            <div className="teamDetails d-flex align-items-center justify-content-center">
              <div className={`name ${teamAID === data?.oTeam?._id ? 'nameDark' : ''} ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3 mt-0 px-2 mx-1 mx-md-2 d-flex align-items-center`}>{data?.oTeamA?.oTeam?.sAbbr || data?.oTeamA?.oTeam?.sTitle}</div>
              <p className="flex-shrink-0 ms-2 me-2 ms-sm-3 me-sm-3 mb-0">
                {data?.oTeamA?.nCount} : {data?.oTeamB?.nCount}
              </p>
              <div className="name nameDark ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3 mt-0 px-2 mx-1 mx-md-2 d-flex align-items-center">{data?.oTeamB?.oTeam?.sAbbr || data?.oTeamB?.oTeam?.sTitle}</div>
            </div>
          </div>
          <p className="text-end mb-0">
            <span className="text-muted font-semi">{t('common:CreditsLeft')}</span> <br />
            {100 - credits}/100
          </p>
        </div>
        <div className="team d-flex flex-column align-items-center">
        <div className="teamInfo position-absolute end-0 top-0 rounded-circle mt-2 me-2 d-block d-md-none">
            <amp-img src={infoIcon.src} alt="info" width="20" height="20" layout="responsive"></amp-img>
            <div className="teamDesc position-absolute end-0 top-0 overflow-hidden rounded-pill mt-4 text-nowrap text-capitalize px-2 xsmall-text">
              {leagueType}
            </div>
          </div>
          <amp-img className={'waterMark'} layout='responsive' src="/static/logo.png" alt="logo" width='689' height='108'></amp-img>
          <label className="label xsmall-text text-light text-uppercase mt-1">{t('common:WicketKeeper')}</label>
          <div className="playerList d-flex justify-content-center w-100 flex-wrap text-center mt-1">
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return (player?.eRole === 'wk' || player?.eRole === 'wkbat') && <PlayerRoles playerTeam={playerTeam[player?.oTeam?._id]} key={index} data={player} capData={data} teamA={teamAID} />
            })}
          </div>
          <label className="label xsmall-text text-light text-uppercase mt-1">{t('common:Batter')}</label>
          <div className="playerList d-flex justify-content-center w-100 flex-wrap text-center mt-1">
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'bat' && <PlayerRoles playerTeam={playerTeam[player?.oTeam?._id]} key={index} data={player} capData={data} teamA={teamAID} />
            })}
          </div>
          <label className="label xsmall-text text-light text-uppercase mt-1">{t('common:AllRounder')}</label>
          <div className="playerList d-flex justify-content-center w-100 flex-wrap text-center mt-1">
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'all' && <PlayerRoles playerTeam={playerTeam[player?.oTeam?._id]} key={index} data={player} capData={data} teamA={teamAID} />
            })}
          </div>
          <label className="label xsmall-text text-light text-uppercase mt-1">{t('common:Bowler')}</label>
          <div className="playerList d-flex justify-content-center w-100 flex-wrap text-center mt-1">
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'bowl' && <PlayerRoles playerTeam={playerTeam[player?.oTeam?._id]} key={index} data={player} capData={data} teamA={teamAID} />
            })}
          </div>
        </div>
      </div>
    </>
  )
}

SingleFantasyLeague.propTypes = {
  data: PropTypes.object,
  indexJ: PropTypes.number,
  type: PropTypes.string,
  teamAID: PropTypes.string,
  leagueType: PropTypes.string,
  playerTeam: PropTypes.object
}
