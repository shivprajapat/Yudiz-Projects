import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from '../contact-us/style.module.scss'
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

const FeedBackForm = dynamic(() => import('@shared/components/feedbackForm'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))
const FacebookIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.FacebookIcon))
const InstagramIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.InstagramIcon))
const LinkedinIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.LinkedinIcon))
const TelegramIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.TelegramIcon))
const TwitterIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.TwitterIcon))
const YoutubeIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.YoutubeIcon))
const MailIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.MailIcon))
const ThreadsIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.ThreadsIcon), { ssr: false })

const FeedBack = ({ seoData, typeOfFeedback }) => {
  return (
    <Layout data={{ oSeo: seoData }}>
      <section className={`${styles.bannerSection}`}>
        <div className='container'>
          <div className={`${styles.content}`}>
            <h1 className="mb-2 font-semi">
              <Trans i18nKey="common:Feedback" />
            </h1>
            {/* <p>
              <Trans i18nKey="common:ContactInfo" />
            </p> */}
          </div>
        </div>
      </section>
      <section className={`${styles.formBlock}`}>
        <div className='container'>
          <div className='row'>
            <div className='col-xxl-9 col-lg-8'>
              <div className="common-box">
                <FeedBackForm typeOfFeedback={typeOfFeedback} />
              </div>
            </div>
            <div className='col-xxl-3 col-lg-4'>
              <div className="common-box">
                <h4 className="text-uppercase">
                  <Trans i18nKey="common:ContactInformation" />
                </h4>
                <div className={`${styles.contactInfo} mb-3`}>
                  {/* <p className="d-flex">
                    <span className="d-block me-2">
                      <PasswordPhoneIcon />
                    </span>
                    <Link href="tel:08040990778">
                      <a>080-40990778</a>
                    </Link>
                  </p> */}
                  <p className="d-flex">
                    <span className="d-block me-2">
                      <MailIcon />
                    </span>
                    <CustomLink href="mailto:contact@crictracker.com">
                      <a>contact@crictracker.com</a>
                    </CustomLink>
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
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
FeedBack.propTypes = {
  seoData: PropTypes.object,
  typeOfFeedback: PropTypes.array
}
export default FeedBack

export async function getServerSideProps({ res, resolvedUrl, query }) {
  const [graphql, articleQuery, utils, feedbackQuery] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@shared/utils'),
    import('@graphql/feedback/feedback.query')
  ])
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')

    const url = resolvedUrl?.split('?')[0]

    const [seoData, type] = await Promise.allSettled([
      graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: url.replaceAll('/', '') || '' } }),
      graphql.default(feedbackQuery.GET_FEEDBACK_QUERY_TYPE)
    ])

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.value?.data?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    return {
      props: {
        seoData: seoData?.value?.data?.getSeoData,
        typeOfFeedback: type?.value?.data?.getFeedbackQueryType
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
