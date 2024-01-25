import React from 'react'
import PropTypes from 'prop-types'
import { Accordion } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import MyImage from '@shared/components/myImage'
import TeamImage from '@assets/images/placeholder/team-placeholder.jpg'
import { StandingMatchWinLoss } from '@shared/utils'
import { S3_PREFIX } from '@shared/constants'

const CustomLink = dynamic(() => import('@shared/components/customLink'))

const TeamForm = ({ fantasyArticleData }) => {
  const MatchDataTeamA = fantasyArticleData?.oMatch.oTeamA
  const MatchDataTeamB = fantasyArticleData?.oMatch.oTeamB
  const teamAData = StandingMatchWinLoss({ aMatch: fantasyArticleData.oTeamAForm, _id: MatchDataTeamA._id })?.reverse()
  const teamBData = StandingMatchWinLoss({ aMatch: fantasyArticleData.oTeamBForm, _id: MatchDataTeamB._id })?.reverse()

  const { t } = useTranslation()
  if (fantasyArticleData?.oTeamAForm?.length || fantasyArticleData?.oTeamBForm?.length) {
    return (
      <div className="my-3 my-md-4" id="teamForm">
        <div className={`${styles.title} mb-01 py-2 px-3`}>
          <p className="fw-bold py-1 text-uppercase mb-0 theme-text">{t('common:TeamFormTitle')}</p>
        </div>
        <Accordion defaultActiveKey="0" className={`${styles.teamForm} overflow-hidden`}>
          {fantasyArticleData?.oTeamAForm?.length > 0 && (
            <Accordion.Item eventKey="0" className={`${styles.item} br-sm mb-2 overflow-hidden`}>
              <Accordion.Header className={`${styles.head}`}>
                <div className={`${styles.teamHead} d-flex align-items-center`}>
                  <div className={`${styles.teamImg} me-2 rounded-circle overflow-hidden flex-shrink-0`}>
                    <MyImage src={MatchDataTeamA?.oImg?.sUrl ? `${S3_PREFIX}${MatchDataTeamA?.oImg?.sUrl}` : TeamImage} layout="responsive" width="20" height="20" alt={MatchDataTeamA?.sAbbr} />
                  </div>
                  <p className="mb-0 me-2 me-md-0 text-nowrap overflow-hidden t-ellipsis">{MatchDataTeamA?.sTitle}</p>
                </div>
                <div className="d-flex align-items-center ms-auto me-0 small-text">
                  {teamAData?.map((data, i) => {
                    return (<div key={`teamForm-${i}`} className={`${styles.status} ${styles.win} ${!data?.isWinner ? styles.loss : ''} ${(data?.noResult || data.isDraw) ? styles.noResult : ''} ${data?.status === '-' && ''} text-center rounded-circle flex-shrink-0`}>{data?.status}</div>)
                  })}
                </div>
              </Accordion.Header>
              <Accordion.Body className={`${styles.content} mt-0 text-center d-flex overflow-auto`}>
                {teamAData?.map((data, i) => {
                  const matchData = fantasyArticleData.oTeamAForm[i]
                  return data.status !== '-' ? (
                    <div key={`teamFormB-${i}`} className={`${styles.match} d-flex flex-column align-items-center common-box mb-0 p-2 mx-1 flex-grow-1 position-relative`}>
                      <CustomLink href={`/${matchData?.oSeo?.sSlug}/`}>
                        <a className='position-absolute top-0 start-0 h-100 w-100 d-block opacity-0'>{matchData?.sTitle}</a>
                      </CustomLink>
                      <div
                        className={`${styles.status} ${styles.win} ${!data?.isWinner ? styles.loss : ''} ${(data?.noResult || data.isDraw) ? styles.noResult : ''} ${data?.status === '-' && ''} text-center rounded-circle flex-shrink-0`}
                      >
                        {data?.status}
                      </div>
                      <div className="d-flex align-items-center mb-md-1">
                        <p className="mb-0 font-semi">{matchData?.oTeamScoreA?.oTeam?.sAbbr}</p>
                        <p className="mb-0 xsmall-text mx-2">vs</p>
                        <p className="mb-0 font-semi">{matchData?.oTeamScoreB?.oTeam?.sAbbr}</p>
                      </div>
                      <p className="text-muted">{matchData?.oSeries?.sAbbr}</p>
                    </div>
                  ) : null
                })}
              </Accordion.Body>
            </Accordion.Item>
          )}
          {fantasyArticleData?.oTeamBForm?.length > 0 && (
            <Accordion.Item eventKey="1" className={`${styles.item} br-sm overflow-hidden`}>
              <Accordion.Header className={`${styles.head}`}>
                <div className={`${styles.teamHead} d-flex align-items-center`}>
                  <div className={`${styles.teamImg} me-2 rounded-circle overflow-hidden flex-shrink-0`}>
                    <MyImage src={MatchDataTeamB?.oImg?.sUrl ? `${S3_PREFIX}${MatchDataTeamB?.oImg?.sUrl}` : TeamImage} layout="responsive" width="20" height="20" alt={MatchDataTeamB.sAbbr} />
                  </div>
                  <p className="mb-0 me-2 me-md-0 text-nowrap text-md-wrap overflow-hidden t-ellipsis">{MatchDataTeamB?.sTitle}</p>
                </div>
                <div className="d-flex align-items-center ms-auto me-0 small-text">
                  {teamBData?.map((data, i) => {
                    return (<div key={`teamForm-${i}`} className={`${styles.status} ${styles.win} ${!data?.isWinner ? styles.loss : ''} ${(data?.noResult || data.isDraw) ? styles.noResult : ''} ${data?.status === '-' && ''} text-center rounded-circle flex-shrink-0`}>{data?.status}</div>)
                  })}
                </div>
              </Accordion.Header>
              <Accordion.Body className={`${styles.content} mt-0 text-center d-flex overflow-auto`}>
                {teamBData.map((data, i) => {
                  const matchData = fantasyArticleData?.oTeamBForm[i]
                  return data.status !== '-' ? (
                    <div key={`teamFormB-${i}`} className={`${styles.match} d-flex flex-column align-items-center common-box mb-0 p-2 mx-1 flex-grow-1 position-relative`}>
                      <CustomLink href={`/${matchData?.oSeo?.sSlug}/`}>
                        <a className='position-absolute top-0 start-0 h-100 w-100 d-block opacity-0'>{matchData?.sTitle}</a>
                      </CustomLink>
                      <div className={`${styles.status} ${styles.win} ${!data?.isWinner ? styles.loss : ''} ${(data?.noResult || data.isDraw) ? styles.noResult : ''} ${data?.status === '-' && ''} text-center rounded-circle flex-shrink-0`}>{data?.status}</div>
                      <div className="d-flex align-items-center mb-md-1">
                        <p className="mb-0 font-semi">{matchData?.oTeamScoreA?.oTeam?.sAbbr}</p>
                        <p className="mb-0 xsmall-text mx-2">vs</p>
                        <p className="mb-0 font-semi">{matchData?.oTeamScoreB?.oTeam?.sAbbr}</p>
                      </div>
                      <p className="text-muted">{matchData?.oSeries?.sAbbr}</p>
                    </div>
                  ) : null
                })}
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      </div>
    )
  } else return null
}

TeamForm.propTypes = {
  fantasyArticleData: PropTypes.object
}

export default TeamForm
