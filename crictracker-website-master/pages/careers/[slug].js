import React, { useState } from 'react'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import pageHeaderStyles from '../../assets/scss/components/page-header.module.scss'
import Layout from '../../shared/components/layout'
import { OPENING_IN_JOB } from '../../shared/constants'

const BreadcrumbNav = dynamic(() => import('@shared/components/breadcrumbNav'))
const CommonContent = dynamic(() => import('@shared/components/commonContent'))
const JobApplication = dynamic(() => import('@shared/components/jobApplication'), {
  loading: () => <Spinner animation="border" />
})
const CareersList = dynamic(() => import('@shared/components/careersList'))
const MapIcon = dynamic(() => import('@shared/components/ctIcons').then(e => e.MapIcon))

const JobDetails = ({ relatedJobs, jobDetails, seoData }) => {
  const [jobForm, setJobForm] = useState(false)

  function handleFormStatus() {
    setJobForm(true)
  }

  return (
    <Layout data={{ ...jobDetails?.getFrontJobById, oSeo: seoData?.getSeoData }}>
      <main className={`${styles.careersPage} common-section`}>
        <Container>
          <section className={`${pageHeaderStyles.pageHeader} ${styles.pageHeader} light-bg p-3 p-sm-4 br-lg position-relative`}>
            <div className="d-flex align-items-start justify-content-between">
              <BreadcrumbNav />
            </div>
            <h1 className="d-flex align-items-center flex-wrap">{jobDetails?.getFrontJobById?.sTitle}</h1>
            <div className={`${styles.info} d-flex flex-wrap mb-3`}>
              <p className="mb-1">
                <span className="text-muted">
                  <Trans i18nKey="common:Exp" />.
                </span>{' '}
                {jobDetails?.getFrontJobById?.fExperienceFrom} - {jobDetails?.getFrontJobById?.fExperienceTo}{' '}
                <Trans i18nKey="common:Years" />
              </p>
              <p className="mb-1">
                <span className="text-muted">
                  <Trans i18nKey="common:OpeningFor" />
                </span>{' '}
                {OPENING_IN_JOB.filter((d) => d.value === jobDetails?.getFrontJobById?.eOpeningFor)[0]?.label}
              </p>
              <p className="mb-1">
                <span className="text-muted">
                  <Trans i18nKey="common:OpenPositions" />
                </span>{' '}
                {jobDetails?.getFrontJobById?.nOpenPositions}
              </p>
            </div>
            <p className="mb-0">
              <MapIcon />
              <span className="font-semi ms-1">{jobDetails?.getFrontJobById?.oLocation?.sTitle}</span>
            </p>
          </section>
          <Row className="mt-3 mt-md-4">
            <Col lg={9} md={8}>
              <section className={`${styles.careersInfo} common-box`}>
                <CommonContent>
                  <div dangerouslySetInnerHTML={{ __html: jobDetails?.getFrontJobById?.sDescription }} />
                </CommonContent>
                {!jobForm && (
                  <Button className="theme-btn small-btn" onClick={() => handleFormStatus()} id="job-apply-form">
                    <Trans i18nKey="common:ApplyNow" />
                  </Button>
                )}
              </section>
              {jobForm && <JobApplication id={jobDetails?.getFrontJobById?._id} />}
            </Col>
            <Col lg={3} md={4}>
              <CareersList verticle={false} data={relatedJobs?.getRelatedJobs} type="jobDetails" />
            </Col>
          </Row>
        </Container>
      </main>
    </Layout>
  )
}
JobDetails.propTypes = {
  relatedJobs: PropTypes.object,
  jobDetails: PropTypes.object,
  seoData: PropTypes.object
}

export async function getServerSideProps({ params, res, resolvedUrl, query }) {
  const slug = params.slug
  const [graphql, articleQuery, careerQuery, utils] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@graphql/careers/career.query'),
    import('@shared/utils')
  ])
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')

    const { data: seoData } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: slug } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const [jobDetail, relatedJob] = await Promise.allSettled([
      graphql.default(careerQuery.GET_JOB_BY_ID, { input: { _id: seoData?.getSeoData?.iId } }),
      graphql.default(careerQuery.GET_RELATED_JOBS_BY_ID, {
        input: { nSkip: 0, nLimit: 4, _id: seoData?.getSeoData?.iId }
      })
    ])

    return {
      props: {
        relatedJobs: relatedJob?.value?.data,
        jobDetails: jobDetail?.value?.data,
        seoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}
export default JobDetails
