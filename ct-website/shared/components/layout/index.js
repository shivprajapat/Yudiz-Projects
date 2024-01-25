import React from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import MetaTags from '../metaTags'
import { SITE_NAME } from '@shared/constants'
import AllSchema from '../all-schema'
// import { GlobalEventsContext } from '../global-events'

const Layout = ({ children, isPreviewMode, data = {}, matchDetail, scoreCard }) => {
  const router = useRouter()
  const documentTitle = (data?.oSeo?.sTitle || data?.sTitle) || SITE_NAME
  // const { stateGlobalEvents } = useContext(GlobalEventsContext)

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
        {/* {!matchDetail && <title>{(data?.oSeo?.sTitle || data?.sTitle) ? (data?.oSeo?.sTitle || data?.sTitle) + ' | ' + SITE_NAME : SITE_NAME}</title>}
        {matchDetail && matchDetail?.sStatusStr === 'scheduled' && <title>{(data?.oSeo?.sTitle || data?.sTitle) ? (data?.oSeo?.sTitle || data?.sTitle) + ' | ' + SITE_NAME : SITE_NAME}</title>}
        {matchDetail && matchDetail?.sStatusStr === 'live' && <title>{`${matchDetail?.oTeamScoreA?.oTeam?.sAbbr}${matchDetail?.oTeamScoreA?.sScoresFull && ' - ' + matchDetail?.oTeamScoreA?.sScoresFull}${matchDetail?.oTeamScoreB?.sScoresFull && ' vs ' + matchDetail?.oTeamScoreB?.oTeam?.sAbbr + ' - ' + matchDetail?.oTeamScoreB?.sScoresFull} ${matchDetail?.sSubtitle} - ${t('common:LiveScore')} | ${SITE_NAME}`}</title>}
        {matchDetail && matchDetail?.sStatusStr === 'completed' && <title>{matchDetail?.sStatusNote + ' | ' + SITE_NAME}</title>} */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Display:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <MetaTags title={documentTitle} data={data} router={router} />
      </Head>
      {children}
      <AllSchema data={data} matchDetail={matchDetail} scoreCard={scoreCard} />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  isPreviewMode: PropTypes.bool,
  data: PropTypes.object,
  matchDetail: PropTypes.object,
  scoreCard: PropTypes.array
}

export default Layout
