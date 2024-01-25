import React, { useRef } from 'react'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import styles from '../style.module.scss'
import FlagTeam from '@assets/images/placeholder/flag-placeholder.png'
import winnerIcon from '@assets/images/icon/cup-icon.svg'
import CustomLink from '@shared/components/customLink'
import { S3_PREFIX } from '@shared/constants'
import { allRoutes } from '@shared/constants/allRoutes'
import { convertDate, dateCheck, replaceStringToShort } from '@shared/utils'
import { WPL_TEAM_NAME_WITH_ID } from '@shared/libs/daily-hunt'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function ScoreCard({ card, seriesId, className, isDailyHuntMode }) {
  const { t } = useTranslation()
  const scoreCardFooterSlug = useRef(card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug)
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
    const name = WPL_TEAM_NAME_WITH_ID[card[key]?.iTeamId] || card[key]?.oTeam?.sAbbr
    if (card?.sStatusStr !== 'scheduled' && card?.sStatusStr !== 'cancelled') {
      return (
        <>
          <span className='ms-1'>{isDailyHuntMode ? name : card[key]?.oTeam?.sAbbr}</span>
          {card?.sStatusStr === 'completed' && card[key]?.iTeamId === card?.iWinnerId && (
            <span className={`${styles.winner} ms-1`}>
              <MyImage src={winnerIcon} alt="winner" width="24" height="24" layout="responsive" />
            </span>
          )}
        </>
      )
    } else {
      return <span className='ms-1'>{isDailyHuntMode ? name : card[key]?.oTeam?.sTitle}</span>
    }
  }

  const getTeam = (key) => {
    return (
      <div className={`${styles.teamName} d-flex align-items-center text-dark`}>
        <div className={`${styles.teamFlag} rounded-circle overflow-hidden`}>
          <MyImage
            src={
              card[key]?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${card[key]?.oTeam?.oImg?.sUrl}` : FlagTeam
            }
            isLoadOnInteraction
            alt={card[key]?.oTeam?.sAbbr}
            width="20"
            height="20"
            layout="responsive"
            sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
          />
        </div>
        {getTeamName(key)}
      </div>
    )
  }

  const getTeamScore = (key) => {
    return (
      <p className="mb-0">
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
    <div className={className || ''}>
      <div className={`${styles.item} light-bg p-2 mx-1 font-semi br-sm`}>
        <div className='position-relative'>
          <CustomLink href={handleClick(card)} passHref prefetch={false}>
            <a className={`${styles.scoreCardLink} position-absolute top-0 start-0 opacity-0 w-100 h-100`}>{card?.sTitle}</a>
          </CustomLink>
          <div className={`d-flex justify-content-between align-items-center ${styles.head}`}>
            <p className="text-nowrap overflow-hidden t-ellipsis mb-0">
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
              <span className={styles.dark}> {card?.sSubtitle && '- ' + card?.sSubtitle}</span>{' '}
              {card?.oVenue?.sLocation && '- ' + card?.oVenue?.sLocation}
            </p>
            {/* <Form.Check
            className={`${styles.switch} switch-small theme-switch d-flex align-items-center`}
            type="switch"
            id="notify-switch2"
            label="Notify"
            /> */}
          </div>
          <p className={`${styles.series} font-medium text-nowrap overflow-hidden t-ellipsis my-2`}>{card?.oSeries?.sTitle}</p>
          <div className={styles.head}>
            <div className={`${styles.team} d-flex justify-content-between position-relative xsmall-text`}>
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
            <div className={`${styles.team} d-flex justify-content-between position-relative xsmall-text`}>
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
            className={`${styles.result} ${card?.sStatusStr === 'live' || card?.sStatusStr === 'cancelled' ? 'danger-text' : card?.sStatusStr !== 'completed' ? 'theme-text' : 'success-text'} overflow-hidden text-nowrap t-ellipsis font-medium my-2`}
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
          <div className={`${styles.btnList} d-flex text-center text-uppercase mx-n1`}>
            <CustomLink href={rewriteURLs?.fixtures ? `${rewriteURLs?.fixtures}` : allRoutes.seriesFixtures(`/${scoreCardFooterSlug.current}/`)} prefetch={false}>
              <a className={`${styles.listBtn} mx-1 p-1 flex-grow-1 rounded-pill text-dark border-1`}>{t('common:Fixtures')}</a>
            </CustomLink>
            {
              card?.oSeries?.nTotalTeams > 2 &&
              <CustomLink href={rewriteURLs?.standings ? `${rewriteURLs?.standings}` : allRoutes.seriesStandings(`/${scoreCardFooterSlug.current}/`)} prefetch={false}>
                <a className={`${styles.listBtn} mx-1 p-1 flex-grow-1 rounded-pill text-dark border-1`}>{t('common:Standings')}</a>
              </CustomLink>
            }
            {(card?.sStatusStr === 'scheduled' || card?.sLiveGameStatusStr === 'toss') && (
              <CustomLink href={card?.aFantasyTipsSlug?.length > 0 ? `${card?.aFantasyTipsSlug[0]}` : rewriteURLs?.fantasyTips ? `${rewriteURLs?.fantasyTips}` : allRoutes.seriesFantasyTips(`/${scoreCardFooterSlug.current}/`)} prefetch={false}>
                <a className={`${styles.listBtn} mx-1 p-1 flex-grow-1 rounded-pill text-dark border-1`}>{t('common:FantasyTips')}</a>
              </CustomLink>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

ScoreCard.propTypes = {
  card: PropTypes.object,
  handleClick: PropTypes.func,
  seriesId: PropTypes.string,
  isDailyHuntMode: PropTypes.bool,
  className: PropTypes.string
}

export default ScoreCard
