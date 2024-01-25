import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Badge, Ratio } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import fantasyStyles from './style.module.scss'
import styles from '../style.module.scss'
import pitchIcon from '@assets/images/icon/pitch-icon.svg'
import teamsIcon from '@assets/images/icon/teams-color-icon.svg'
import captainIcon from '@assets/images/icon/captain-icon.svg'
import { dateCheck, sendMobileWebViewEvent } from '@shared/utils'
import { useRouter } from 'next/router'

const InfoBlock = dynamic(() => import('@shared-components/fantasyTips/infoBlock'))
const InfoList = dynamic(() => import('@shared-components/fantasyTips/infoList'))
const MatchInfo = dynamic(() => import('@shared-components/fantasyTips/matchInfo'))
const PlayerPicks = dynamic(() => import('@shared-components/fantasyTips/playerPicks'))
const PlayingXI = dynamic(() => import('@shared-components/fantasyTips/playingXI'))
const AvoidPlayer = dynamic(() => import('@shared-components/fantasyTips/avoidPlayer'))
// const MatchProbability = dynamic(() => import('@shared-components/match/matchProbability'))
const FantasyTeam = dynamic(() => import('@shared-components/fantasyTips/fantasyTeam'))
const TipsNote = dynamic(() => import('@shared-components/fantasyTips/tipsNote'))
// const LatestMatches = dynamic(() => import('@shared-components/fantasyTips/latestMatches'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const MyImage = dynamic(() => import('@shared/components/myImage'))

function FantasyArticleContent({ data }) {
  const router = useRouter()
  const isMobileWebView = router?.query?.isMobileWebView
  const { t } = useTranslation()
  const fantasyArticleData = data
  // for mobile web view event handle
  const handleEvent = (id, type) => {
    if (isMobileWebView) {
      sendMobileWebViewEvent(`tag:${type}:${id}`)
    }
  }
  return (
    <div className={fantasyStyles.fantasySection}>
      <section className={`${fantasyStyles.sectionNav} d-flex common-section pb-0`}>
      <Link href="#cVc" passHref>
        <a className="theme-btn secondary-btn">
          <span className={`${fantasyStyles.icon} d-inline-block align-middle me-1`}>
            <MyImage src={captainIcon} alt="captain" layout="responsive" />
          </span>
          <span className="d-inline-block align-middle">
            <Trans i18nKey="common:CnVC" />
          </span>
        </a>
      </Link>
      <Link href="#team" passHref>
        <a className="theme-btn secondary-btn">
          <span className={`${fantasyStyles.icon} d-inline-block align-middle me-1`}>
            <MyImage src={teamsIcon} alt="team" layout="responsive" />
          </span>
          <span className="d-inline-block align-middle">
            <Trans i18nKey="common:Teams" />
          </span>
        </a>
      </Link>
        {fantasyArticleData?.oOverview &&
          <Link href="#pitch" passHref>
            <a className="theme-btn secondary-btn">
              <span className={`${fantasyStyles.icon} d-inline-block align-middle me-1`}>
                <MyImage src={pitchIcon} alt="pitch" layout="responsive" />
              </span>
              <span className="d-inline-block align-middle">
                <Trans i18nKey="common:Pitch" />
              </span>
            </a>
          </Link>
        }
      </section>
      {fantasyArticleData?.sMatchPreview !== null && <InfoBlock fantasystyles={fantasyStyles} title={t('common:Preview')} info={fantasyArticleData?.sMatchPreview} />}
      <Ads
        id="div-ad-gpt-138639789-1646637168-0"
        adIdDesktop="Crictracker2022_Desktop_AP_MID_728x90"
        adIdMobile="Crictracker2022_Mobile_AP_MID_300x250"
        dimensionDesktop={[728, 90]}
        dimensionMobile={[300, 250]}
        mobile
        className={'text-center mt-4'}
      />
      {data?.sVideoUrl && (
        <section className="common-section pb-0">
          <Ratio aspectRatio="16x9" className={`${fantasyStyles.iframeVideo} m-auto`}>
            <iframe
              width="560"
              height="315"
              src={data?.sVideoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Ratio>
        </section>
      )}
      <MatchInfo fantasystyles={fantasyStyles} matchData={fantasyArticleData?.oMatch} />
      {/* <section className="common-section pb-0">
        <p className={`${fantasyStyles?.itemTitle} text-primary font-bold text-uppercase big-text`}>
          <Trans i18nKey="common:WinProbability" />
        </p>
        <MatchProbability />
      </section> */}
      {fantasyArticleData?.oOverview !== null && (
        <>
          <PlayingXI fantasystyles={fantasyStyles} probableXI={fantasyArticleData?.oOverview} />
          <InfoBlock fantasystyles={fantasyStyles} title={t('common:InjuryNews')} info={fantasyArticleData?.oOverview?.sNews} />
        </>
      )}
      {/* <LatestMatches fantasystyles={fantasyStyles} /> */}
      <InfoList fantasystyles={fantasyStyles} overViewData={fantasyArticleData?.oOverview} />
      <Ads
        id="div-ad-gpt-138639789-1646637213-0"
        adIdDesktop="Crictracker2022_Desktop_AP_MID2_728x90"
        adIdMobile="Crictracker2022_Mobile_AP_MID2_300x250"
        dimensionDesktop={[728, 90]}
        dimensionMobile={[300, 250]}
        mobile
        className={'text-center mt-2'}
      />
      {fantasyArticleData?.oOverview !== null && (
        <InfoBlock fantasystyles={fantasyStyles} title={t('common:PitchReport')} info={fantasyArticleData?.oOverview?.sPitchReport} />
      )}
      <PlayerPicks fantasystyles={fantasyStyles} playerPicksData={fantasyArticleData}/>
      {fantasyArticleData?.aAvoidPlayer?.length !== 0 && (
        <AvoidPlayer
          fantasystyles={fantasyStyles}
          avoidPlayers={fantasyArticleData?.aAvoidPlayerFan}
          platFormType={fantasyArticleData?.ePlatformType}
          // playerData={playerData}
        />
      )}
      {fantasyArticleData?.sMustPick && <InfoBlock fantasystyles={fantasyStyles} title={t('common:MustPickForFantasy')} info={fantasyArticleData?.sMustPick} />}
      <FantasyTeam fantasystyles={fantasyStyles} type={fantasyArticleData?.ePlatformType} teamData={fantasyArticleData?.aLeague} matchData={fantasyArticleData?.oMatch} updatedTime={dateCheck(data?.dUpdated)} />
      {fantasyArticleData?.oOtherInfo?.sExpertAdvice.length !== 0 && (
        <InfoBlock fantasystyles={fantasyStyles} title={t('common:ExpertAdvice')} info={fantasyArticleData?.oOtherInfo?.sExpertAdvice} />
      )}
      <TipsNote fantasystyles={fantasyStyles} mainstyles={styles} />
      <div className={`${fantasyStyles.tagList} d-flex flex-lg-wrap pb-2 pb-lg-0 mt-2 mt-sm-3`}>
        {fantasyArticleData?.aSeriesCategory?.map((cat) => (
          <div key={cat?.oSeo?.sSlug} onClick={() => handleEvent(cat?._id, cat?.eType)}>
            <Link href={'/' + cat?.oSeo?.sSlug} prefetch={false}>
              <a target="_blank" style={isMobileWebView && { pointerEvents: 'none' }}>
                <Badge bg="primary">{cat?.sName}</Badge>
              </a>
            </Link>
          </div>
        ))}
        {fantasyArticleData?.aTeamTag?.map((team) => (
          <div key={team?.oSeo?.sSlug} onClick={() => handleEvent(team?._id, team?.eType)}>
            <Link href={'/' + team?.oSeo?.sSlug} prefetch={false}>
              <a target="_blank" style={isMobileWebView && { pointerEvents: 'none' }}>
                <Badge bg="primary">{team?.sName}</Badge>
              </a>
            </Link>
          </div>
        ))}
        {fantasyArticleData?.aPlayerTag?.map((player) => (
          <div key={player?.oSeo?.sSlug} onClick={() => handleEvent(player?._id, player?.eType)}>
            <Link href={'/' + player?.oSeo?.sSlug} prefetch={false}>
              <a target="_blank" style={isMobileWebView && { pointerEvents: 'none' }}>
                <Badge bg="primary">{player?.sName}</Badge>
              </a>
            </Link>
          </div>
        ))}
        {fantasyArticleData?.aTagsData?.map((tag) => (
          <div key={tag?.oSeo?.sSlug} onClick={() => handleEvent(tag?._id, tag?.eType)}>
            <Link href={'/' + tag?.oSeo?.sSlug} prefetch={false}>
              <a target="_blank" style={isMobileWebView && { pointerEvents: 'none' }}>
                <Badge bg="primary">{tag?.sName}</Badge>
              </a>
            </Link>
          </div>
        ))}
      </div>
      {/* <Ads
        id="div-ad-gpt-138639789-1646637259-0"
        adIdDesktop="Crictracker2022_Desktop_AP_BTF_728x90"
        adIdMobile="Crictracker2022_Mobile_AP_BTF_300x250"
        dimensionDesktop={[728, 90]}
        dimensionMobile={[300, 250]}
      /> */}
    </div>
  )
}

FantasyArticleContent.propTypes = {
  data: PropTypes.object,
  playerData: PropTypes.array
}

export default FantasyArticleContent
