import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { Container, Row, Col } from 'react-bootstrap'

import style from './style.module.scss'
import bannerImage from '@assets/images/person-with-chair-table.svg'
import bannerBackgroundIamge from '@assets/images/crictracker-banner-semi-transparent.png'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function AuthorListBanner() {
  const { t } = useTranslation()
  return (
    <div className={`${style['banner-wrapper']} bg-primary d-flex flex-column text-white mb-4 overflow-hidden`}>
      <Container className="position-relative py-4 py-md-5 flex-fill">
        <div className={`${style['bg-image-wrapper']} w-100`}>
          <MyImage alt="CricTracker" src={bannerBackgroundIamge} layout="fill" objectFit="cover" quality={100} />
        </div>
        <Row>
          <Col lg="8" xs="7">
            <Row>
              <Col lg="10" md="11" xs="12">
                <h1>{t('common:Authors')}</h1>
                <p className="big-text mb-0">{t('common:AuthorBannerText')}</p>
              </Col>
            </Row>
          </Col>
          <Col lg="4" xs="5">
            <div className={`${style['side-image-wrapper']} w-100`}>
              <div className={style['side-image']}>
                <MyImage src={bannerImage} alt={t('common:AuthorBannerAlt')} layout="responsive" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AuthorListBanner
