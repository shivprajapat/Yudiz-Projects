import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import { dateCheck } from '@utils'
import InfoBlock from '@shared-components/amp/fantasyTips/infoBlock'
import { TELEGRAM_NEWS_LINK } from '@shared/constants'
import { DownloadIcon, WarningIcon } from '@shared/components/ctIcons'
import FollowUsAMP from '@shared/components/amp/articleDetailAMP/followUsAMP'

import MatchInfo from '@shared-components/amp/fantasyTips/matchInfo'
import PlayerPicks from '@shared-components/amp/fantasyTips/playerPicks'
import PlayingXI from '@shared-components/amp/fantasyTips/playingXI'
import AvoidPlayer from '@shared-components/amp/fantasyTips/avoidPlayer'
import FantasyTeam from '@shared-components/amp/fantasyTips/fantasyTeam'
import TipsNote from '@shared-components/amp/fantasyTips/tipsNote'
import MatchStatsAMP from '@shared-components/amp/fantasyTips/matchStats'
import WinPrediction from '@shared-components/amp/fantasyTips/winPrediction'
import WeatherReport from '@shared-components/amp/fantasyTips/weatherReport'
import PitchReport from '@shared-components/amp/fantasyTips/pitchReport'
import TeamForm from '@shared-components/amp/fantasyTips/teamForm'

const ArticleFantasyContentAMP = ({ article, playerData, isPreviewMode, seoData, latestFantasyArticles, matchStats }) => {
  const { t } = useTranslation()
  const playerTeam = {
    [article?.oOverview?.oTeam1?.oTeam?._id]: article?.oOverview?.oTeam1?.oTeam,
    [article?.oOverview?.oTeam2?.oTeam?._id]: article?.oOverview?.oTeam2?.oTeam
  }
  return (
    <>
      <style jsx amp-custom global>{`
      .ampSelectorContent amp-selector{outline:none;margin-bottom:0px;border-radius:16px}.ampSelectorContent amp-selector .viewOptions{display:none;outline:none}.ampSelectorContent amp-selector .viewOptions[selected]{display:block}.commonNav{margin:0px -12px 12px;padding:6px 8px;background:var(--light-mode-bg);white-space:nowrap;overflow:auto}.commonNav.stickyNav{position:sticky;top:0px;z-index:5;-webkit-box-shadow:0 2px 4px 0 rgba(var(--bs-dark-rgb), 0.2);box-shadow:0 2px 4px 0 rgba(var(--bs-dark-rgb), 0.2)}.commonNav amp-selector{display:flex}.commonNav amp-selector [option][selected]{outline:0;background:var(--light-color);color:var(--font-color-light);border-radius:2em}.commonNav amp-selector .item{-webkit-flex-grow:0;flex-grow:0;text-transform:uppercase;display:block;padding:5px 12px;font-size:12px;line-height:18px;color:var(--font-color-light);font-weight:700;background:transparent;border-radius:2em}.commonNav amp-selector .item:hover{color:var(--theme-color-light)}.commonNav amp-selector .item:first-child{margin-left:0}.commonNav amp-selector .item:last-child{margin-right:0}.commonNav.themeLightNav{background:var(--theme-light)}.commonNav.themeLightNav a.active{background:var(--light-mode-bg)}.commonNav.equal-width-nav amp-selector,.commonNav.equal-width-nav .nav-link{flex-grow:1}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      {/* <Head>
        <script async custom-element='amp-fx-flying-carpet' src='https://cdn.ampproject.org/v0/amp-fx-flying-carpet-0.1.js'></script>
      </Head> */}
      <div className="fantasySection">
        {(article?.sAmpPreview || article?.sMatchPreview) && (
          <InfoBlock title={t('common:Preview')} info={article?.sAmpPreview || article?.sMatchPreview} />
        )}
        <div>
          <amp-fx-flying-carpet height="300px">
            <amp-ad width="300" height="600" layout="fixed" type="doubleclick" data-slot="138639789/Crictracker2022_AMP_FC_300x600" data-enable-refresh="30"></amp-ad>
          </amp-fx-flying-carpet>
          {/* <amp-ad
            width="300"
            height="250"
            type="doubleclick"
            data-slot="138639789/Crictracker2022_AMP_MID_300x250"
            data-multi-size-validation="false"
            data-enable-refresh="30"
          /> */}
        </div>
        {article?.sVideoUrl && (
          <section className="common-section pb-0">
            <div className="iframeVideo m-auto">
              <amp-iframe
                width="560"
                height="315"
                src={article?.sVideoUrl}
                title="YouTube video player"
                frameBorder="0"
                layout="responsive"
                sandbox="allow-scripts allow-same-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></amp-iframe>
            </div>
          </section>
        )}
        <MatchInfo fantasyOverview={article?.oOverview} broadcasting={article?.oOverview?.sBroadCastingPlatform} matchData={article?.oMatch} />
        {article?.WeatherReport?.data?.getWeatherCondition ? <WeatherReport fantasyArticleData={article} /> : null}
        <TeamForm fantasyArticleData={article} />
        <MatchStatsAMP matchStats={matchStats} playerTeam={playerTeam} />
        {article?.oOverview !== null && (
          <>
            <PlayingXI probableXI={article?.oOverview} />
            {/* <PixFuture /> */}
            <InfoBlock title={t('common:InjuryAndAvailabilityNews')} info={article?.oOverview?.sNews} />
          </>
        )}
        {/* //  : (
        //   <PixFuture />
        // )} */}
        {/* <LatestMatches /> */}
        {/* <InfoList overViewData={article?.oOverview} /> */}
        {article?.overViewData?.oWinnerTeam?.sTitle && (
          <WinPrediction overViewData={article?.oOverview} />
        )}

        <div className="mt-3 d-flex justify-content-center">
          <amp-ad
            width="300"
            height="250"
            type="doubleclick"
            data-slot="138639789/Crictracker2022_AMP_MID2_300x250"
            data-multi-size-validation="false"
            data-enable-refresh="30"
          />
        </div>
        {article?.oOverview !== null && (
          <PitchReport overviewData={article?.oOverview} />
        )}
        <PlayerPicks playersData={article} playerTeam={playerTeam} />
        {article?.aAvoidPlayerFan?.length > 0 && (
          <AvoidPlayer
            players={article?.aAvoidPlayerFan}
            platFormType={article?.ePlatformType}
            playerTeam={playerTeam}
          />
        )}
        <div className="mt-4">
          {article?.sMustPick && <InfoBlock title={t('common:MustPickForFantasy')} info={article?.sMustPick} />}
        </div>
        <div className="mt-4">
          <FantasyTeam playerTeam={playerTeam} teamData={article?.aLeague} matchData={article?.oMatch} playerData={playerData} updatedTime={dateCheck(article?.dModifiedDate || article?.dUpdated)} type={article?.ePlatformType} />
        </div>
        {article?.oOtherInfo?.sExpertAdvice && (
          <InfoBlock title={t('common:ExpertAdvice')} info={article?.oOtherInfo?.sExpertAdvice} />
        )}
        <FollowUsAMP className="mb-3" />
        <div>
          <TipsNote heading={t('common:Note')} linkImage='/static/telegram-share.png' linkText={t('common:Telegram')} link={TELEGRAM_NEWS_LINK} descText={t('common:InformationOnTelegram')} isBgPrimary />
          <TipsNote heading={t('common:Disclaimer')} headingIcon={<WarningIcon />} descText={t('common:OwnDecisionNote')} />
          <TipsNote heading={t('common:DownloadOurApp')} headingIcon={<DownloadIcon />} isDownloadAppDisclaimer className="pt-0 pb-0" isArticleClass />
        </div>
      </div>
      <div className="tagList d-flex flex-wrap">
        {article?.aSeriesCategory?.map((cat) => (
          <a key={cat?._id} href={'/' + cat?.oSeo?.sSlug}>
            <span className="badge bg-primary">
              {cat?.sName}
            </span>
          </a>
        ))}
        {article?.aTeamTag?.map((team) => (
          <a key={team?._id} href={'/' + team?.oSeo?.sSlug}>
            <span className="badge bg-primary">
              {team?.sName}
            </span>
          </a>
        ))}
        {article?.aPlayerTag?.map((player) => (
          <a key={player?._id} href={'/' + player?.oSeo?.sSlug}>
            <span className="badge bg-primary">
              {player?.sName}
            </span>
          </a>
        ))}
        {article?.aTagsData?.map((tag) => (
          <a key={tag?._id} href={'/' + tag?.oSeo?.sSlug}>
            <span className="badge bg-primary">
              {tag?.sName}
            </span>
          </a>
        ))}
      </div>
      <div className="d-flex justify-content-center mt-3">
        <amp-ad
          width="300"
          height="250"
          type="doubleclick"
          data-slot="138639789/Crictracker2022_AMP_BTF_300x250"
          data-multi-size-validation="false"
          data-enable-refresh="30"
        />
      </div>
    </>
  )
}

ArticleFantasyContentAMP.propTypes = {
  article: PropTypes.object,
  playerData: PropTypes.array,
  isPreviewMode: PropTypes.bool,
  seoData: PropTypes.object,
  latestFantasyArticles: PropTypes.object,
  matchStats: PropTypes.object
}

export default ArticleFantasyContentAMP
