import React, { useState, useEffect, useRef } from 'react'
import { Button, Collapse, Nav } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import navStyles from '@shared-components/commonNav/style.module.scss'
import mobilefilter from '@assets/scss/components/mobile-filter.module.scss'
import styles from '@shared-components/fixtureContent/style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import { SERIES_ARCHIVE } from '@graphql/fixtures/fixtures.query'
import { debounce, getTimeZone, isBottomReached } from '@utils'
import SearchFilter from '../fixtureContent/searchFilter'
import { FilterIcon } from '../ctIcons'
import { archiveSeriesLoader } from '@shared/libs/allLoader'
import useWindowSize from '@shared/hooks/windowSize'

// const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const NoData = dynamic(() => import('@shared-components/noData'), { ssr: false })
const DateSlider = dynamic(() => import('@shared-components/dateSlider'))
const ArchiveList = dynamic(() => import('@shared-components/series/archiveList'), {
  loading: () => archiveSeriesLoader(3)
})

const ArchiveContent = ({ data, year }) => {
  const [open, setOpen] = useState(false)
  const loading = useRef(false)
  const isReachedBottom = useRef(false)
  const [toggleFilter, setToggleFilter] = useState(false)
  const [width] = useWindowSize()
  const requestParams = useRef({
    eCategory: 'i',
    dYear: new Date().getFullYear().toString(),
    sSearch: '',
    sTimezone: getTimeZone(),
    nLimit: 20,
    nSkip: 1
  })
  const [archiveData, setArchiveData] = useState(data?.listSeriesArchive)
  const [getArchive, { data: newArchiveData, loading: isLoading }] = useLazyQuery(SERIES_ARCHIVE)

  const latestSeries = useRef(newArchiveData?.listSeriesArchive?.length || data?.listSeriesArchive?.length)

  const handleFilter = () => {
    setToggleFilter(!toggleFilter)
  }

  const handleCategoryFilter = (value) => {
    requestParams.current = ({ ...requestParams.current, eCategory: value, nSkip: 1 })
    getArchive({ variables: { input: requestParams.current } })
  }

  const handleYear = (y) => {
    requestParams.current = ({ ...requestParams.current, dYear: y, nSkip: 1 })
    getArchive({ variables: { input: requestParams.current } })
  }

  const handleSearch = debounce((search) => {
    requestParams.current = ({ ...requestParams.current, sSearch: search, nSkip: 1 })
    getArchive({ variables: { input: requestParams.current } })
  })

  useEffect(() => {
    loading.current = false
    isBottomReached(archiveData[archiveData.length - 1]?._id, isReached)
  }, [archiveData])

  function isReached(reach) {
    if (reach && !loading.current && latestSeries.current === requestParams.current.nLimit) {
      loading.current = true
      isReachedBottom.current = true
      requestParams.current = ({ ...requestParams.current, nSkip: requestParams.current.nSkip + 1 })
      getArchive({ variables: { input: requestParams.current } })
    }
  }

  useEffect(() => {
    if (isReachedBottom.current && newArchiveData) {
      setArchiveData([...archiveData, ...newArchiveData?.listSeriesArchive])
      loading.current = false
      isReachedBottom.current = false
    } else if (!loading.current && newArchiveData) {
      setArchiveData(newArchiveData?.listSeriesArchive)
    }
    latestSeries.current = newArchiveData?.listSeriesArchive?.length || data?.listSeriesArchive?.length
  }, [newArchiveData])

  return (
    <div className="position-relative">
      {width > 768 && (
        <>
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            variant="link"
            className={`${styles.filterBtn} ct-border rounded-circle d-none d-md-inline-block`}
          >
            <FilterIcon />
          </Button>
          <Collapse in={open}>
            <div className={`${styles.fixturesFilter} position-relative`}>
              <div className={`${styles.bottomFilter} d-none d-md-flex flex-column flex-md-row justify-content-between mb-3`}>
                <SearchFilter handleSearch={handleSearch} />
              </div>
            </div>
          </Collapse>
        </>
      )}
      {width < 768 && (
        <>
          <div className={`${mobilefilter.mobFixtureFilter} ${toggleFilter && mobilefilter.active} light-bg position-fixed vw-100`}>
            <div className={`${mobilefilter.head} d-flex d-md-none justify-content-between align-items-center`}>
              <p className="font-semi mb-0">
                <Trans i18nKey="common:Filter" />
              </p>
              <Button variant="link" onClick={handleFilter} className="btn-close"></Button>
            </div>
            <div className={`${mobilefilter.innerBlock} d-block d-md-none`}>
              <SearchFilter isMobile formStyles={formStyles} mobilefilter={mobilefilter} handleSearch={handleSearch} />
            </div>
          </div>
          <Button
            variant="link"
            onClick={handleFilter}
            className={`${mobilefilter.filterToggle} border-0 d-block d-md-none position-fixed start-50 translate-middle-x c-transition`}
          >
            <Trans i18nKey="common:Filter" />
          </Button>
        </>
      )}
      <Nav className={`${navStyles.commonNav} ${navStyles.themeLightNav} ${navStyles.stickyNav} ${styles.catNav} text-uppercase equal-width-nav scroll-list flex-nowrap text-nowrap`} variant="pills">
        <Nav.Item className={`${navStyles.item}`}>
          <a className={`${requestParams.current.eCategory === 'i' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('i')}>
            <Trans i18nKey="common:International" />
          </a>
        </Nav.Item>
        <Nav.Item className={`${navStyles.item}`}>
          <a className={`${requestParams.current.eCategory === 'l' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('l')}>
            <Trans i18nKey="common:League" />
          </a>
        </Nav.Item>
        <Nav.Item className={`${navStyles.item}`}>
          <a className={`${requestParams.current.eCategory === 'd' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('d')}>
            <Trans i18nKey="common:Domestic" />
          </a>
        </Nav.Item>
        <Nav.Item className={`${navStyles.item}`}>
          <a className={`${requestParams.current.eCategory === 'w' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('w')}>
            <Trans i18nKey="common:Women" />
          </a>
        </Nav.Item>
      </Nav>
      <DateSlider className={`${styles.fixtureDateSlider}`} year={year} handleYear={handleYear} selectedYear={requestParams.current.dYear} isSticky />
      {archiveData && <ArchiveList data={archiveData} isLoading={isLoading} />}
      {archiveData?.length === 0 && <NoData />}
    </div>
  )
}

ArchiveContent.propTypes = {
  data: PropTypes.object,
  year: PropTypes.object
}

export default ArchiveContent
