import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import { dateCheck } from '@utils'
import InfoBlock from '@shared-components/amp/fantasyTips/infoBlock'
const InfoList = dynamic(() => import('@shared-components/amp/fantasyTips/infoList'))
const MatchInfo = dynamic(() => import('@shared-components/amp/fantasyTips/matchInfo'))
const PlayerPicks = dynamic(() => import('@shared-components/amp/fantasyTips/playerPicks'))
const PlayingXI = dynamic(() => import('@shared-components/amp/fantasyTips/playingXI'))
const AvoidPlayer = dynamic(() => import('@shared-components/amp/fantasyTips/avoidPlayer'))
const FantasyTeam = dynamic(() => import('@shared-components/amp/fantasyTips/fantasyTeam'))
const TipsNote = dynamic(() => import('@shared-components/amp/fantasyTips/tipsNote'))

const ArticleFantasyContentAMP = ({ article, playerData, isPreviewMode, seoData, latestFantasyArticles }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="fantasySection mb-3">
        <InfoBlock title={t('common:Preview')} info={article?.sMatchPreview} />
        <div className="d-flex justify-content-center">
          <amp-ad width="300" height="250"
            type="doubleclick"
            data-slot="/138639789/Crictracker2022_AMP_MID_300x250">
          </amp-ad>
        </div>
        {article?.sVideoUrl && (
          <section className="common-section pb-0">
            <div className="iframeVideo m-auto">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/vWZb9eyznKU"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </section>
        )}
        <MatchInfo matchData={article?.oMatch} />
        {article?.oOverview !== null && (
          <>
            <PlayingXI probableXI={article?.oOverview} />
            <InfoBlock title={t('common:InjuryNews')} info={article?.oOverview?.sNews} />
          </>
        )}
        {/* <LatestMatches /> */}
        <InfoList overViewData={article?.oOverview} />
        <div className="mt-3 d-flex justify-content-center">
          <amp-ad width="300" height="250"
            type="doubleclick"
            data-slot="/138639789/Crictracker2022_AMP_MID2_300x250">
          </amp-ad>
        </div>
        {article?.oOverview !== null && (
          <InfoBlock title={t('common:PitchReport')} info={article?.oOverview?.sPitchReport} />
        )}
        <PlayerPicks playersData={article} />
        {article?.aAvoidPlayer?.length !== 0 && (
          <AvoidPlayer
            players={article?.aAvoidPlayerFan}
            platFormType={article?.ePlatformType}
          />
        )}
        <div className="mt-4">
          {article?.sMustPick && <InfoBlock title={t('common:MustPickForFantasy')} info={article?.sMustPick} />}
        </div>
        <div className="mt-4">
          <FantasyTeam teamData={article?.aLeague} matchData={article?.oMatch} playerData={playerData} updatedTime={dateCheck(article?.dUpdated)} type={article?.ePlatformType} />
        </div>
        {article?.oOtherInfo?.sExpertAdvice.length !== 0 && (
          <InfoBlock title={t('common:ExpertAdvice')} info={article?.oOtherInfo?.sExpertAdvice} />
        )}
        <div className="d-flex justify-content-center">
          <amp-ad width="300" height="250"
            type="doubleclick"
            data-slot="/138639789/Crictracker2022_AMP_BTF_300x250">
          </amp-ad>
        </div>
        <TipsNote />
      </div>
      <div className="tagList d-flex flex-wrap my-3">
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
    </>
  )
}

ArticleFantasyContentAMP.propTypes = {
  article: PropTypes.object,
  playerData: PropTypes.array,
  isPreviewMode: PropTypes.bool,
  seoData: PropTypes.object,
  latestFantasyArticles: PropTypes.object
}

export default ArticleFantasyContentAMP
