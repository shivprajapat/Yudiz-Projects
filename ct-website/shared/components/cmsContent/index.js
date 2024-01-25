import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import Layout from '../layout'
import { useRouter } from 'next/router'
import Ads from '../ads'
import useWindowSize from '@shared/hooks/windowSize'
import { staticPages } from '@shared/constants/staticPages'
const BreadcrumbNav = dynamic(() => import('@shared/components/breadcrumbNav'))

const CMSContent = ({ data, seoData }) => {
  const router = useRouter()
  const [isPreview, setIsPreview] = useState(false)
  const cmsData = data?.getUserCMSPage
  const [width] = useWindowSize()
  const isStaticPage = staticPages.includes(router.asPath)

  useEffect(() => {
    if (router?.query?.isMobileWebView) {
      setIsPreview(true)
    }
  }, [router?.asPath])
  return (
    <Layout data={{ ...cmsData, oSeo: seoData }}>
      <section className="common-section">
        <Container>
          <div className="d-none d-md-block mt-2" style={{ minHeight: '90px' }}>
            {width > 767 && !isStaticPage && ( // Desktop Top
              <Ads
                id="div-ad-gpt-138639789-1646637094-0"
                adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                dimensionDesktop={[970, 90]}
                className="mb-4 text-center"
                style={{ minHeight: '90px' }}
              />
            )}
          </div>
          <Row>
            <Col md={9}>
              <div className={`${styles.CMSContent} common-box mb-0`}>
                {!isPreview && <BreadcrumbNav />}
                <h1>{cmsData?.sTitle}</h1>
                <div className={styles.content} dangerouslySetInnerHTML={{ __html: cmsData?.sContent }} />
              </div>
            </Col>
            <Col md={3}></Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}

CMSContent.propTypes = {
  data: PropTypes.object,
  seoData: PropTypes.object
}

export default CMSContent
