import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import dream11 from '@assets/images/icon/dream11-icon.png'
import eleWickets from '@assets/images/icon/11wickets-icon.png'
// import gamezy from '@assets/images/icon/gamezy-icon.png'
// import my11circle from '@assets/images/icon/my-11circle-icon.png'
import arrow from '@assets/images/icon/right-arrow.svg'
import useTranslation from 'next-translate/useTranslation'
import { gameType } from '@utils'
import CustomLink from '@shared/components/customLink'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const CricPrediction = ({ data }) => {
  const { t } = useTranslation()
  return (
    <>
      <section className={`${styles.cricPrediction} mb-3 mb-md-4 br-lg`}>
        <p className="big-text fw-bold text-center text-uppercase">{t('common:CricPrediction')}</p>
        <Row className="justify-content-center">
          {data?.map((game) => {
            return (
              <React.Fragment key={game._id}>
                <Col sm={6}>
                  <CustomLink href={`/${game?.oSeo?.sSlug}` || ''} prefetch={false}>
                    <a
                      className={`${styles.predictionBtn} ${
                        game.ePlatformType === 'de' ? styles.dream11 : styles.eleWickets
                      } font-semi text-uppercase d-flex align-items-center justify-content-between br-sm`}
                    >
                      <div className={`${styles.icon}`}>
                        <MyImage
                          src={game.ePlatformType === 'de' ? dream11 : eleWickets}
                          alt={gameType(game.ePlatformType)}
                          layout="responsive"
                        />
                      </div>
                      {gameType(game.ePlatformType)}
                      <div className={`${styles.arrow}`}>
                        <MyImage src={arrow} alt={gameType(game.ePlatformType)} layout="responsive" />
                      </div>
                    </a>
                  </CustomLink>
                </Col>
              </React.Fragment>
            )
          })}
        </Row>
      </section>
    </>
  )
}

CricPrediction.propTypes = {
  data: PropTypes.array
}

export default CricPrediction
