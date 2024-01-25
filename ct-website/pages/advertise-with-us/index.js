import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { Col, Container, Row } from 'react-bootstrap'

import styles from './style.module.scss'
import Layout from '@shared-components/layout'
import visitors from '@assets/images/static-page/data-visualization.png'
import targetAudience from '@assets/images/static-page/target-audience.png'
import target from '@assets/images/static-page/target.png'
import p1 from '@assets/images/static-page/partners/p1.png'
import p2 from '@assets/images/static-page/partners/p2.png'
import p3 from '@assets/images/static-page/partners/p3.png'
import p4 from '@assets/images/static-page/partners/p4.png'
import p5 from '@assets/images/static-page/partners/p5.png'
import p6 from '@assets/images/static-page/partners/p6.png'
import p7 from '@assets/images/static-page/partners/p7.png'
import p8 from '@assets/images/static-page/partners/p8.png'
import p9 from '@assets/images/static-page/partners/p9.png'
import p10 from '@assets/images/static-page/partners/p10.png'
import p11 from '@assets/images/static-page/partners/p11.png'
import p12 from '@assets/images/static-page/partners/p12.png'
import p13 from '@assets/images/static-page/partners/p13.png'
import p14 from '@assets/images/static-page/partners/p14.png'
import p15 from '@assets/images/static-page/partners/p15.png'
import p16 from '@assets/images/static-page/partners/p16.png'
import p17 from '@assets/images/static-page/partners/p17.png'
import p18 from '@assets/images/static-page/partners/p18.png'
import p19 from '@assets/images/static-page/partners/p19.png'
import p20 from '@assets/images/static-page/partners/p20.png'
import p21 from '@assets/images/static-page/partners/p21.png'
import p22 from '@assets/images/static-page/partners/p22.png'
import p23 from '@assets/images/static-page/partners/p23.png'
import p24 from '@assets/images/static-page/partners/p24.png'
import p25 from '@assets/images/static-page/partners/p25.png'
import p26 from '@assets/images/static-page/partners/p26.png'
import a1 from '@assets/images/static-page/advertises/advertises1.png'
import a2 from '@assets/images/static-page/advertises/advertises2.png'
import a3 from '@assets/images/static-page/advertises/advertises3.png'
import a4 from '@assets/images/static-page/advertises/advertises4.png'
import a5 from '@assets/images/static-page/advertises/advertises7.png'
import a6 from '@assets/images/static-page/advertises/advertises8.png'
import a7 from '@assets/images/static-page/advertises/advertises9.png'
import a8 from '@assets/images/static-page/advertises/advertises10.png'
import a9 from '@assets/images/static-page/advertises/advertises11.png'
import a10 from '@assets/images/static-page/advertises/advertises12.png'

import Slider from '@shared/components/slider'
import Error from '@shared/components/error'
import { allRoutes } from '@shared/constants/allRoutes'
import queryGraphql from '@shared/components/queryGraphql'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const AdvertiseWithUs = ({ seoData }) => {
  const { t } = useTranslation()
  const partners = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26]
  const advertisers = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10]
  return (
    <Layout data={{ oSeo: seoData }}>
      <section className={`${styles.bannerSection} bg-dark text-light`}>
        <Container>
          <div className={`${styles.content} py-5  d-flex align-items-center justify-content-center text-light`}>
            <Row>
              <Col md={8}>
                <h1>Connect with more than 4 million unique users every month with crictracker.com</h1>
                <p className="big-text mb-0">CricTracker brings cricket lovers from around the world under one roof. We boast of an overwhelming reader base of young fans who like to follow all the updates of the game. Advertisers get a very specific audience that they want to cater to boost the value of their brand. </p>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <section className="py-3 py-md-5 bg-primary text-light text-center">
        <Container>
          <h3 className="mb-0">Following are the ways in which we can promote / create better awareness for your brand:</h3>
        </Container>
      </section>

      <section className={`${styles.marketingSection} common-section`}>
        <Container>
          <h2 className="text-center mb-2">Marketing Solutions That Work</h2>
          <h4 className="text-center">A Medium Reaching Diverse Audiences in the Globe</h4>
          <ul className={`${styles.list} big-text mt-3 mt-md-5`}>
            <li><h4>Standard Banner Ads on the website – desktop and mobile</h4></li>
            <li><h4>Interstitial Ads on the website – desktop and mobile</h4></li>
            <li><h4>Rich media ads</h4></li>
            <li><h4>Brand promotion on Social Media - Live Facebook videos, Brand powered by posts, Promotional posts</h4></li>
            <li><h4>Video promotion</h4></li>
            <li><h4>Brand integration on website content</h4></li>
          </ul>
        </Container>
      </section>

      <section className="common-section text-center bg-light">
        <Container>
          <h2>Our Team and Social Media Followers</h2>
          <Row>
            <Col md={4}>
              <div className="common-box mt-2 mb-2">
                <h2 className="mb-2 mt-2">100000+</h2>
                <p className="big-text mb-2">POSTS</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="common-box mt-2 mb-2">
                <h2 className="mb-2 mt-2">200+</h2>
                <p className="big-text mb-2">AUTHORS</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="common-box mt-2 mb-2">
                <h2 className="mb-2 mt-2">1000000+</h2>
                <p className="big-text mb-2">PAGE VIEWS DAILY</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="common-section text-center">
        <Container>
          <h2>What make us different from others</h2>
          <Row className="justify-content-center">
            <Col md={4} >
              <div className={`${styles.item} common-box mt-2 mb-2`}>
                <div className={`${styles.person} bg-light p-5 rounded-circle overflow-hidden mx-auto my-2`}>
                  <MyImage src={visitors} alt="logo" layout="responsive" />
                </div>
                <h3 className="mb-2 mt-1">11 Million Unique Visitors</h3>
                <p className="big-text mb-2">The CricTracker website has an average monthly traffic of over 18 million pageviews with a total of 4 million unique visitors. Most of our readers also follow us on various Social Media platforms which drives in a diverse audience to the platform from most of the major cricket following nations.</p>
              </div>
            </Col>
            <Col md={4} >
              <div className={`${styles.item} common-box mt-2 mb-2`}>
                <div className={`${styles.person} bg-light p-5 rounded-circle overflow-hidden mx-auto my-2`}>
                  <MyImage src={target} alt="logo" layout="responsive" />
                </div>
                <h3 className="mb-2 mt-1">Targeted Audience</h3>
                <p className="big-text mb-2">Cricket is one of the most popular sports and at times has a higher viewership than other popular sports. The CricTracker audience can be easily classified. We give you an audience that has attracted the biggest of brands to pitch their brand around. With us the advertisers can reach out to their target audience – Cricket fans.</p>
              </div>
            </Col>
            <Col md={4} >
              <div className={`${styles.item} common-box mt-2 mb-2`}>
                <div className={`${styles.person} bg-light p-5 rounded-circle overflow-hidden mx-auto my-2`}>
                  <MyImage src={targetAudience} alt="logo" layout="responsive" />
                </div>
                <h3 className="mb-2 mt-1">Young Audience</h3>
                <p className="big-text mb-2">This is the generation of the millennials and our audience is powered by the youth. The age group that is considered the most productive and valuable for all the various segments 18-44 years, the working class constitutes 96 % of our readers. </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="common-section text-center bg-light">
        <Container>
          <h2>Monthly Traffic Stats</h2>
          <Row>
            <Col md={4}>
              <div className="common-box mt-2 mb-2">
                <h2 className="mb-2 mt-2">25.3 M+</h2>
                <p className="big-text mb-2">Sessions</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="common-box mt-2 mb-2">
                <h2 className="mb-2 mt-2">34.6 M+</h2>
                <p className="big-text mb-2">Page Views</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="common-box mt-2 mb-2">
                <h2 className="mb-2 mt-2">6.1 M+</h2>
                <p className="big-text mb-2">Unique Visitors</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="common-section text-center">
        <Container>
          <h2>Our Clients & Partners</h2>
          <Slider gap={0} nav>
            {
              partners.map((p, i) => {
                return (
                  <div key={i} className={`${styles.slideBlock}`}>
                    <div className={`${styles.slide} common-box d-flex align-items-center justify-content-center m-2`}>
                      <div>
                        <MyImage src={p} alt="logo" layout="responsive" />
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </Slider>
        </Container>
      </section>

      <section className="common-section text-center bg-light">
        <Container>
          <h2>Our Advertisers</h2>
          <Slider gap={0} nav>
            {
              advertisers.map((p, i) => {
                return (
                  <div key={i} className={`${styles.slideBlock}`}>
                    <div className={`${styles.slide} common-box d-flex align-items-center justify-content-center m-2`}>
                      <div>
                        <MyImage src={p} alt="logo" layout="responsive" />
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </Slider>
        </Container>
      </section>

      <section className="py-3 py-md-4 bg-primary text-light text-center">
        <Container>
          <h3 className="mb-2">Awesome, I would like to start a Project Now.</h3>
          <p className="big-text mb-3">We are also experts at finding the sweet spot for you.</p>
          <Link href={allRoutes.contactUs}><a className="theme-btn light-btn">{t('common:Contact')}</a></Link>
        </Container>
      </section>

    </Layout>
  )
}
AdvertiseWithUs.propTypes = {
  seoData: PropTypes.object
}
export default Error(AdvertiseWithUs)

export async function getServerSideProps({ res, resolvedUrl }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '') || '' } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj
    return {
      props: {
        seoData: seoData?.getSeoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}
