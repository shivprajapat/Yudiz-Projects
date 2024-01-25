import React, { useState } from 'react'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import pageHeaderStyles from '../../assets/scss/components/page-header.module.scss'
import Layout from '../../shared/components/layout'
import { MapIcon } from '../../shared/components/ctIcons'
import { GET_JOB_BY_ID, GET_RELATED_JOBS_BY_ID } from '../../graphql/careers/career.query'
import { OPENING_IN_JOB } from '../../shared/constants'
import queryGraphql from '@shared/components/queryGraphql'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'

const BreadcrumbNav = dynamic(() => import('@shared/components/breadcrumbNav'))
const JobApplication = dynamic(() => import('@shared/components/jobApplication'), {
  loading: () => <Spinner animation="border" size="sm" />
})
const CareersList = dynamic(() => import('@shared/components/careersList'))

const JobDetails = ({ relatedJobs, jobDetails, seoData }) => {
  const [jobForm, setJobForm] = useState(false)

  function handleFormStatus() {
    setJobForm(true)
  }

  return (
    <>
      <Layout data={{ ...jobDetails?.getFrontJobById, oSeo: seoData?.getSeoData }}>
        <main className={`${styles.careersPage} common-section`}>
          <Container>
            <section className={`${pageHeaderStyles.pageHeader} ${styles.pageHeader}`}>
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
              <Col md={9}>
                <section className={`${styles.careersInfo} common-box`}>
                  <div dangerouslySetInnerHTML={{ __html: jobDetails?.getFrontJobById?.sDescription }} />
                  {!jobForm && (
                    <Button className="theme-btn small-btn" onClick={() => handleFormStatus()} id="job-apply-form">
                      <Trans i18nKey="common:ApplyNow" />
                    </Button>
                  )}
                </section>
                {jobForm && <JobApplication id={jobDetails?.getFrontJobById?._id} />}
              </Col>
              <Col md={3}>
                <CareersList verticle={false} data={relatedJobs?.getRelatedJobs} type="jobDetails" />
              </Col>
            </Row>
          </Container>
        </main>
      </Layout>
    </>
  )
}
JobDetails.propTypes = {
  relatedJobs: PropTypes.object,
  jobDetails: PropTypes.object,
  seoData: PropTypes.object
}

export async function getServerSideProps({ params, res }) {
  const slug = params.slug
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: slug } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const { data: jobDetails } = await queryGraphql(GET_JOB_BY_ID, { input: { _id: seoData?.getSeoData?.iId } })
    const { data: relatedJobs } = await queryGraphql(GET_RELATED_JOBS_BY_ID, {
      input: { nSkip: 0, nLimit: 4, _id: seoData?.getSeoData?.iId }
    })
    return {
      props: {
        relatedJobs,
        jobDetails,
        seoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}
export default JobDetails
