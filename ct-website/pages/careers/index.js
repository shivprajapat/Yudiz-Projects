import React from 'react'
import Link from 'next/link'
import { Container, Row, Col, Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import navStyles from '../../shared/components/commonNav/style.module.scss'
import Layout from '../../shared/components/layout'
import pageHeaderStyles from '../../assets/scss/components/page-header.module.scss'
import {
  MailIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon
} from '../../shared/components/ctIcons'
import { GET_JOBS } from '../../graphql/careers/career.query'
import queryGraphql from '@shared/components/queryGraphql'
import Error from '@shared/components/error'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { FACEBOOK_URL, INSTAGRAM_URL, LINKEDIN_URL, TELEGRAM_URL, TWITTER_URL, YOUTUBE_URL } from '@shared/constants'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'

const BreadcrumbNav = dynamic(() => import('@shared/components/breadcrumbNav'))
const CareersList = dynamic(() => import('@shared/components/careersList'))

const Careers = ({ data, seoData }) => {
  const { t } = useTranslation('common')
  return (
    <Layout
      data={{
        oSeo: {
          ...seoData?.getSeoData,
          sTitle: t('CareersMeta.Title'),
          sDescription: t('CareersMeta.Description')
        }
      }}
    >
      <main className={`${styles.CareersPage} common-section`}>
        <Container>
          <section className={`${pageHeaderStyles.pageHeader} ${styles.pageHeader}`}>
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
                  <a href="mailto:career@crictracker.com" className="text-primary font-bold ms-auto">
                    <Trans i18nKey="common:Apply" />
                  </a>
                </div>
                <div
                  className={`${styles.socialbox} d-flex align-items-center justify-content-center justify-content-sm-between border border-secondary rounded-pill`}
                >
                  <p className="mb-0 me-3 d-none d-sm-block">
                    <Trans i18nKey="common:GetAllTheUpdates" />
                  </p>
                  <ul className={`${styles.socialMenu} d-flex align-items-center mb-0`}>
                    <li>
                      <Link href={FACEBOOK_URL} passHref prefetch={false}>
                        <a target="_blank">
                          <FacebookIcon />
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={TWITTER_URL} passHref prefetch={false} >
                        <a target="_blank">
                          <TwitterIcon />
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={INSTAGRAM_URL} passHref prefetch={false}>
                        <a target="_blank">
                          <InstagramIcon />
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={LINKEDIN_URL} passHref prefetch={false}>
                        <a target="_blank">
                          <LinkedinIcon />
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={YOUTUBE_URL} passHref prefetch={false}>
                        <a target="_blank">
                          <YoutubeIcon />
                        </a>
                      </Link>
                    </li>
                    <li>
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
                  <Nav.Item className={navStyles.item}>
                    <Link href="#">
                      <a className="nav-link">
                        <Trans i18nKey="common:WorkAtCricTracker" />
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

    const { data } = await queryGraphql(GET_JOBS, { input: { nSkip: 0, nLimit: 6 } })
    return {
      props: {
        data,
        seoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}
export default Error(Careers)
