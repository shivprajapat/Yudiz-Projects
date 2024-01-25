import React from 'react'
import PropTypes from 'prop-types'

import PlayerRoles from '../playerRoles'
import useTranslation from 'next-translate/useTranslation'

export default function SingleFantasyLeague({ data, indexJ, type, teamAID }) {
  const { t } = useTranslation()
  const credits = data?.aSelectedPlayerFan?.reduce((acc, credit) => (data?.oTPFan?._id !== credit._id) && acc + credit.nRating, 0)
  // let perfectXIData = []
  // const filterByTeam = (arr1, arr2) => {
  //   perfectXIData = arr1?.filter(el => {
  //     return arr2?.aSelectedPlayer.find(element => {
  //       return element?._id === el.oPlayer._id
  //     })
  //   })
  //   return perfectXIData
  // }
  // filterByTeam(playerData, data)
  // const removeTPData = perfectXIData?.filter((p) => p?.oPlayer?._id !== data?.oTP?._id)
  // const filterTeamData = data?.aSelectedPlayer?.map((d) => removeTPData?.filter((p) => p?.oPlayer?._id === d?._id && p?.nRating))
  // const reduceTeamData = filterTeamData?.map((data) => data?.reduce((acc, credit) => acc + credit?.nRating, 0))
  // const credits = reduceTeamData.reduce((acc, credit) => acc + credit, 0)
  // const length = data?.aSelectedPlayer?.length
  return (
    <>
      <style jsx amp-custom>{`
       .d-flex{display:flex;display:-webkit-flex}.flex-column{flex-direction:column;-webkit-flex-direction:column}.flex-wrap{flex-wrap:wrap;-webkit-flex-wrap:wrap}.align-items-center{align-items:center}.text-end{text-align:right}.text-center{text-align:center}.bg-dark{background:#23272e;color:#fff}.bg-light{background:#fff}.point{margin:4px 4px 0px;padding:0px 4px;border-radius:3px}.teamBlock{background:#e4e6eb;border-radius:32px}.info{padding:12px 24px 8px;-webkit-justify-content:space-between;justify-content:space-between}.info>p{width:30%}p{margin:0}.toss{background:var(--theme-bg);border-radius:8px}.toss .icon{display:block;width:28px}.team{margin-bottom:0px;flex-grow:1;padding:8px 16px 24px;background:#128807 url(/static/cricket-ground.svg) no-repeat center center/cover;border-radius:32px;text-align:center;justify-content:center}.label{margin-top:16px;letter-spacing:1px;opacity:.56;color:#fff}.playerList{margin-top:8px;display:flex;display:-webkit-flex;-webkit-justify-content:center;justify-content:center}@media(max-width: 767px){.team,.teamBlock{border-radius:16px}.info{padding-left:12px;padding-right:12px}.info>p{font-size:12px}.label{margin-top:10px}.team{margin-bottom:0px;flex-grow:1;padding:8px 8px 24px}}/*# sourceMappingURL=style.css.map */

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
            <div className="d-flex align-items-center">
              <div className="point text-dark bg-light ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3">{data?.oTeamA?.sTitle}</div>
              <p className="flex-shrink-0 ms-2 me-2 ms-sm-3 me-sm-3 mb-0">
                {data?.oTeamA?.nCount} : {data?.oTeamB?.nCount}
              </p>
              <div className="point text-light bg-dark ps-1 pe-1 ps-sm-2 pe-sm-2 rounded-3">{data?.oTeamB?.sTitle}</div>
            </div>
          </div>
          <p className="text-end mb-0">
            <span className="text-muted font-semi">{t('common:CreditsLeft')}</span> <br />
            {credits}/100
          </p>
        </div>
        <div className="team d-flex flex-column align-items-center">
          <label className="label xsmall-text text-light text-uppercase mt-3">{t('common:WicketKeeper')}</label>
          <div className="playerList d-flex justify-content-center w-100 flex-wrap text-center mt-2">
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return (player?.eRole === 'wk' || player?.eRole === 'wkbat') && <PlayerRoles key={index} data={player} capData={data} teamA={teamAID}/>
            })}
          </div>
          <label className="label xsmall-text text-light text-uppercase mt-3">{t('common:Batter')}</label>
          <div className="playerList d-flex justify-content-center w-100 flex-wrap text-center mt-2">
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'bat' && <PlayerRoles key={index} data={player} capData={data} teamA={teamAID}/>
            })}
          </div>
          <label className="label xsmall-text text-light text-uppercase mt-3">{t('common:AllRounder')}</label>
          <div className="playerList d-flex justify-content-center w-100 flex-wrap text-center mt-2">
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'all' && <PlayerRoles key={index} data={player} capData={data} teamA={teamAID}/>
            })}
          </div>
          <label className="label xsmall-text text-light text-uppercase mt-3">{t('common:Bowler')}</label>
          <div className="playerList d-flex justify-content-center w-100 flex-wrap text-center mt-2">
            {data?.aSelectedPlayerFan?.map((player, index) => {
              return player?.eRole === 'bowl' && <PlayerRoles key={index} data={player} capData={data} teamA={teamAID}/>
            })}
          </div>
        </div>
      </div>
    </>
  )
}

SingleFantasyLeague.propTypes = {
  data: PropTypes.object,
  indexJ: PropTypes.string,
  type: PropTypes.string,
  teamAID: PropTypes.string
}
