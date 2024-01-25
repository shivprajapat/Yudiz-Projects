import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

// import styles from './style.module.scss'
import placeholderFlag from 'assets/images/placeholder/flag-placeholder.png'
import { convertDate, dateCheck } from '@utils'
import { allRoutes } from '@shared/constants/allRoutes'
import { S3_PREFIX } from '@shared/constants'

const FixturesItemsAMP = ({ fixture, id, isSeriesShow }) => {
  const handleCard = () => {
    if (fixture?.sStatusStr === 'live') return allRoutes.matchDetailCommentary(fixture?.oSeo?.sSlug)
    else if (fixture?.sStatusStr === 'scheduled') return allRoutes.matchDetail(fixture?.oSeo?.sSlug)
    else if (fixture?.sStatusStr === 'completed' || fixture?.sStatusStr === 'cancelled') return allRoutes.matchDetailScorecard(`/${fixture?.oSeo?.sSlug}/`)
  }
  return (
    <>
      <style jsx amp-custom>{`
     .fixturesItem .matchStatus span::before{content:"";position:absolute;display:block}*{box-sizing:border-box;-webkit-box-sizing:border-box}.d-flex{display:flex;display:-webkit-flex}.flex-wrap{-webkit-flex-wrap:wrap;flex-wrap:wrap}.align-items-center{-webkit-align-items:center;align-items:center}.justify-content-between{-webkit-justify-content:space-between;justify-content:space-between}.text-end{text-align:right}.flex-grow-1{flex-grow:1;-webkit-flex-grow:1}.text-center{text-align:center}.text-muted{color:#757a82}.text-capitalize{text-transform:capitalize}a{text-decoration:none;color:inherit}.me-1{margin-right:4px}.common-box{margin-bottom:24px;padding:16px;background:var(--light-mode-bg);border-radius:16px}.common-box>:last-child{margin-bottom:0}.fixturesList{cursor:pointer;position:relative;}.fixturesList:last-child{margin-bottom:0px}.fixturesTitle{margin-bottom:8px;padding:12px;background:var(--border-light);border-radius:12px}.fixturesItem{padding:16px;border-radius:12px;font-size:14px;line-height:20px}.fixturesItem p{margin:0}.fixturesItem .head{padding-bottom:8px;margin-bottom:7px;border-bottom:1px solid var(--light)}.fixturesItem .head>:nth-child(1),.fixturesItem .content>:nth-child(1){width:270px}.fixturesItem .head>:nth-child(2),.fixturesItem .content>:nth-child(2){margin:0 30px;padding:0 30px}.fixturesItem .head>:nth-child(3),.fixturesItem .content>:nth-child(3){width:110px}.fixturesItem .head>div:nth-child(2){margin-right:0;padding-right:0}.fixturesItem .infoList{color:var(--border-color)}.fixturesItem .infoList a,.fixturesItem .infoList p{margin-bottom:8px}.fixturesItem .infoList a:last-child,.fixturesItem .infoList p:last-child{margin-bottom:0px}.fixturesItem .teams{border-right:1px solid var(--light);border-left:1px solid var(--light);position:relative}.fixturesItem .team:first-child{margin:4px 0px 16px}.fixturesItem .team:last-child{margin-top:4px}.fixturesItem .team .icon{width:40px}.fixturesItem .team .name p{margin:0 10px}.fixturesItem .winner{margin-left:8px;height:18px}.fixturesItem .upcoming{position:absolute;padding:14px;max-width:98px;border:1px solid var(--light);border-radius:6px;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);right:30px}.fixturesItem .matchStatus span::before{margin-right:4px;position:relative;width:6px;height:6px;background:#045de9;vertical-align:middle;display:inline-block;border-radius:50%}.fixturesItem .matchStatus span.completed::before{background:#14b305}.fixturesItem .matchStatus span.live::before{background:#f14f4f}.text-success{color:#14b305}.text-danger{color:#f14f4f}.text-primary{color:var(--theme-color-light)}.liveStatus{width:0;overflow:hidden;margin-left:-2px}.badge{margin-right:8px;padding-left:12px;padding-right:12px;text-transform:capitalize;border-radius:4px}@media(min-width: 1200px)and (max-width: 1399px){.fixturesItem .head>:nth-child(1),.fixturesItem .content>:nth-child(1){width:230px}.fixturesItem .head>:nth-child(2),.fixturesItem .content>:nth-child(2){margin:0 24px;padding:0 24px}.fixturesItem .upcoming{padding:12px;right:24px}}@media(max-width: 1199px){.fixturesItem .head>:nth-child(1),.fixturesItem .content>:nth-child(1){width:180px}.fixturesItem .head>:nth-child(2),.fixturesItem .content>:nth-child(2){margin:0 16px;padding:0 16px}.fixturesItem .head>:nth-child(3),.fixturesItem .content>:nth-child(3){width:106px}.fixturesItem .team .icon{width:32px}.fixturesItem .upcoming{padding:10px;max-width:92px;right:16px}}@media(max-width: 767px){.flex-md-row{flex-direction:column}.d-md-block{display:none}.common-box{margin-bottom:20px;padding:12px;border-radius:12px}.fixturesTitle{margin:0px -12px 12px;border-radius:0}.fixturesItem{padding:12px;border-radius:8px;font-size:13px;line-height:18px}.fixturesItem .head{padding-bottom:0px;margin-bottom:0px;border-bottom:none}.fixturesItem .matchTime{padding-bottom:8px;margin-bottom:7px;border-bottom:1px solid #e4e6eb}.fixturesItem .head>:nth-child(1),.fixturesItem .head>:nth-child(2),.fixturesItem .head>:nth-child(3),.fixturesItem .content>:nth-child(1),.fixturesItem .content>:nth-child(2),.fixturesItem .content>:nth-child(3){width:100%}.fixturesItem .head>:nth-child(2),.fixturesItem .content>:nth-child(2){margin:0;padding:0;border:none}.fixturesItem .team:first-child{margin:12px 0px 8px}.fixturesItem .team .icon{width:32px}.fixturesItem .infoList p{margin-right:4px;margin-bottom:0px}.fixturesItem .upcoming{padding:10px;max-width:90px;right:0px}}/*# sourceMappingURL=style.css.map */
      .link{position: absolute;height: 100%;top: 0; left: 0; z-index:1;opacity: 0;}
      `}
      </style>
      <div className="fixturesList mb-3 position-relative" id={id}>
        {/* <p className={`${styles.fixturesTitle} font-bold`}>Group Stage</p> */}
        <a href={handleCard()} className='link w-100' >{fixture?.sStatusNote || fixture?.sStatusStr}</a>
        <div className="fixturesItem common-box mb-2">
          <div className="head d-flex flex-column flex-md-row xsmall-text" onClick={() => handleCard(fixture)}>
            <p className="matchTime font-semi">{convertDate(dateCheck(fixture?.dStartDate))}</p>
            <div className="info d-flex align-items-center justify-content-between flex-grow-1">
              <p className={`d-flex align-items-start matchStatus text-${fixture?.sStatusStr === 'completed' ? 'success' : fixture?.sStatusStr === 'live' || fixture?.sStatusStr === 'cancelled' ? 'danger' : 'primary'
                }`}
              >
                <span
                  className={`d-inline-flex align-items-center me-1 ${fixture?.sStatusStr === 'completed' ? 'completed' : fixture?.sStatusStr === 'live' || fixture?.sStatusStr === 'cancelled' ? 'live' : ''
                    }`}
                >
                  {fixture?.sStatusStr === 'completed' && <Trans i18nKey="common:Result" />}
                  {fixture?.sStatusStr === 'live' && <b className=".liveStatus opacity-0">a</b>}
                  {fixture?.sStatusStr === 'scheduled' && <Trans i18nKey="common:Upcoming" />}
                  {fixture?.sStatusStr === 'cancelled' && <Trans i18nKey="common:Cancelled" />}
                </span>{' '}
                {fixture?.sStatusNote && fixture?.sStatusStr !== 'live' ? ' | ' + fixture?.sStatusNote : (fixture?.sStatusNote || fixture?.sStatusStr)}
              </p>
              {/* <p>indFlag target - 131 Runs</p> */}
            </div>
            {/* <div></div> */}
          </div>
          <div className="content d-flex flex-column flex-md-row align-items-center">
            <div className="infoList d-flex flex-wrap flex-md-column xsmall-text">
              <p className="font-semi text-dark">
                <span className="text-capitalize">{fixture?.sFormatStr}</span>{fixture?.sSubtitle && ' - ' + fixture?.sSubtitle}
              </p>
              <p className="text-muted">{fixture?.oVenue?.sName}</p>
              {isSeriesShow && <p>
                <a href={`/${fixture?.oSeries?.oCategory?.oSeo?.sSlug || fixture?.oSeries?.oSeo?.sSlug}/`}>
                  {fixture?.oSeries?.sTitle}
                  {fixture?.oSeries?.sSeason && ', ' + fixture?.oSeries?.sSeason}
                </a>
              </p>}
            </div>
            <div className="teams mt-2 mt-md-0 font-semi flex-grow-1" onClick={() => handleCard(fixture)}>
              <div className="team d-flex align-items-center justify-content-between mt-1 mb-2 mb-md-3">
                <div className="name d-flex align-items-center">
                  <div className="icon">
                    <amp-img
                      src={fixture?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${fixture?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : placeholderFlag?.src}
                      alt={fixture?.oTeamScoreA?.oTeam?.sTitle}
                      layout="responsive"
                      width="20"
                      height="20"
                      // placeholder={teamPlaceholder?.src}
                    ></amp-img>
                  </div>
                  {(fixture?.sStatusStr !== 'scheduled' && fixture?.sStatusStr !== 'cancelled') ? <p className="d-flex align-items-center">{fixture?.oTeamScoreA?.oTeam?.sAbbr}
                    {(fixture?.sStatusStr === 'completed' && fixture?.oTeamScoreA?.oTeam?._id === fixture?.oWinner?._id) &&
                      <span className="winner ms-2 d-inline-block">
                        <amp-img
                          src="/static/cup-icon.svg"
                          alt="winner"
                          width="18"
                          height="18"
                        ></amp-img>
                      </span>}</p> : <p>{fixture?.oTeamScoreA?.oTeam?.sTitle}</p>}
                </div>
                <p className="score">
                  {fixture?.sStatusStr === 'live' && fixture?.nLatestInningNumber === 1 &&
                    (fixture?.oTeamScoreA?.sScoresFull ? (
                      <span className={'theme-text'}>{fixture?.oTeamScoreA?.sScoresFull}</span>
                    ) : (
                      <Trans i18nKey="common:YetToBat" />
                    ))}
                  {fixture?.sStatusStr === 'live' && fixture?.nLatestInningNumber > 1 &&
                    (fixture?.oTeamScoreA?.sScoresFull?.includes('*') ? (
                      <span className={'theme-text'}>{fixture?.oTeamScoreA?.sScoresFull}</span>
                    ) : (
                      fixture?.oTeamScoreA?.sScoresFull
                    ))}
                  {(fixture?.sStatusStr === 'completed' || fixture?.sStatusStr === 'cancelled') && fixture?.oTeamScoreA?.sScoresFull}
                </p>
              </div>
              <div className="team d-flex align-items-center justify-content-between mb-1">
                <div className="name d-flex align-items-center">
                  <div className="icon">
                    <amp-img
                      src={fixture?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${fixture?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : placeholderFlag?.src}
                      layout="responsive"
                      width="20"
                      height="20"
                      alt={fixture?.oTeamScoreB?.oTeam?.sTitle}
                      // placeholder={teamPlaceholder?.src}
                    ></amp-img>
                  </div>
                  {(fixture?.sStatusStr !== 'scheduled' && fixture?.sStatusStr !== 'cancelled') ? <p className="d-flex align-items-center">{fixture?.oTeamScoreB?.oTeam?.sAbbr}
                    {(fixture?.sStatusStr === 'completed' && fixture?.oTeamScoreB?.oTeam?._id === fixture?.oWinner?._id) &&
                      <span className="winner ms-2 d-inline-block">
                        <amp-img
                          src="/static/cup-icon.svg"
                          alt="winner"
                          width="18"
                          height="18"
                        ></amp-img>
                      </span>}</p> : <p>{fixture?.oTeamScoreB?.oTeam?.sTitle}</p>}
                </div>
                <p className="score">
                  {fixture?.sStatusStr === 'live' && fixture?.nLatestInningNumber === 1 &&
                    (fixture?.oTeamScoreB?.sScoresFull ? (
                      <span className={'theme-text'}>{fixture?.oTeamScoreB?.sScoresFull}</span>
                    ) : (
                      <Trans i18nKey="common:YetToBat" />
                    ))}
                  {fixture?.sStatusStr === 'live' && fixture?.nLatestInningNumber > 1 &&
                    (fixture?.oTeamScoreB?.sScoresFull?.includes('*') ? (
                      <span className={'theme-text'}>{fixture?.oTeamScoreB?.sScoresFull}</span>
                    ) : (
                      fixture?.oTeamScoreB?.sScoresFull
                    ))}
                  {(fixture?.sStatusStr === 'completed' || fixture?.sStatusStr === 'cancelled') && fixture?.oTeamScoreB?.sScoresFull}
                </p>
              </div>
              {fixture?.sStatusStr === 'scheduled' && <div className="upcoming border text-center d-none d-sm-block"><Trans i18nKey="common:MatchYetToStart" /></div>}
            </div>
            <div className="infoList d-none d-md-block font-semi xsmall-text">
              {fixture?.sStatusStr === 'scheduled' ? (
                <p>
                  <a href={allRoutes.matchDetail(fixture?.oSeo?.sSlug)}>
                    <Trans i18nKey="common:Overview" />
                  </a>
                </p>
              ) : (
                <p>
                  <a href={allRoutes.matchDetailScorecard(`/${fixture?.oSeo?.sSlug}/`)}>
                    <Trans i18nKey="common:Scorecard" />
                  </a>
                </p>
              )}
              {fixture?.sStatusStr === 'scheduled' ? (
                ''
              ) : (
                <p>
                  <a href={allRoutes.matchDetailCommentary(fixture?.oSeo?.sSlug)}>
                    <Trans i18nKey="common:FullCommentary" />
                  </a>
                </p>
              )}
              <p>
                <a href={allRoutes.matchDetailNews(`/${fixture?.oSeo?.sSlug}/`)}>
                  <Trans i18nKey="common:News" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

FixturesItemsAMP.propTypes = {
  fixture: PropTypes.object,
  id: PropTypes.string,
  isSeriesShow: PropTypes.bool
}

export default FixturesItemsAMP
