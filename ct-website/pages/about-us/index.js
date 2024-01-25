import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Col, Container, Row } from 'react-bootstrap'

import styles from './style.module.scss'
import Layout from '@shared-components/layout'
import sujjad from '@assets/images/sujjad.jpg'
import sai from '@assets/images/sai.jpg'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from '@shared-components/ctIcons'
import queryGraphql from '@shared/components/queryGraphql'
import Error from '@shared/components/error'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'
import { SAI_FB_ACCOUNT, SAI_LINKDIN_ACCOUNT, SAI_TWITTER_ACCOUNT, SUJJAD_FB_ACCOUNT, SUJJAD_INSTA_ACCOUNT, SUJJAD_LINKDIN_ACCOUNT, SUJJAD_TWITTER_ACCOUNT } from '@shared/constants'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const AboutUs = ({ seoData }) => {
  return (
    <Layout data={{ oSeo: seoData }}>
      <section className={`${styles.bannerSection} text-light`}>
        <Container>
          <div className={`${styles.content} d-flex align-items-center justify-content-center text-light`}>
            <h1 className="mb-0">About Us</h1>
          </div>
        </Container>
      </section>
      <section className={`${styles.bannerSection1} common-section text-center bg-light`}>
        <Container>
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
      <section className={`${styles.bannerSection1} common-section text-center`}>
        <Container>
          <Row className="justify-content-center ">
            <Col md={10} lg={8}>
              <h2>CricTracker Story</h2>
              <p className="big-text">Our story perfectly fits for a Bollywood movie plot. Three young Indian cricket fans with a burning desire to make it big in life got together to create what is now one of the most widely appreciated cricketing platforms on the web. We celebrate CricTracker’s birthday on 8th of July, the day we registered the domain. The day we spoke our first words to the audience, was on Date of First article published the day, the very first article was published on the website. Here is an example of how one incident can make an impact big enough to bring about a massive change in the lives of those witnessing it - the unplayable inswining Yorker that Irfan Pathan bowled to Adam Gilchrist not only marked a special place for the left-arm pacer in Indian cricket history but also ignited the love and passion for Cricket in Syed Sujjad Pasha who then initiated the idea to create CricTracker. </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className={`${styles.bannerSection1} common-section text-center bg-light`}>
        <Container>
          <Row className="justify-content-center ">
            <Col md={10} lg={8}>
              <h2>What is CricTracker</h2>
              <p className="big-text">Something new is brought into existence when people notice a few missing links in what already exists. In an industry that had the biggest name as old as some of us with CricTracker we wanted to connect the young cricket fans to the game. Despite the highs and lows on the cricket field it was expected that maturity of other sports and audience acceptance will witness a dip in the following for cricket. Being cricket crazy fans we wanted to defy that. </p>
              <p className="big-text">We made it our mission to bring back the focus on cricket and to date we strive to do that.</p>
              <p className="big-text">CricTracker today is regarded as the fastest-growing phenomenon in the cricket publishing industry with a reader base of over 30 million page views each month. We cover all the aspects of the game via News, Match Predications, Fantasy Tips, pre and post-Match Analysis, Statistics, Cricket Facts, Social Media Trends, Videos, Humour and more.</p>
              <h2>Our USP</h2>
              <p className="big-text">In a sector which has worked on set patterns and formulas we have created a unique range of articles which are quick to read and easy to digest and have been widely appreciated by our readers. This is what makes CricTracker not just an informative website but also adds us into the entertainment category and thus, to categories us perfectly we arrive to the term ‘Infotainment’. Our content is spread in over 30 different categories that are designed considering the areas of interest of our readers from around the world. </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className={`${styles.bannerSection1} common-section text-center`}>
        <Container>
          <h2>The CricTracker Pillars</h2>
          <Row className="justify-content-center">
            <Col md={4} >
              <div className="common-box mt-2 mb-2">
                <div className={`${styles.person} rounded-circle overflow-hidden mx-auto my-2`}>
                  <MyImage src={sujjad} alt="logo" layout="responsive" />
                </div>
                <h3 className="mb-2 mt-1">Syed Sujjad Pasha</h3>
                <p>CEO, Founder</p>
                <p className="big-text mb-2">A techie in his 20s based in Bangalore conceived the idea of starting a cricket website to channelize his love, passion and emotions for the game of cricket and to connect other like-minded people on the platform. Hard at work, a tough nut to crack and chilled outside Sujjad is the CEO & Founder of CricTracker. </p>
                <ul className={`${styles.socialMenu} d-flex text-uppercase align-items-center justify-content-center my-3`}>
                  <li>
                    <Link href={SUJJAD_FB_ACCOUNT} prefetch={false}>
                      <a target="_blank">
                        <FacebookIcon />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={SUJJAD_TWITTER_ACCOUNT} prefetch={false}>
                      <a target="_blank">
                        <TwitterIcon />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={SUJJAD_INSTA_ACCOUNT} prefetch={false}>
                      <a target="_blank">
                        <InstagramIcon />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={SUJJAD_LINKDIN_ACCOUNT} prefetch={false}>
                      <a target="_blank">
                        <LinkedinIcon />
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
            <Col md={4} >
              <div className="common-box mt-2 mb-2">
                <div className={`${styles.person} rounded-circle overflow-hidden mx-auto my-2`}>
                  <MyImage src={sai} alt="logo" layout="responsive" />
                </div>
                <h3 className="mb-2 mt-1">Sai Kishore</h3>
                <p>Social Media Manager</p>
                <p className="big-text mb-2">A mechanical engineer by qualification, his parents thought their obedient son would work as an engineer. An ardent Cricket fan is following his passion and making a living watching and working around his favorite sport. Kishore a pillar of the CricTracker team handles the tough job of managing the millions of fans across all Social Media platforms. </p>
                <ul className={`${styles.socialMenu} d-flex text-uppercase align-items-center justify-content-center my-3`}>
                  <li>
                    <Link href={SAI_FB_ACCOUNT} prefetch={false}>
                      <a target="_blank">
                        <FacebookIcon />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={SAI_TWITTER_ACCOUNT} prefetch={false}>
                      <a target="_blank">
                        <TwitterIcon />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={SAI_LINKDIN_ACCOUNT} prefetch={false}>
                      <a target="_blank">
                        <LinkedinIcon />
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}
AboutUs.propTypes = {
  seoData: PropTypes.object
}
export default Error(AboutUs)

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
