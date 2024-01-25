import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button, Collapse, Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import { useLazyQuery } from '@apollo/client'

import styles from '@shared-components/fixtureContent/style.module.scss'
import navStyles from '@shared-components/commonNav/style.module.scss'
import mobilefilter from '@assets/scss/components/mobile-filter.module.scss'
import { allRoutes } from '../../constants/allRoutes'
import { CURRENT_MATCHES, FIXTURE_FILTER } from '@graphql/fixtures/fixtures.query'
import NameFilter from '../fixtureContent/nameFilter'
import formStyles from '@assets/scss/components/form.module.scss'
import { FilterIcon } from '../ctIcons'
import { getTimeZone, isBottomReached } from '@shared/utils'
import { fixtureLoader } from '@shared/libs/allLoader'
import CustomLink from '../customLink'
import useWindowSize from '@shared/hooks/windowSize'

const FixtureData = dynamic(() => import('@shared/components/fixtureContent/fixtureData'))
const NoData = dynamic(() => import('@noData'), { ssr: false })
function CurrentMatches({ data, status, filterData }) {
  const [fixtureData, setFixtureData] = useState(data?.listAllFixtures || [])
  const [newFilterData, setNewFilterData] = useState(filterData)
  const [toggleFilter, setToggleFilter] = useState(false)
  const [open, setOpen] = useState(false)
  const loadingData = useRef(false)
  const payloads = useRef({ eCategory: 'i', eStatus: status, sTimezone: getTimeZone(), iTeamId: null, iSeriesId: null, iVenueId: null, nLimit: 10, nSkip: 1 })
  const filterPayloads = useRef({ eCategory: 'i', eStatus: status, sTimezone: getTimeZone(), iTeamId: null, iSeriesId: null, iVenueId: null })
  const categoryType = useRef('i')
  const totalLength = useRef(data?.listAllFixtures?.length)
  const isReachedBottom = useRef(false)
  const [width] = useWindowSize()

  const [updateCurrentMatch, { data: updateCurrentMatchData, loading }] = useLazyQuery(CURRENT_MATCHES)
  const [updateFilter, { data: updateFilterData }] = useLazyQuery(FIXTURE_FILTER)

  const handleFilter = () => {
    setToggleFilter(!toggleFilter)
  }

  const handleCategoryFilter = (value) => {
    categoryType.current = value
    payloads.current = { ...payloads.current, eCategory: value, eStatus: status, nSkip: 1 }
    filterPayloads.current = { ...filterPayloads.current, eCategory: value, eStatus: status }
    update(true)
  }

  const handleClear = () => {
    payloads.current = { ...payloads.current, iVenueId: null, iSeriesId: null, iTeamId: null }
    filterPayloads.current = { ...filterPayloads.current, iVenueId: null, iSeriesId: null, iTeamId: null }
    update()
  }

  const handleFilterChange = (data, type) => {
    if (type === 'venue') {
      payloads.current = { ...payloads.current, iVenueId: data === null ? null : data.sValue }
      filterPayloads.current = { ...filterPayloads.current, iVenueId: data === null ? null : data.sValue }
    } else if (type === 'team') {
      payloads.current = { ...payloads.current, iTeamId: data === null ? null : data.sValue }
      filterPayloads.current = { ...filterPayloads.current, iTeamId: data === null ? null : data.sValue }
    } else if (type === 'series') {
      payloads.current = { ...payloads.current, iSeriesId: data === null ? null : data.sValue }
      filterPayloads.current = { ...filterPayloads.current, iSeriesId: data === null ? null : data.sValue }
    }
    update()
  }

  function update(isUpdateFilter) {
    updateCurrentMatch({ variables: { input: payloads.current } })
    isUpdateFilter && updateFilter({ variables: { input: filterPayloads.current } })
  }

  function isReached(reach) {
    if (reach && !loadingData.current && totalLength.current === payloads.current.nLimit) {
      loadingData.current = true
      isReachedBottom.current = true
      payloads.current = ({ ...payloads.current, nSkip: payloads.current.nSkip + 1 })
      updateCurrentMatch({ variables: { input: payloads.current } })
    }
  }

  useEffect(() => {
    if (isReachedBottom.current && updateCurrentMatchData) {
      isReachedBottom.current = false
      setFixtureData([...fixtureData, ...updateCurrentMatchData?.listAllFixtures])
    } else if (!loadingData.current && updateCurrentMatchData) {
      setFixtureData(updateCurrentMatchData?.listAllFixtures)
    }
    totalLength.current = updateCurrentMatchData?.listAllFixtures?.length
  }, [updateCurrentMatchData])

  useEffect(() => {
    if (updateFilterData) {
      setNewFilterData(updateFilterData?.listAllFixturesFilter)
    }
  }, [updateFilterData])

  useEffect(() => {
    updateFilter({ variables: { input: filterPayloads.current } })
  }, [])

  useEffect(() => {
    setFixtureData(data?.listAllFixtures)
  }, [data?.listAllFixtures])

  useEffect(() => {
    loadingData.current = false
    fixtureData?.length > 0 && isBottomReached(fixtureData[fixtureData.length - 1]?._id, isReached)
  }, [fixtureData])
  return (
    <div className="position-relative">
      {width > 768 && (<>
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
              <NameFilter formStyles={formStyles} handleClear={handleClear} filterData={newFilterData} handleFilterChange={handleFilterChange} />
            </div>
          </div>
        </Collapse>
      </>)}
      {width < 768 && (<>
        <div className={`${mobilefilter.mobFixtureFilter} ${toggleFilter && mobilefilter.active} light-bg position-fixed vw-100`}>
          <div className={`${mobilefilter.head} d-flex d-md-none justify-content-between align-items-center`}>
            <p className="font-semi mb-0">
              <Trans i18nKey="common:Filter" />
            </p>
            <Button variant="link" onClick={handleFilter} className="btn-close"></Button>
          </div>
          <div className={`${mobilefilter.innerBlock} d-block d-md-none`}>
            <NameFilter formStyles={formStyles} isMobile mobilefilter={mobilefilter} handleClear={handleClear} filterData={newFilterData} handleFilterChange={handleFilterChange} />
          </div>
        </div>
        <Button
          variant="link"
          onClick={handleFilter}
          className={`${mobilefilter.filterToggle} border-0 d-block d-md-none position-fixed start-50 translate-middle-x c-transition`}
        >
          <Trans i18nKey="common:Filter" />
        </Button>
      </>)}
      <Nav className={`${navStyles.commonNav} text-uppercase equal-width-nav`} variant="pills">
        <Nav.Item className={`${navStyles.item}`}>
          <CustomLink href={allRoutes.fixtures} prefetch={false}>
            <a className={`${status === 'l' && navStyles.active} nav-link`}>
              <Trans i18nKey="common:Live" />
            </a>
          </CustomLink>
        </Nav.Item>
        <Nav.Item className={`${navStyles.item}`}>
          <CustomLink href={allRoutes.fixturesUpcoming} prefetch={false}>
            <a className={`${status === 'u' && navStyles.active} nav-link`}>
              <Trans i18nKey="common:Upcoming" />
            </a>
          </CustomLink>
        </Nav.Item>
        <Nav.Item className={`${navStyles.item}`}>
          <CustomLink href={allRoutes.fixturesRecent} prefetch={false}>
            <a className={`${status === 'r' && navStyles.active} nav-link`}>
              <Trans i18nKey="common:Recent" />
            </a>
          </CustomLink>
        </Nav.Item>
      </Nav>
      <Nav className={`${navStyles.commonNav} ${navStyles.themeLightNav} ${navStyles.stickyNav} ${styles.catNav} text-uppercase equal-width-nav  scroll-list flex-nowrap text-nowrap`} variant="pills">
        <Nav.Item className={`${navStyles.item}`}>
          <a className={`${categoryType.current === 'i' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('i')}>
            <Trans i18nKey="common:International" />
          </a>
        </Nav.Item>
        <Nav.Item className={`${navStyles.item}`}>
          <a className={`${categoryType.current === 'l' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('l')}>
            <Trans i18nKey="common:League" />
          </a>
        </Nav.Item>
        <Nav.Item className={`${navStyles.item}`}>
          <a className={`${categoryType.current === 'd' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('d')}>
            <Trans i18nKey="common:Domestic" />
          </a>
        </Nav.Item>
      </Nav>
      <FixtureData data={fixtureData} id={fixtureData?._id} isSeriesShow />
      {!loading && fixtureData?.length === 0 && <NoData />}
      {loading && fixtureLoader()}
    </div>
  )
}
CurrentMatches.propTypes = {
  data: PropTypes.object,
  status: PropTypes.string,
  open: PropTypes.bool,
  toggleFilter: PropTypes.bool,
  handleFilter: PropTypes.func,
  filterData: PropTypes.object
}
export default CurrentMatches
