import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import TeamImage from '@assets/images/placeholder/team-placeholder.jpg'
import arrow from '@assets/images/icon/down-arrow.svg'
import { StandingMatchWinLoss } from '@shared/utils'
import { S3_PREFIX } from '@shared/constants'

const TeamForm = ({ fantasyArticleData }) => {
  const MatchDataTeamA = fantasyArticleData?.oMatch.oTeamA
  const MatchDataTeamB = fantasyArticleData?.oMatch.oTeamB
  const teamAData = StandingMatchWinLoss({ aMatch: fantasyArticleData.oTeamAForm, _id: MatchDataTeamA._id })?.reverse()
  const teamBData = StandingMatchWinLoss({ aMatch: fantasyArticleData.oTeamBForm, _id: MatchDataTeamB._id })?.reverse()

  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>{`
      .teamImg{width:32px}.title{margin-bottom:2px;padding:8px 12px;background:var(--theme-bg);border-radius:8px 8px 0 0;font-weight:500}.item{background:var(--theme-bg);border-radius:8px;font-weight:500}.item .head{padding:6px 4px 6px 8px;background:transparent;font-weight:600}.item .head::after{margin-left:0}.item .head .status{margin-right:2px}.item .head p{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;max-width:calc(100vw - 240px)}.item .mb-0{margin-bottom:0}.item:first-child{border-radius:0 0 8px 8px}.arrow{width:24px;border:none;background:transparent}.arrow.active{transform:rotate(270deg)}.status{width:24px;height:24px;line-height:24px;background:#979797}.status.win{background:#14b305;color:#fff}.status.loss{background:#f14f4f;color:#fff}.content{padding:8px 4px 12px;overflow:auto}.match{margin-bottom:0;width:120px}/*# sourceMappingURL=style.css.map */
      .status.noResult{ background: var(--font-dark); color:#fff; }

    `}</style>
      <div className="my-3 my-md-4">
        <div className="title">
          <p className="font-bold p-1 t-uppercase mb-0 theme-text">{t('common:TeamFormTitle')}</p>
        </div>
        <div className="teamForm overflow-hidden">
          <div className="item mb-2 overflow-hidden">
            <div className="head d-flex align-items-center">
              <div className="teamHead d-flex align-items-center">
                <div className="teamImg me-2 rounded-circle overflow-hidden flex-shrink-0">
                  <amp-img src={MatchDataTeamA?.oImg?.sUrl ? `${S3_PREFIX}${MatchDataTeamA?.oImg?.sUrl}` : TeamImage.src} layout="responsive" width="32" height="32" alt={MatchDataTeamA?.sAbbr} ></amp-img>
                </div>
                <p className="mb-0 font-semi">{MatchDataTeamA?.sTitle}</p>
              </div>
              <div className="d-flex align-items-center ms-auto me-0 small-text">
                {teamAData?.map((data, i) => {
                  return (<div key={`teamForm-${i}`} className={`status win ${!data?.isWinner ? 'loss' : ''} ${(data?.noResult || data.isDraw) ? 'noResult' : ''} ${data?.status === '-' && ''} t-center rounded-circle flex-shrink-0`}>{data?.status}</div>)
                })}
              </div>
              <div
                role='button'
                tabIndex="1"
                id='teamform-1'
                on={'tap:teamform-1-C.hide,teamform-1.hide,teamform-1-active.show'}
                className='arrow'
              >
                <amp-img src={arrow.src} alt="dropdown" width="60" height="60" layout="responsive" />
              </div>
              <div
                role='button'
                hidden
                tabIndex='teamform-1-active'
                id='teamform-1-active'
                on='tap:teamform-1-C.show,teamform-1.show,teamform-1-active.hide'
                className='arrow active'
              >
                <amp-img src={arrow.src} alt="dropdown" width="60" height="60" layout="responsive" />
              </div>
            </div>
            <div id='teamform-1-C' className="content mt-0 t-center d-flex overflow-auto">
              {teamAData?.map((data, i) => {
                const matchData = fantasyArticleData?.oTeamAForm[i]
                return data.status !== '-' ? (
                  <div key={`teamFormB-${i}`} className="match flex-shrink-0 d-flex flex-column align-items-center common-box mb-0 p-2 mx-1 flex-grow-1">
                    <div className={`status win ${!data?.isWinner ? 'loss' : ''} ${(data?.noResult || data.isDraw) ? 'noResult' : ''} ${data?.status === '-' && ''} t-center rounded-circle flex-shrink-0`}>{data?.status}</div>
                    <div className="d-flex align-items-center mb-md-1">
                      <p className="mb-0 font-semi">{matchData?.oTeamScoreA?.oTeam?.sAbbr}</p>
                      <p className="mb-0 xsmall-text mx-2">vs</p>
                      <p className="mb-0 font-semi">{matchData?.oTeamScoreB?.oTeam?.sAbbr}</p>
                    </div>
                    <p className="text-muted">{matchData?.oSeries?.sAbbr}</p>
                  </div>
                ) : null
              })}
            </div>
          </div>
          <div className="item overflow-hidden">
            <div className="head d-flex align-items-center">
              <div className="teamHead d-flex align-items-center">
                <div className="teamImg me-2 rounded-circle overflow-hidden flex-shrink-0">
                  <amp-img src={MatchDataTeamB?.oImg?.sUrl ? `${S3_PREFIX}${MatchDataTeamB?.oImg?.sUrl}` : TeamImage.src} layout="responsive" width="32" height="32" alt={MatchDataTeamB.sAbbr}></amp-img>
                </div>
                <p className="mb-0 font-semi">{MatchDataTeamB?.sTitle}</p>
              </div>
              <div className="d-flex align-items-center ms-auto me-0 small-text">
                {teamBData?.map((data, i) => {
                  return (<div key={`teamForm-${i}`} className={`status win ${!data?.isWinner ? 'loss' : ''} ${(data?.noResult || data.isDraw) ? 'noResult' : ''} ${data?.status === '-' && ''} t-center rounded-circle flex-shrink-0`}>{data?.status}</div>)
                })}
              </div>
              <div
                role='button'
                tabIndex="1"
                id='teamform-2'
                on='tap:teamform-2-C.show,teamform-2.hide,teamform-2-active.show'
                className='arrow active'
              >
                <amp-img src={arrow.src} alt="dropdown" width="60" height="60" layout="responsive" />
              </div>
              <div
                role='button'
                hidden
                tabIndex={'teamform-2-active'}
                id={'teamform-2-active'}
                on={'tap:teamform-2-C.hide,teamform-2.show,teamform-2-active.hide'}
                className='arrow'
              >
                <amp-img src={arrow.src} alt="dropdown" width="60" height="60" layout="responsive" />
              </div>
            </div>
            <div id='teamform-2-C' hidden className="content mt-0 t-center d-flex overflow-auto">
              {teamBData?.map((data, i) => {
                const matchData = fantasyArticleData?.oTeamBForm[i]
                return data.status !== '-' ? (
                  <div key={`teamFormB-${i}`} className="match flex-shrink-0 d-flex flex-column align-items-center common-box mb-0 p-2 mx-1 flex-grow-1">
                    <div className={`status win ${!data?.isWinner ? 'loss' : ''} ${(data?.noResult || data.isDraw) ? 'noResult' : ''} ${data?.status === '-' && ''} t-center rounded-circle flex-shrink-0`}>{data?.status}</div>
                    <div className="d-flex align-items-center mb-md-1">
                      <p className="mb-0 font-semi">{matchData?.oTeamScoreA?.oTeam?.sAbbr}</p>
                      <p className="mb-0 xsmall-text mx-2">vs</p>
                      <p className="mb-0 font-semi">{matchData?.oTeamScoreB?.oTeam?.sAbbr}</p>
                    </div>
                    <p className="text-muted">{matchData?.oSeries?.sAbbr}</p>
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

TeamForm.propTypes = {
  fantasyArticleData: PropTypes.object
}

export default TeamForm
