import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import placeholderFlag from 'assets/images/placeholder/flag-placeholder.png'
import teamPlaceholder from 'assets/images/placeholder/team-placeholder.webp'
import { convertDate, dateCheck } from '@utils'
import { allRoutes } from '@shared/constants/allRoutes'
import { S3_PREFIX } from '@shared/constants'
import { CupIcon } from '@shared/components/ctIcons'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const FixturesItems = ({ fixture, id, isSeriesShow }) => {
  const router = useRouter()
  const handleCard = (value) => {
    if (value?.sStatusStr === 'live') router.push(allRoutes.matchDetailCommentary(value?.oSeo?.sSlug))
    else if (value?.sStatusStr === 'scheduled') router.push(allRoutes.matchDetail(value?.oSeo?.sSlug))
    else if (value?.sStatusStr === 'completed' || value?.sStatusStr === 'cancelled') router.push(allRoutes.matchDetailScorecard(`/${value?.oSeo?.sSlug}/`))
  }
  return (
    <div className={`${styles.fixturesList} mb-3`} id={id}>
      {/* <p className={`${styles.fixturesTitle} font-bold`}>Group Stage</p> */}
      <div className={`${styles.fixturesItem} common-box mb-2`}>
        <div className={`${styles.head} d-flex flex-column flex-md-row xsmall-text`} onClick={() => handleCard(fixture)}>
          <p className={`${styles.matchTime} font-semi`}>{convertDate(dateCheck(fixture?.dStartDate))}</p>
          <div className={`${styles.info} d-flex align-items-center justify-content-between flex-grow-1`}>
            <p className={`d-flex align-items-start ${styles.matchStatus} text-${fixture?.sStatusStr === 'completed' ? 'success' : fixture?.sStatusStr === 'live' || fixture?.sStatusStr === 'cancelled' ? 'danger' : 'primary'
                }`}
            >
              <span
                className={`d-inline-flex align-items-center me-1 ${fixture?.sStatusStr === 'completed' ? styles.completed : fixture?.sStatusStr === 'live' || fixture?.sStatusStr === 'cancelled' ? styles.live : ''
                  }`}
              >
                {fixture?.sStatusStr === 'completed' && <Trans i18nKey="common:Result" />}
                {fixture?.sStatusStr === 'live' && <b className={`${styles.liveStatus} opacity-0`}>a</b>}
                {fixture?.sStatusStr === 'scheduled' && <Trans i18nKey="common:Upcoming" />}
                {fixture?.sStatusStr === 'cancelled' && <Trans i18nKey="common:Cancelled" />}
              </span>{' '}
              {fixture?.sStatusNote && fixture?.sStatusStr !== 'live' ? ' | ' + fixture?.sStatusNote : (fixture?.sStatusNote || fixture?.sStatusStr) }
            </p>
            {/* <p>indFlag target - 131 Runs</p> */}
          </div>
          {/* <div></div> */}
        </div>
        <div className={`${styles.content} d-flex flex-column flex-md-row align-items-center`}>
          <div className={`${styles.infoList} d-flex flex-wrap flex-md-column xsmall-text`}>
            <p className="font-semi text-dark">
              <span className="text-capitalize">{fixture?.sFormatStr}</span>{fixture?.sSubtitle && ' - ' + fixture?.sSubtitle}
            </p>
            <p className="text-muted">{fixture?.oVenue?.sName}</p>
            {isSeriesShow && <p>
              <Link href={`/${fixture?.oSeries?.oCategory?.oSeo?.sSlug || fixture?.oSeries?.oSeo?.sSlug}`} prefetch={false}>
                <a>
                {fixture?.oSeries?.sTitle}
                {fixture?.oSeries?.sSeason && ', ' + fixture?.oSeries?.sSeason}
                </a>
              </Link>
            </p>}
          </div>
          <div className={`${styles.teams} mt-2 mt-md-0 font-semi flex-grow-1`} onClick={() => handleCard(fixture)}>
            <div className={`${styles.team} d-flex align-items-center justify-content-between mt-1 mb-2 mb-md-3`}>
              <div className={`${styles.name} d-flex align-items-center`}>
                <div className={`${styles.icon}`}>
                  <MyImage
                    src={fixture?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${fixture?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : placeholderFlag}
                    alt={fixture?.oTeamScoreA?.oTeam?.sTitle}
                    layout="responsive"
                    width="20"
                    height="20"
                    placeholder={teamPlaceholder?.src}
                    sizes="(max-width: 767px) 40px, (max-width: 991px) 40px, (max-width: 1190px) 200px, 40px"
                  />
                </div>
                {(fixture?.sStatusStr !== 'scheduled' && fixture?.sStatusStr !== 'cancelled') ? <p>{fixture?.oTeamScoreA?.oTeam?.sAbbr}
                {(fixture?.sStatusStr === 'completed' && fixture?.oTeamScoreA?.oTeam?._id === fixture?.oWinner?._id) && <span className={`${styles.winner} ms-2 d-inline-block`}><CupIcon/></span>}</p> : <p>{fixture?.oTeamScoreA?.oTeam?.sTitle}</p>}
              </div>
              <p className={`${styles.score}`}>
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
            <div className={`${styles.team} d-flex align-items-center justify-content-between mb-1`}>
              <div className={`${styles.name} d-flex align-items-center`}>
                <div className={`${styles.icon}`}>
                  <MyImage
                    src={fixture?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${fixture?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : placeholderFlag}
                    layout="responsive"
                    width="20"
                    height="20"
                    alt={fixture?.oTeamScoreB?.oTeam?.sTitle}
                    placeholder={teamPlaceholder?.src}
                    sizes="(max-width: 767px) 40px, (max-width: 991px) 40px, (max-width: 1190px) 200px, 40px"
                  />
                </div>
                {(fixture?.sStatusStr !== 'scheduled' && fixture?.sStatusStr !== 'cancelled') ? <p>{fixture?.oTeamScoreB?.oTeam?.sAbbr}
                {(fixture?.sStatusStr === 'completed' && fixture?.oTeamScoreB?.oTeam?._id === fixture?.oWinner?._id) && <span className={`${styles.winner} ms-2 d-inline-block`}><CupIcon/></span>}</p> : <p>{fixture?.oTeamScoreB?.oTeam?.sTitle}</p>}
              </div>
              <p className={`${styles.score}`}>
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
            {fixture?.sStatusStr === 'scheduled' && <div className={`${styles.upcoming} border text-center d-none d-sm-block`}><Trans i18nKey="common:MatchYetToStart" /></div>}
          </div>
          <div className={`${styles.infoList} d-none d-md-block font-semi xsmall-text`}>
            {fixture?.sStatusStr === 'scheduled' ? (
              <p>
                <Link href={allRoutes.matchDetail(fixture?.oSeo?.sSlug)} prefetch={false}>
                  <a>
                    <Trans i18nKey="common:Overview" />
                  </a>
                </Link>
              </p>
            ) : (
              <p>
                <Link href={allRoutes.matchDetailScorecard(`/${fixture?.oSeo?.sSlug}/`)} prefetch={false}>
                  <a>
                    <Trans i18nKey="common:Scorecard" />
                  </a>
                </Link>
              </p>
            )}
            {fixture?.sStatusStr === 'scheduled' ? (
              ''
            ) : (
              <p>
                <Link href={allRoutes.matchDetailCommentary(fixture?.oSeo?.sSlug)} prefetch={false}>
                  <a>
                    <Trans i18nKey="common:FullCommentary" />
                  </a>
                </Link>
              </p>
            )}
            <p>
              <Link href={allRoutes.matchDetailNews(`/${fixture?.oSeo?.sSlug}/`)} prefetch={false}>
                <a>
                  <Trans i18nKey="common:News" />
                </a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

FixturesItems.propTypes = {
  fixture: PropTypes.object,
  id: PropTypes.string,
  isSeriesShow: PropTypes.bool
}

export default FixturesItems
