import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button, Col, Row } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import teamPlaceholder from '@assets/images/placeholder/team-placeholder.jpg'
import { calculateAge, convertDt24h, getImgURL, getPlayerRole } from '@shared/utils'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))
const CommonContent = dynamic(() => import('@shared/components/commonContent'))
const InnerHTML = dynamic(() => import('@shared/components/InnerHTML'))

const PlayerOverview = ({ playerDetails }) => {
  const { t } = useTranslation()
  const playerRole = getPlayerRole(playerDetails?.sPlayingRole)
  const [showMore, setShowMore] = useState(false)

  const handleDesc = () => {
    setShowMore(!showMore)
  }

  return (
    <div className={`${styles.playerOverview} common-box`}>
      <Row>
        <Col lg={7}>
          <Row>
            <Col xs={6}>
              <p className={`${styles.title} text-muted mb-0`}>{t('common:FullName')}</p>
              <p>{playerDetails?.sFullName || playerDetails?.sFirstName || '--'}</p>
            </Col>
            <Col xs={6}>
              <p className={`${styles.title} text-muted mb-0`}>{t('common:Nationality')}</p>
              <p>{playerDetails?.sCountryFull || playerDetails?.sNationality || '--'}</p>
            </Col>
          </Row>
        </Col>
        <Col lg={5}>
          <Row>
            <Col lg={5} xs={6}>
              <p className={`${styles.title} text-muted mb-0`}>{t('common:OtherName')}</p>
              <p>{playerDetails?.sNickName || playerDetails?.sFirstName || '--'}</p>
            </Col>
            <Col lg={7} xs={6}>
              <p className={`${styles.title} text-muted mb-0`}>{t('common:Role')}</p>
              <p>{playerRole || '--'}</p>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col lg={7}>
          <Row>
            <Col xs={6}>
              <p className={`${styles.title} text-muted mb-0`}>{t('common:BirthDate')}</p>
              <p>{playerDetails?.dBirthDate ? `${convertDt24h(playerDetails?.dBirthDate)} (${calculateAge(playerDetails?.dBirthDate)} years)` : '--'}</p>
            </Col>
            <Col xs={6}>
              <p className={`${styles.title} text-muted mb-0`}>{t('common:BirthPlace')}</p>
              <p>{playerDetails?.sBirthPlace || '--'}</p>
            </Col>
          </Row>
        </Col>
        <Col lg={5}>
          <Row>
            <Col lg={5} xs={6}>
              <p className={`${styles.title} text-muted mb-0`}>{t('common:BattingStyle')}</p>
              <p>{playerDetails?.sBattingStyle || '--'}</p>
            </Col>
            <Col lg={7} xs={6}>
              <p className={`${styles.title} text-muted mb-0`}>{t('common:BowlingStyle')}</p>
              <p>{playerDetails?.sBowlingStyle || '--'}</p>
            </Col>
          </Row>
        </Col>
      </Row>
      {playerDetails?.aTeam?.length > 0 && (
        <>
          <hr />
          <h5 className="text-uppercase">{t('common:Teams')}</h5>
          <Row>
            {playerDetails?.aTeam?.map(({ oTeam }, index) => {
              return (
                <Col lg={4} md={6} key={index}>
                  <div className="d-flex align-items-center mb-2">
                    <div className={`${styles.flag} me-2 me-md-3 rounded-circle overflow-hidden`}>
                      <MyImage src={getImgURL(oTeam?.oImg?.sUrl) || teamPlaceholder} width="32" height="32" alt={oTeam?.oImg?.sText || 'teamFlag'} layout="responsive" />
                    </div>
                    {oTeam?.eTagStatus === 'a' ? (
                      <CustomLink href={`/${oTeam?.oSeo?.sSlug}/`} prefetch={false}>
                        <a>{oTeam?.sTitle}</a>
                      </CustomLink>
                    ) : (
                      oTeam?.sTitle
                    )}
                  </div>
                </Col>
              )
            })}
          </Row>
        </>
      )}
      {playerDetails?.sContent && (
        <>
          <hr />
          <h5 className="text-uppercase">{t('common:About')}</h5>
          <div className={`${styles.desc} ${!showMore && styles.shortDesc} ${!showMore && 't-ellipsis line-clamp-3'} position-relative overflow-hidden`}>
            <CommonContent>
              <InnerHTML
                className={`${styles.content} text-break`} id="content"
                html={playerDetails?.sContent}
              />
            </CommonContent>
          </div>
          <div className="text-end mt-2">
            <Button className="theme-btn small-btn" onClick={handleDesc}>
              {t(showMore ? 'common:ReadLess' : 'common:ReadMore')}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
PlayerOverview.propTypes = {
  playerDetails: PropTypes.object
}
export default PlayerOverview
