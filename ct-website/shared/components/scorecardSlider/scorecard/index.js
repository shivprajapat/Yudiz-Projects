import { S3_PREFIX } from '@shared/constants'
import { allRoutes } from '@shared/constants/allRoutes'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'
import Link from 'next/link'
import React, { useEffect } from 'react'
import styles from '../style.module.scss'
import FlagTeam from '@assets/images/placeholder/flag-placeholder.png'
import winnerIcon from '@assets/images/icon/cup-icon.svg'
import { convertDate, dateCheck, replaceStringToShort } from '@shared/utils'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function ScoreCard({ card, seriesId }) {
  const { t } = useTranslation()
  const router = useRouter()
  const rewriteURLs = {}

  useEffect(() => {
    card && !seriesId && card?.oSeries?.oSeo?.aCustomSeo?.forEach(e => {
      rewriteURLs[e?.eTabType] = `/${e?.sSlug}/`
    })
  }, [card])

  const handleClick = (value) => {
    if (value?.sStatusStr === 'live') router.push(allRoutes.matchDetailCommentary(value?.oSeo?.sSlug))
    else if (value?.sStatusStr === 'scheduled') router.push(allRoutes.matchDetail(value?.oSeo?.sSlug))
    else if (value?.sStatusStr === 'completed' || value?.sStatusStr === 'cancelled') router.push(allRoutes.matchDetailScorecard(`/${value?.oSeo?.sSlug}/`))
  }

  return (
    <div>
      <div className={`${styles.item} p-2`}>
        <div onClick={() => handleClick(card)}>
          <div className={`d-flex justify-content-between align-items-center ${styles.head}`}>
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
          <p className={`${styles.series} text-nowrap overflow-hidden`}>{card?.oSeries?.sTitle}</p>
          <div className={styles.head}>
            <div className={`${styles.team} d-flex justify-content-between`}>
              {card?.iBattingTeamId === card?.oTeamScoreA?.iTeamId ? (
                <p className={`${styles.teamName} d-flex align-items-center`}>
                  <div className={`${styles.teamFlag}`}>
                    <MyImage
                      src={
                        card?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${card?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : FlagTeam
                      }
                      alt={card?.oTeamScoreA?.oTeam?.sAbbr}
                      width="20"
                      height="20"
                      layout="responsive"
                      sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
                    />
                  </div>
                  {card?.sStatusStr !== 'scheduled' && card?.sStatusStr !== 'cancelled' ? (
                    <>
                      <span>{card?.oTeamScoreA?.oTeam?.sAbbr}</span>
                      {card?.sStatusStr === 'completed' && card?.oTeamScoreA?.iTeamId === card?.iWinnerId && (
                        <span className={`${styles.winner} ms-1`}>
                          <MyImage src={winnerIcon} alt="winner" width="24" height="24" layout="responsive" />
                        </span>
                      )}
                    </>
                  ) : (
                    <span>{card?.oTeamScoreA?.oTeam?.sTitle}</span>
                  )}
                </p>
              ) : (
                <p className={`${styles.teamName} d-flex align-items-center`}>
                  <div className={`${styles.teamFlag}`}>
                    <MyImage
                      src={
                        card?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${card?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : FlagTeam
                      }
                      alt={card?.oTeamScoreB?.oTeam?.sAbbr}
                      width="20"
                      height="20"
                      layout="responsive"
                      sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
                    />
                  </div>
                  {card?.sStatusStr !== 'scheduled' && card?.sStatusStr !== 'cancelled' ? (
                    <>
                      <span>{card?.oTeamScoreB?.oTeam?.sAbbr}</span>
                      {card?.sStatusStr === 'completed' && card?.oTeamScoreB?.iTeamId === card?.iWinnerId && (
                        <span className={`${styles.winner} ms-1`}>
                          <MyImage src={winnerIcon} alt="winner" width="24" height="24" layout="responsive" />
                        </span>
                      )}
                    </>
                  ) : (
                    <span>{card?.oTeamScoreB?.oTeam?.sTitle}</span>
                  )}
                </p>
              )}
              {card?.iBattingTeamId === card?.oTeamScoreA?.iTeamId ? (
                <p>
                  {card?.nLatestInningNumber === 1 &&
                    (card?.oTeamScoreA?.sScoresFull ? (
                      <b className={'theme-text'}>{card?.oTeamScoreA?.sScoresFull}</b>
                    ) : (
                      <b>
                        <Trans i18nKey="common:YetToBat" />
                      </b>
                    ))}
                  {card?.nLatestInningNumber > 1 &&
                    (card?.oTeamScoreA?.sScoresFull?.includes('*') ? (
                      <b className={'theme-text'}>{card?.oTeamScoreA?.sScoresFull}</b>
                    ) : (
                      <b>{card?.oTeamScoreA?.sScoresFull}</b>
                    ))}
                </p>
              ) : (
                <p>
                  {card?.nLatestInningNumber === 1 &&
                    (card?.oTeamScoreB?.sScoresFull ? (
                      <b className={'theme-text'}>{card?.oTeamScoreB?.sScoresFull}</b>
                    ) : (
                      <b>
                        <Trans i18nKey="common:YetToBat" />
                      </b>
                    ))}
                  {card?.nLatestInningNumber > 1 &&
                    (card?.oTeamScoreB?.sScoresFull?.includes('*') ? (
                      <b className={'theme-text'}>{card?.oTeamScoreB?.sScoresFull}</b>
                    ) : (
                      <b>{card?.oTeamScoreB?.sScoresFull}</b>
                    ))}
                </p>
              )}
            </div>
            <div className={`${styles.team} d-flex justify-content-between`}>
              {card?.iBattingTeamId !== card?.oTeamScoreA?.iTeamId ? (
                <p className={`${styles.teamName} d-flex align-items-center`}>
                  <div className={`${styles.teamFlag}`}>
                    <MyImage
                      src={
                        card?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${card?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : FlagTeam
                      }
                      alt={card?.oTeamScoreA?.oTeam?.sAbbr}
                      width="20"
                      height="20"
                      layout="responsive"
                      sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
                    />
                  </div>
                  {card?.sStatusStr !== 'scheduled' && card?.sStatusStr !== 'cancelled' ? (
                    <>
                      <span>{card?.oTeamScoreA?.oTeam?.sAbbr}</span>
                      {card?.sStatusStr === 'completed' && card?.oTeamScoreA?.iTeamId === card?.iWinnerId && (
                        <span className={`${styles.winner} ms-1`}>
                          <MyImage src={winnerIcon} alt="winner" width="24" height="24" layout="responsive" />
                        </span>
                      )}
                    </>
                  ) : (
                    <span>{card?.oTeamScoreA?.oTeam?.sTitle}</span>
                  )}
                </p>
              ) : (
                <p className={`${styles.teamName} d-flex align-items-center`}>
                  <div className={`${styles.teamFlag}`}>
                    <MyImage
                      src={
                        card?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${card?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : FlagTeam
                      }
                      alt={card?.oTeamScoreB?.oTeam?.sAbbr}
                      width="20"
                      height="20"
                      layout="responsive"
                      sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
                    />
                  </div>
                  {card?.sStatusStr !== 'scheduled' && card?.sStatusStr !== 'cancelled' ? (
                    <>
                      <span>{card?.oTeamScoreB?.oTeam?.sAbbr}</span>
                      {card?.sStatusStr === 'completed' && card?.oTeamScoreB?.iTeamId === card?.iWinnerId && (
                        <span className={`${styles.winner} ms-1`}>
                          <MyImage src={winnerIcon} alt="winner" width="24" height="24" layout="responsive" />
                        </span>
                      )}
                    </>
                  ) : (
                    <span>{card?.oTeamScoreB?.oTeam?.sTitle}</span>
                  )}
                </p>
              )}
              {card?.iBattingTeamId !== card?.oTeamScoreA?.iTeamId ? (
                <p>
                  {card?.nLatestInningNumber === 1 &&
                    (card?.oTeamScoreA?.sScoresFull ? (
                      <b className={'theme-text'}>{card?.oTeamScoreA?.sScoresFull}</b>
                    ) : (
                      <b>
                        <Trans i18nKey="common:YetToBat" />
                      </b>
                    ))}
                  {card?.nLatestInningNumber > 1 &&
                    (card?.oTeamScoreA?.sScoresFull?.includes('*') ? (
                      <b className={'theme-text'}>{card?.oTeamScoreA?.sScoresFull}</b>
                    ) : (
                      <b>{card?.oTeamScoreA?.sScoresFull}</b>
                    ))}
                </p>
              ) : (
                <p>
                  {card?.nLatestInningNumber === 1 &&
                    (card?.oTeamScoreB?.sScoresFull ? (
                      <b className={'theme-text'}>{card?.oTeamScoreB?.sScoresFull}</b>
                    ) : (
                      <b>
                        <Trans i18nKey="common:YetToBat" />
                      </b>
                    ))}
                  {card?.nLatestInningNumber > 1 &&
                    (card?.oTeamScoreB?.sScoresFull?.includes('*') ? (
                      <b className={'theme-text'}>{card?.oTeamScoreB?.sScoresFull}</b>
                    ) : (
                      <b>{card?.oTeamScoreB?.sScoresFull}</b>
                    ))}
                </p>
              )}
            </div>
          </div>
          <p
            className={`${styles.result} ${card?.sStatusStr === 'live' || card?.sStatusStr === 'cancelled' ? 'danger-text' : card?.sStatusStr !== 'completed' ? 'theme-text' : 'success-text'} text-nowrap overflow-hidden`}
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
          <div className={`${styles.btnList} d-flex text-center text-uppercase`}>
            <Link href={rewriteURLs?.fixtures ? `/${card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug}${rewriteURLs?.fixtures}` : allRoutes.seriesFixtures(`/${card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug}/`)} prefetch={false}>
              {t('common:Fixtures')}
            </Link>
            {
              card?.oSeries?.nTotalTeams > 2 &&
              <Link href={rewriteURLs?.standings ? `/${card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug}${rewriteURLs?.standings}` : allRoutes.seriesStandings(`/${card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug}/`)} prefetch={false}>
                {t('common:Standings')}
              </Link>
            }
            {card?.sStatusStr === 'scheduled' && (
              <Link href={rewriteURLs?.fantasyTips ? `/${card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug}${rewriteURLs?.fantasyTips}` : allRoutes.seriesFantasyTips(`/${card?.oSeriesSeo?.sSlug || card?.oSeries?.oSeo?.sSlug}/`)} prefetch={false}>
                {t('common:FantasyTips')}
              </Link>
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
  seriesId: PropTypes.string
}

export default ScoreCard
