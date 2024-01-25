import React from 'react'
import PropTypes from 'prop-types'
import { Ratio } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import fantasyStyles from './style.module.scss'
import { checkIsGlanceView, dateCheck } from '@shared/utils'
import telegram from '@assets/images/icon/telegram-share.png'
import { DownloadIcon, WarningIcon } from '@shared-components/ctIcons'
import { TELEGRAM_NEWS_LINK } from '@shared/constants'

const TableOfContent = dynamic(() => import('@shared-components/fantasyTips/tableOfContent'))
const InfoBlock = dynamic(() => import('@shared-components/fantasyTips/infoBlock'))
const MatchStats = dynamic(() => import('@shared/components/fantasyTips/matchStats'))
const WeatherReport = dynamic(() => import('@shared-components/fantasyTips/weatherReport'))
const WinPrediction = dynamic(() => import('@shared-components/fantasyTips/winPrediction'))
const MatchInfo = dynamic(() => import('@shared-components/fantasyTips/matchInfo'))
const PlayerPicks = dynamic(() => import('@shared-components/fantasyTips/playerPicks'))
const PlayingXI = dynamic(() => import('@shared-components/fantasyTips/playingXI'))
const AvoidPlayer = dynamic(() => import('@shared-components/fantasyTips/avoidPlayer'))
// const MatchProbability = dynamic(() => import('@shared-components/match/matchProbability'))
const FantasyTeam = dynamic(() => import('@shared-components/fantasyTips/fantasyTeam'))
const TipsNote = dynamic(() => import('@shared-components/fantasyTips/tipsNote'))
const PitchReport = dynamic(() => import('@shared-components/fantasyTips/pitchReport'))
// const HeadToHead = dynamic(() => import('@shared-components/fantasyTips/headToHead'))
const TeamForm = dynamic(() => import('@shared-components/fantasyTips/teamForm'))

// const LatestMatches = dynamic(() => import('@shared-components/fantasyTips/latestMatches'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const GlanceAd = dynamic(() => import('@shared/components/ads/glanceAd'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))
const FollowUs = dynamic(() => import('@shared/components/articleDetail/followUs'))
const OnMouseAndScroll = dynamic(() => import('@shared/components/lazyLoad/onMouseAndScroll'))

function FantasyArticleContent({ data }) {
  const router = useRouter()
  const isMobileWebView = router?.query?.isMobileWebView
  const isGlanceView = checkIsGlanceView(router?.query)
  const { t } = useTranslation()
  const fantasyArticleData = data
  const playerTeam = {
    [data?.oOverview?.oTeam1?.oTeam?._id]: data?.oOverview?.oTeam1?.oTeam,
    [data?.oOverview?.oTeam2?.oTeam?._id]: data?.oOverview?.oTeam2?.oTeam
  }

  return (
    <div className={fantasyStyles.fantasySection}>
      <TableOfContent fantasystyles={fantasyStyles} data={fantasyArticleData} />
      {fantasyArticleData?.sMatchPreview !== null && (
        <InfoBlock fantasystyles={fantasyStyles} title={t('common:Preview')} info={fantasyArticleData?.sMatchPreview} />
      )}
      {isGlanceView && (
        <GlanceAd
          id="div-gpt-ad-5"
          adId="Crictracker_mrec_mid"
          dimension={[[300, 250], [336, 280], 'fluid']}
          adUnitName="Crictracker_English_InArticleMedium_Mid2"
          placementName="InArticleMedium"
          className="d-flex justify-content-center"
          width={300}
          height={250}
          pageName="crictracker.com"
        />
      )}
      <Ads
        id="div-ad-gpt-138639789-1646637168-0"
        adIdDesktop="Crictracker2022_Desktop_AP_MID_728x90"
        adIdMobile="Crictracker2022_Mobile_AP_MID_300x250"
        dimensionDesktop={[728, 90]}
        dimensionMobile={[300, 250]}
        mobile
        className={'text-center mt-4 mb-4'}
      />
      {data?.sVideoUrl && (
        <section className="common-section pb-0">
          <Ratio aspectRatio="16x9" className={`${fantasyStyles.iframeVideo} m-auto br-lg overflow-hidden`}>
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
      <MatchInfo
        fantasystyles={fantasyStyles}
        broadcasting={fantasyArticleData?.oOverview?.sBroadCastingPlatform}
        matchData={fantasyArticleData?.oMatch}
        fantasyOverview={fantasyArticleData?.oOverview}
      />
      {fantasyArticleData?.WeatherReport?.data?.getWeatherCondition ? (
        <WeatherReport fantasystyles={fantasyStyles} fantasyArticleData={fantasyArticleData} />
      ) : null}
      {fantasyArticleData?.oAdvanceFeature?.bTeamForm && (
        <TeamForm fantasyArticleData={data} />
      )}
      {/* <HeadToHead /> */}
      {fantasyArticleData?.oAdvanceFeature?.bPlayerStats && (
        <OnMouseAndScroll>
          <MatchStats fantasyStyles={fantasyStyles} fantasyArticleData={data} playerTeam={playerTeam} />
        </OnMouseAndScroll>
      )}
      {/* <section className="common-section pb-0">
        <p className={`${fantasyStyles?.itemTitle} text-primary fw-bold text-uppercase big-text`}>
          <Trans i18nKey="common:WinProbability" />
        </p>
        <MatchProbability />
      </section> */}
      {fantasyArticleData?.oOverview !== null && (
        <>
          <PlayingXI fantasystyles={fantasyStyles} probableXI={fantasyArticleData?.oOverview} />
          <InfoBlock
            fantasystyles={fantasyStyles}
            title={t('common:InjuryAndAvailabilityNews')}
            info={fantasyArticleData?.oOverview?.sNews}
            id={'availabilityNews'}
          />
        </>
      )}
      {/* <LatestMatches fantasystyles={fantasyStyles} /> */}
      {fantasyArticleData?.overViewData?.oWinnerTeam?.sTitle && <WinPrediction overViewData={fantasyArticleData?.oOverview} />}

      <Ads
        id="div-ad-gpt-138639789-1646637213-0"
        adIdDesktop="Crictracker2022_Desktop_AP_MID2_728x90"
        adIdMobile="Crictracker2022_Mobile_AP_MID2_300x250"
        dimensionDesktop={[728, 90]}
        dimensionMobile={[300, 250]}
        mobile
        className={'text-center mt-2'}
      />
      {fantasyArticleData?.oAdvanceFeature?.bPitchReport && fantasyArticleData?.oOverview !== null && (
        <PitchReport fantasystyles={fantasyStyles} title={t('common:PitchReport')} overviewData={fantasyArticleData?.oOverview} />
      )}
      <PlayerPicks playerTeam={playerTeam} fantasystyles={fantasyStyles} playerPicksData={fantasyArticleData} />
      {fantasyArticleData?.aAvoidPlayerFan?.length > 0 && (
        <AvoidPlayer
          fantasystyles={fantasyStyles}
          avoidPlayers={fantasyArticleData?.aAvoidPlayerFan}
          platFormType={fantasyArticleData?.ePlatformType}
          playerTeam={playerTeam}
        // playerData={playerData}
        />
      )}
      {fantasyArticleData?.sMustPick && (
        <InfoBlock fantasystyles={fantasyStyles} title={t('common:MustPickForFantasy')} info={fantasyArticleData?.sMustPick} />
      )}
      <FantasyTeam
        playerTeam={playerTeam}
        fantasystyles={fantasyStyles}
        type={fantasyArticleData?.ePlatformType}
        teamData={fantasyArticleData?.aLeague}
        matchData={fantasyArticleData?.oMatch}
        updatedTime={dateCheck(data?.dModifiedDate || data?.dUpdated)}
      />
      {fantasyArticleData?.oOtherInfo?.sExpertAdvice && (
        <InfoBlock
          fantasystyles={fantasyStyles}
          title={t('common:ExpertAdvice')}
          info={fantasyArticleData?.oOtherInfo?.sExpertAdvice}
          id={'expertAdvice'}
        />
      )}
      <FollowUs className="mt-3 mt-lg-4 mb-1" />
      <TipsNote
        heading={t('common:Note')}
        linkImage={telegram}
        linkText={t('common:Telegram')}
        link={TELEGRAM_NEWS_LINK}
        descText={t('common:InformationOnTelegram')}
        isBgPrimary
      />
      <TipsNote heading={t('common:Disclaimer')} headingIcon={<WarningIcon />} descText={t('common:OwnDecisionNote')} />
      {!isMobileWebView && <TipsNote heading={t('common:DownloadOurApp')} headingIcon={<DownloadIcon />} isDownloadAppDisclaimer />}
      <div className={`${fantasyStyles.tagList} d-flex flex-lg-wrap pb-2 pb-lg-0 mt-2 mt-sm-3 mx-n1 overflow-auto`}>
        {fantasyArticleData?.aSeriesCategory?.map((cat) => (
          <CustomLink key={cat?.oSeo?.sSlug} href={'/' + cat?.oSeo?.sSlug} prefetch={false}>
            <a target="_blank" className="badge bg-primary m-1 font-semi py-1 px-3">
              {cat?.sName}
            </a>
          </CustomLink>
        ))}
        {fantasyArticleData?.aTeamTag?.map((team) => (
          <CustomLink key={team?.oSeo?.sSlug} href={'/' + team?.oSeo?.sSlug} prefetch={false}>
            <a target="_blank" className="badge bg-primary m-1 font-semi py-1 px-3">
              {team?.sName}
            </a>
          </CustomLink>
        ))}
        {fantasyArticleData?.aPlayerTag?.map((player) => (
          <CustomLink key={player?.oSeo?.sSlug} href={'/' + player?.oSeo?.sSlug} prefetch={false}>
            <a target="_blank" className="badge bg-primary m-1 font-semi py-1 px-3">
              {player?.sName}
            </a>
          </CustomLink>
        ))}
        {fantasyArticleData?.aTagsData?.map((tag) => (
          <CustomLink key={tag?.oSeo?.sSlug} href={'/' + tag?.oSeo?.sSlug} prefetch={false}>
            <a target="_blank" className="badge bg-primary m-1 font-semi py-1 px-3">
              {tag?.sName}
            </a>
          </CustomLink>
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
