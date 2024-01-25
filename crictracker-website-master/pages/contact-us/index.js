import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import Layout from '@shared-components/layout'
import {
  FACEBOOK_URL,
  TELEGRAM_URL,
  LINKEDIN_URL,
  INSTAGRAM_URL,
  TWITTER_URL,
  YOUTUBE_URL,
  THREADS_URL
} from '@shared/constants'

const ContactForm = dynamic(() => import('@shared/components/contactForm'))
const FacebookIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.FacebookIcon), { ssr: false })
const InstagramIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.InstagramIcon), { ssr: false })
const LinkedinIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.LinkedinIcon), { ssr: false })
const TelegramIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.TelegramIcon), { ssr: false })
const TwitterIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.TwitterIcon), { ssr: false })
const YoutubeIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.YoutubeIcon), { ssr: false })
const MailIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.MailIcon), { ssr: false })
const ThreadsIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.ThreadsIcon), { ssr: false })

const ContactUs = ({ seoData, typeOfQuery }) => {
  return (
    <Layout data={{ oSeo: seoData }}>
      <section className={`${styles.bannerSection}`}>
        <Container>
          <div className={`${styles.content}`}>
            <h1 className="mb-2 font-semi">
              <Trans i18nKey="common:ContactUs" />
            </h1>
            {/* <p>
              <Trans i18nKey="common:ContactInfo" />
            </p> */}
          </div>
        </Container>
      </section>
      <section className={`${styles.formBlock}`}>
        <Container>
          <Row>
            <Col lg={8} xxl={9}>
              <div className="common-box">
                <ContactForm typeOfQuery={typeOfQuery} />
              </div>
            </Col>
            <Col lg={4} xxl={3}>
              <div className="common-box">
                <h4 className="text-uppercase">
                  <Trans i18nKey="common:ContactInformation" />
                </h4>
                <div className={`${styles.contactInfo} mb-3`}>
                  {/* <p className="d-flex my-3">
                    <span className="d-block me-2">
                      <PasswordPhoneIcon />
                    </span>
                    <Link href="tel:08040990778">
                      <a>080-40990778</a>
                    </Link>
                  </p> */}
                  <p className="d-flex my-3">
                    <span className="d-block me-2">
                      <MailIcon />
                    </span>
                    <Link href="mailto:contact@crictracker.com">
                      <a>contact@crictracker.com</a>
                    </Link>
                  </p>
                </div>
                <ul className={`${styles.socialMenu} d-flex text-uppercase align-items-center`}>
                  <li>
                    <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
                      <FacebookIcon />
                    </a>
                  </li>
                  <li>
                    <a href={TWITTER_URL} target="_blank" rel="noreferrer">
                      <TwitterIcon />
                    </a>
                  </li>
                  <li>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                      <InstagramIcon />
                    </a>
                  </li>
                  <li>
                    <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                      <LinkedinIcon />
                    </a>
                  </li>
                  <li>
                    <a href={YOUTUBE_URL} target="_blank" rel="noreferrer">
                      <YoutubeIcon />
                    </a>
                  </li>
                  <li>
                    <a href={THREADS_URL} target="_blank" rel="noreferrer">
                      <ThreadsIcon />
                    </a>
                  </li>
                  <li>
                    <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                      <TelegramIcon />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="common-box">
                <h4 className="text-uppercase">
                  <Trans i18nKey="common:AdvertisementQuery" />
                </h4>
                <div className={`${styles.contactInfo}`}>
                  <p><Trans i18nKey="common:AdvertisementNote" /></p>
                  <p className="d-flex mt-3 mb-1">
                    <span className="d-block me-2">
                      <MailIcon />
                    </span>
                    <Link href="mailto:advertise@crictracker.com">
                      <a>advertise@crictracker.com</a>
                    </Link>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}
ContactUs.propTypes = {
  seoData: PropTypes.object,
  typeOfQuery: PropTypes.array
}
export default ContactUs

export async function getServerSideProps({ res, resolvedUrl, query }) {
  const [graphql, articleQuery, contactQuery, utils] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@graphql/cms/cms.query'),
    import('@shared/utils')
  ])
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const url = resolvedUrl?.split('?')[0]

    const [seoData, type] = await Promise.allSettled([
      graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: url.replaceAll('/', '') || '' } }),
      graphql.default(contactQuery.GET_CONTACT_QUERY_TYPE)
    ])

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData.value?.data?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    return {
      props: {
        seoData: seoData?.value?.data?.getSeoData,
        typeOfQuery: type?.value?.data?.getContactQueryType
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
