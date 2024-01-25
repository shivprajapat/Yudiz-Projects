import React, { useEffect, useRef, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import Link from 'next/link'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { MapIcon } from '../ctIcons'
import searchIcon from '@assets/images/icon/careers/seo-search-icon.svg'
import { OPENING_IN_JOB } from '../../constants'
import { GET_JOBS } from '@graphql/careers/career.query'
import editIcon from '@assets/images/icon/careers/seo-edit-icon.svg'
import teamIcon from '@assets/images/icon/careers/seo-team-icon.svg'
import { isBottomReached } from '@shared/utils'
import { allRoutes } from '@shared/constants/allRoutes'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const CareersList = ({ data, verticle, type }) => {
  const [jobListData, setJobListData] = useState(data?.aResults || [])
  const payload = useRef({
    nSkip: 1,
    nLimit: 6
  })
  const [getJobList, { data: newJobListData }] = useLazyQuery(GET_JOBS, { variables: { input: payload.current } })
  const isLoading = useRef(false)
  useEffect(() => {
    if (newJobListData && type === 'jobListing') {
      setJobListData([...jobListData, ...newJobListData?.getFrontJobs?.aResults])
    }
  }, [newJobListData])

  useEffect(() => {
    if (jobListData) {
      isLoading.current = false
      isBottomReached(jobListData[jobListData?.length - 1]?._id, isReached)
    }
  }, [jobListData])

  function isReached(reach) {
    if (reach && data?.aResults?.length < data?.nTotal && !isLoading.current && type === 'jobListing') {
      isLoading.current = true
      payload.current.nSkip += 1
      getJobList()
    }
  }

  function getDesignationIcon(value) {
    switch (value) {
      case 'cm':
        return searchIcon
      case 'cw':
        return searchIcon
      case 'ed':
        return editIcon
      case 'hr':
        return teamIcon
      case 's':
        return searchIcon
      case 'sm':
        return searchIcon
      case 'vd':
        return searchIcon
      default:
        return searchIcon
    }
  }

  return (
    <Row className={`${styles.careersList}`}>
      {jobListData?.map((job) => (
        <Col key={job._id} id={job?._id} className={verticle ? 'col-lg-4 col-sm-6 col-12' : 'col-md-12 col-sm-6 col-12'}>
          <Link href={`${allRoutes.careers}${job?.oSeo?.sSlug}`} prefetch={false}>
            <a className={`${styles.item} common-box d-block`}>
              <div className={`${styles.title} d-flex align-items-center mb-4`}>
                <div className={`${styles.icon} me-2`}>
                  <MyImage src={getDesignationIcon(job?.eDesignation)} alt={job?.sSlug} layout="responsive" />
                </div>
                <h3 className="small-head mb-0 font-semi">{job?.sTitle}</h3>
              </div>
              <p>
                <span className="text-muted">
                  <Trans i18nKey="common:Exp" />.
                </span>{' '}
                {job?.fExperienceFrom} - {job?.fExperienceTo} <Trans i18nKey="common:Years" />
              </p>
              <p>
                <span className="text-muted">
                  <Trans i18nKey="common:OpeningFor" />
                </span>{' '}
                {OPENING_IN_JOB.filter((d) => d.value === job?.eOpeningFor)[0]?.label}
              </p>
              <p>
                <span className="text-muted">
                  <Trans i18nKey="common:OpenPositions" />
                </span>{' '}
                {job?.nOpenPositions}
              </p>
              <p className={`${styles.location} mt-4`}>
                <MapIcon />
                <span className="font-semi ms-1">{job?.oLocation?.sTitle}</span>
              </p>
            </a>
          </Link>
        </Col>
      ))}
    </Row>
  )
}

CareersList.propTypes = {
  data: PropTypes.object,
  verticle: PropTypes.bool,
  type: PropTypes.string
}

export default CareersList
