import { S3_PREFIX } from '@shared/constants'
import { allRoutes } from '@shared/constants/allRoutes'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'
import React from 'react'

import { convertDate, dateCheck, replaceStringToShort } from '@shared/utils'
import useTranslation from 'next-translate/useTranslation'
import CustomLink from '@shared/components/customLink'

function ScoreCard({ card, seriesId }) {
  const { t } = useTranslation()
  const rewriteURLs = {}
  !seriesId && card?.oSeriesSeo?.aCustomSeo?.forEach(e => {
    rewriteURLs[e?.eTabType] = `/${e?.sSlug}/`
  })

  const handleClick = (value) => {
    if (value?.sStatusStr === 'live') return allRoutes.matchDetailCommentary(value?.oSeo?.sSlug)
    else if (value?.sStatusStr === 'scheduled') return allRoutes.matchDetail(value?.oSeo?.sSlug)
    else if (value?.sStatusStr === 'completed' || value?.sStatusStr === 'cancelled') return allRoutes.matchDetailScorecard(`/${value?.oSeo?.sSlug}/`)
  }

  const getTeamName = (key) => {
    if (card?.sStatusStr !== 'scheduled' && card?.sStatusStr !== 'cancelled') {
      return (
        <>
          <span>{card[key]?.oTeam?.sAbbr}</span>
          {card?.sStatusStr === 'completed' && card[key]?.iTeamId === card?.iWinnerId && (
            <span className="winner ms-1">
              <amp-img src="/static/cup-icon.svg" alt="winner" width="24" height="24" layout="responsive" ></amp-img>
            </span>
          )}
        </>
      )
    } else {
      return <span>{card[key]?.oTeam?.sTitle}</span>
    }
  }

  const getTeam = (key) => {
    return (
      <div className="teamName d-flex align-items-center">
        <div className="teamFlag">
          <amp-img
            src={
              card[key]?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${card[key]?.oTeam?.oImg?.sUrl}` : '/static/flag-placeholder.png'
            }
            alt={card[key]?.oTeam?.sAbbr}
            width="20"
            height="20"
            layout="responsive"
          ></amp-img>
        </div>
        {getTeamName(key)}
      </div>
    )
  }

  const getTeamScore = (key) => {
    return (
      <p>
        {card?.nLatestInningNumber === 1 &&
          (card[key]?.sScoresFull ? (
            <b className={'theme-text'}>{card[key]?.sScoresFull}</b>
          ) : (
            <b>
              <Trans i18nKey="common:YetToBat" />
            </b>
          ))}
        {card?.nLatestInningNumber > 1 &&
          (card[key]?.sScoresFull?.includes('*') ? (
            <b className={'theme-text'}>{card[key]?.sScoresFull}</b>
          ) : (
            <b>{card[key]?.sScoresFull}</b>
          ))}
      </p>
    )
  }

  return (
    <>
      <div>
        <div className="item p-2">
          <div className='position-relative'>
            <a href={handleClick(card)} className="scoreCardLink">{card?.sTitle}</a>
            <div className="d-flex justify-content-between align-items-center head">
              <p>
                {card?.sStatusStr === 'completed' && (
                  <span className={'success-text'}>
                    {card?.sLiveGameStatusStr === 'none' ? (
                      <Trans i18nKey="common:Result" />
                    ) : card?.sLiveGameStatusStr ? (card?.sLiveGameStatusStr) : (
                      <Trans i18nKey="common:Result" />
                    )}{' '}
                  </span>
                )}
                {card?.sStatusStr === 'live' && (
                  <span className="danger-text text-capitalize">
                    •{' '}
                    {card?.sLiveGameStatusStr === 'none' ||
                      card?.sLiveGameStatusStr === 'playing ongoing' ||
                      card?.sLiveGameStatusStr === 'innings break' ? (
                      <Trans i18nKey="common:Live" />) : (card?.sLiveGameStatusStr)}{' '}
                  </span>
                )}
                {card?.sStatusStr === 'scheduled' && (
                  <span className={'theme-text'}>
                    <Trans i18nKey="common:Upcoming" />
                  </span>
                )}
                {card?.sStatusStr === 'cancelled' && (
                  <span className="danger-text text-capitalize">
                    <Trans i18nKey="common:Cancelled" />
                  </span>
                )}
                <span className="dark"> {card?.sSubtitle && '- ' + card?.sSubtitle}</span>{' '}
                {card?.oVenue?.sLocation && '- ' + card?.oVenue?.sLocation}
              </p>
              {/* <Form.Check
            className={`${styles.switch} switch-small theme-switch d-flex align-items-center`}
            type="switch"
            id="notify-switch2"
            label="Notify"
            /> */}
            </div>
            <p className="series text-nowrap overflow-hidden">{card?.oSeries?.sTitle}</p>
            <div className="head">
              <div className="team d-flex justify-content-between">
                {card?.iBattingTeamId ? (
                  card?.iBattingTeamId === card?.oTeamScoreA?.iTeamId ? (
                    getTeam('oTeamScoreA')
                  ) : (
                    getTeam('oTeamScoreB')
                  )
                ) : (
                  getTeam('oTeamScoreA')
                )}
                {card?.iBattingTeamId === card?.oTeamScoreA?.iTeamId ? (
                  getTeamScore('oTeamScoreA')
                ) : (
                  getTeamScore('oTeamScoreB')
                )}
              </div>
              <div className="team d-flex justify-content-between">
                {card?.iBattingTeamId ? (
                  card?.iBattingTeamId !== card?.oTeamScoreA?.iTeamId ? (
                    getTeam('oTeamScoreA')
                  ) : (
                    getTeam('oTeamScoreB')
                  )
                ) : (
                  getTeam('oTeamScoreB')
                )}

                {card?.iBattingTeamId !== card?.oTeamScoreA?.iTeamId ? (
                  getTeamScore('oTeamScoreA')
                ) : (
                  getTeamScore('oTeamScoreB')
                )}
              </div>
            </div>
            <p
              className={`result ${card?.sStatusStr === 'live' || card?.sStatusStr === 'cancelled' ? 'danger-text' : card?.sStatusStr !== 'completed' ? 'theme-text' : 'success-text'} text-nowrap overflow-hidden`}
            >
              {card?.sStatusStr === 'scheduled' && convertDate(dateCheck(card?.dStartDate))}
              {card?.sStatusStr === 'live' &&
                (replaceStringToShort(card?.oTeamScoreA?.oTeam, card?.oTeamScoreB?.oTeam, card?.sStatusNote) || (
                  <Trans i18nKey="common:MatchWillStartSoon" />
                ))}
              {card?.sStatusStr === 'completed' &&
                replaceStringToShort(card?.oTeamScoreA?.oTeam, card?.oTeamScoreB?.oTeam, card?.sStatusNote)}
              {card?.sStatusStr === 'cancelled' &&
                (replaceStringToShort(card?.oTeamScoreA?.oTeam, card?.oTeamScoreB?.oTeam, card?.sStatusNote) || (
                  <Trans i18nKey="common:MatchAbandoned" />
                ))}
            </p>
          </div>
          {!seriesId && (
            <div className="btnList d-flex text-center text-uppercase">
              <CustomLink href={rewriteURLs?.fixtures ? `${rewriteURLs?.fixtures}` : allRoutes.seriesFixtures(`/${card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug}/`)} prefetch={false}>
                <a>{t('common:Fixtures')}</a>
              </CustomLink>
              {
                card?.oSeries?.nTotalTeams > 2 &&
                <CustomLink href={rewriteURLs?.standings ? `${rewriteURLs?.standings}` : allRoutes.seriesStandings(`/${card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug}/`)} prefetch={false}>
                 <a>{t('common:Standings')}</a>
                </CustomLink>
              }
              {card?.sStatusStr === 'scheduled' && (
                <CustomLink href={card?.aFantasyTipsSlug?.length > 0 ? `${card?.aFantasyTipsSlug[0]}` : rewriteURLs?.fantasyTips ? `${rewriteURLs?.fantasyTips}` : allRoutes.seriesFantasyTips(`/${card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug}/`)} prefetch={false}>
                  <a>{t('common:FantasyTips')}</a>
                </CustomLink>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

ScoreCard.propTypes = {
  card: PropTypes.object,
  handleClick: PropTypes.func,
  seriesId: PropTypes.string
}

export default ScoreCard
