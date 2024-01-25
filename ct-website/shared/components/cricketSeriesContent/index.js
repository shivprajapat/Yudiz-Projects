import React, { useState, useEffect, useRef } from 'react'
import { Button, Collapse, Nav } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import Trans from 'next-translate/Trans'

import navStyles from '@shared-components/commonNav/style.module.scss'
import mobilefilter from '@assets/scss/components/mobile-filter.module.scss'
import styles from '@shared-components/fixtureContent/style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import { CURRENT_FUTURE_SERIES } from '@graphql/fixtures/fixtures.query'
import { debounce } from '@utils'
import SearchFilter from '../fixtureContent/searchFilter'
import { FilterIcon } from '../ctIcons'

const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const NoData = dynamic(() => import('../noData'), { ssr: false })

const CurrentFutureSeriesList = dynamic(() => import('@shared-components/currentFutureSeriesList'), {
  loading: () => (
    <div className="bg-white p-3 rounded">
      <div className="d-flex justify-content-between">
        <Skeleton width={'40%'} />
        <Skeleton width={'15%'} />
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <Skeleton width={'40%'} />
        <Skeleton width={'15%'} />
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <Skeleton width={'40%'} />
        <Skeleton width={'15%'} />
      </div>
    </div>
  )
})
export default function CricketSeriesContent({ data }) {
  const [requestParams, setRequestParams] = useState({
    eCategory: 'i',
    sSearch: ''
  })
  const initialCall = useRef(false)
  const [seriesData, setSeriesData] = useState()
  const [open, setOpen] = useState(false)
  const [toggleFilter, setToggleFilter] = useState(false)
  const [getSeries, { data: newSeriesData }] = useLazyQuery(CURRENT_FUTURE_SERIES)
  const handleFilter = () => {
    setToggleFilter(!toggleFilter)
  }

  const handleCategoryFilter = (value) => {
    setRequestParams({ ...requestParams, eCategory: value })
  }

  const handleSearch = debounce((search) => {
    setRequestParams({ ...requestParams, sSearch: search })
  })

  useEffect(() => {
    initialCall.current && getSeries({ variables: { input: requestParams } })
  }, [requestParams])

  useEffect(() => {
    newSeriesData && setSeriesData(newSeriesData?.listFixtureSeries)
  }, [newSeriesData])

  useEffect(() => {
    setSeriesData(data?.listFixtureSeries)
  }, [data])

  useEffect(() => {
    initialCall.current = true
  }, [])

  return (
    <div className="position-relative">
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="link"
        className={`${styles.filterBtn} border rounded-circle d-none d-md-inline-block`}
      >
        <FilterIcon />
      </Button>
      <Collapse in={open}>
        <div className={`${styles.fixturesFilter}`}>
          <div className={`${styles.bottomFilter} d-none d-md-flex flex-column flex-md-row justify-content-between mb-3`}>
            <SearchFilter handleSearch={handleSearch} />
          </div>
        </div>
      </Collapse>
      <div className={`${mobilefilter.mobFixtureFilter} ${toggleFilter && mobilefilter.active}`}>
        <div className={`${mobilefilter.head} d-flex d-md-none justify-content-between align-items-center`}>
          <p className="font-semi mb-0">
            <Trans i18nKey="common:Filter" />
          </p>
          <Button variant="link" onClick={handleFilter} className="btn-close"></Button>
        </div>
        <div className={`${mobilefilter.innerBlock} d-block d-md-none`}>
          <SearchFilter formStyles={formStyles} mobilefilter={mobilefilter} handleSearch={handleSearch} />
        </div>
      </div>
      <Button
        variant="link"
        onClick={handleFilter}
        className={`${mobilefilter.filterToggle} rounded-circle border-0 d-block d-md-none`}
      ></Button>
      <div className={`${mobilefilter.fixturesTab} ${mobilefilter.lightTab}`}>
        <Nav className={`${navStyles.commonNav} ${navStyles.themeLightNav} text-uppercase equal-width-nav`} variant="pills">
          <Nav.Item className={`${navStyles.item}`}>
            <a className={`${requestParams.eCategory === 'i' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('i')}>
              <Trans i18nKey="common:International" />
            </a>
          </Nav.Item>
          <Nav.Item className={`${navStyles.item}`}>
            <a className={`${requestParams.eCategory === 'l' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('l')}>
              <Trans i18nKey="common:League" />
            </a>
          </Nav.Item>
          <Nav.Item className={`${navStyles.item}`}>
            <a className={`${requestParams.eCategory === 'd' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('d')}>
              <Trans i18nKey="common:Domestic" />
            </a>
          </Nav.Item>
          <Nav.Item className={`${navStyles.item}`}>
            <a className={`${requestParams.eCategory === 'w' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('w')}>
              <Trans i18nKey="common:Women" />
            </a>
          </Nav.Item>
        </Nav>
      </div>
      {seriesData && <CurrentFutureSeriesList data={seriesData} />}
      {seriesData?.length === 0 && <NoData />}
    </div>
  )
}

CricketSeriesContent.propTypes = {
  data: PropTypes.object
}
