import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import navStyles from '@shared/components/commonNav/style.module.scss'
import Layout from '@shared/components/layout'
import pageHeaderStyles from '@assets/scss/components/page-header.module.scss'
import Error from '@shared/components/error'
import { FACEBOOK_URL, INSTAGRAM_URL, LINKEDIN_URL, TELEGRAM_URL, THREADS_URL, TWITTER_URL, YOUTUBE_URL } from '@shared/constants'

const BreadcrumbNav = dynamic(() => import('@shared/components/breadcrumbNav'))
const CareersList = dynamic(() => import('@shared/components/careersList'))
const FacebookIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.FacebookIcon))
const InstagramIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.InstagramIcon))
const LinkedinIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.LinkedinIcon))
const TelegramIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.TelegramIcon))
const TwitterIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.TwitterIcon))
const YoutubeIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.YoutubeIcon))
const MailIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.MailIcon))
const ThreadsIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.ThreadsIcon), { ssr: false })

const Careers = ({ data, seoData }) => {
  return (
    <Layout
      data={{
        oSeo: {
          ...seoData?.getSeoData,
          sTitle: 'Jobs at CricTracker',
          sDescription: 'Check out the latest Jobs available on CricTracker'
        }
      }}
    >
      <main className={`${styles.CareersPage} common-section`}>
        <Container>
          <section className={`${pageHeaderStyles.pageHeader} ${styles.pageHeader} light-bg p-3 p-sm-4 br-lg position-relative`}>
            <div className="d-flex align-items-start justify-content-between">
              <BreadcrumbNav />
            </div>
            <Row className="justify-content-between">
              <Col lg={6}>
                <h1 className="d-flex align-items-center flex-wrap">
                  <Trans i18nKey="common:JoinOurTeam" />
                </h1>
                {/* <p className="big-text">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard
                  dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type.
                </p> */}
              </Col>
              <Col lg="auto" className="mt-2 mt-lg-0">
                <div className={`${styles.mailbox} px-3 py-2 mb-3 d-flex align-items-center rounded-pill bg-info`}>
                  <div className="me-1">
                    <MailIcon />
                  </div>
                  <p className="mb-0">career@crictracker.com</p>
                  <a href="mailto:career@crictracker.com" className="text-primary fw-bold ms-auto">
                    <Trans i18nKey="common:Apply" />
                  </a>
                </div>
                <div
                  className={`${styles.socialbox} d-flex align-items-center justify-content-center justify-content-sm-between border border-secondary rounded-pill`}
                >
                  <p className="mb-0 me-3 d-none d-sm-block">
                    <Trans i18nKey="common:GetAllTheUpdates" />
                  </p>
                  <ul className={`${styles.socialMenu} d-flex align-items-center mb-0 mx-n1`}>
                    <li className="mx-1">
                      <Link href={FACEBOOK_URL} passHref prefetch={false}>
                        <a target="_blank">
                          <FacebookIcon />
                        </a>
                      </Link>
                    </li>
                    <li className="mx-1">
                      <Link href={TWITTER_URL} passHref prefetch={false} >
                        <a target="_blank">
                          <TwitterIcon />
                        </a>
                      </Link>
                    </li>
                    <li className="mx-1">
                      <Link href={INSTAGRAM_URL} passHref prefetch={false}>
                        <a target="_blank">
                          <InstagramIcon />
                        </a>
                      </Link>
                    </li>
                    <li className="mx-1">
                      <Link href={LINKEDIN_URL} passHref prefetch={false}>
                        <a target="_blank">
                          <LinkedinIcon />
                        </a>
                      </Link>
                    </li>
                    <li className="mx-1">
                      <Link href={YOUTUBE_URL} passHref prefetch={false}>
                        <a target="_blank">
                          <YoutubeIcon />
                        </a>
                      </Link>
                    </li>
                    <li>
                      <a href={THREADS_URL} target="_blank" rel="noreferrer">
                        <ThreadsIcon />
                      </a>
                    </li>
                    <li className="mx-1">
                      <Link href={TELEGRAM_URL} passHref prefetch={false}>
                        <a target="_blank">
                          <TelegramIcon />
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </section>
          <Row>
            <Col md={9}>
              <section className="mt-2">
                <Nav className={`${navStyles.commonNav} d-sm-inline-flex text-uppercase`} variant="pills">
                  <Nav.Item className={navStyles.item}>
                    <Link href="#">
                      <a className={`${navStyles.active} nav-link`}>
                        <Trans i18nKey="common:CurrentJobs" />
                      </a>
                    </Link>
                  </Nav.Item>
                </Nav>
                <CareersList verticle={true} data={data?.getFrontJobs} type="jobListing" />
              </section>
            </Col>
          </Row>
        </Container>
      </main>
    </Layout>
  )
}

Careers.propTypes = {
  data: PropTypes.object,
  seoData: PropTypes.object
}

export async function getServerSideProps({ res, resolvedUrl, query }) {
  const [graphql, articleQuery, careerQuery, utils] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@graphql/careers/career.query'),
    import('@shared/utils')
  ])
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const url = resolvedUrl?.split('?')[0]

    const [seoData, jobs] = await Promise.allSettled([
      graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: url.replaceAll('/', '') || '' } }),
      graphql.default(careerQuery.GET_JOBS, { input: { nSkip: 0, nLimit: 6 } })
    ])

    // Check Redirection
    const { checkRedirectionStatus } = (await import('@shared/utils'))
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.value?.data?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    return {
      props: {
        data: jobs?.value?.data,
        seoData: seoData?.value?.data
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
export default Error(Careers)
