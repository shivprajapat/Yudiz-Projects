import React, { useState, useEffect, useRef } from 'react'
import { Button, Collapse, Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import navStyles from '@shared-components/commonNav/style.module.scss'
import mobilefilter from '@assets/scss/components/mobile-filter.module.scss'
import styles from '@shared-components/fixtureContent/style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'

import { CURRENT_MATCHES, FIXTURE_FILTER } from '@graphql/fixtures/fixtures.query'
import { monthCal, currentMonthYear, decodeMonth, getTimeZone } from '@utils'
import NameFilter from '../fixtureContent/nameFilter'
import { FilterIcon } from '../ctIcons'
import { fixtureLoader } from '@shared/libs/allLoader'

const DateSlider = dynamic(() => import('@shared-components/dateSlider'))
const FixtureData = dynamic(() => import('@shared/components/fixtureContent/fixtureData'))
const NoData = dynamic(() => import('@noData'), { ssr: false })

export default function ScheduleContent({ data, filterData }) {
  const [fixtureData, setFixtureData] = useState(data?.listAllFixtures)
  const [newFilterData, setNewFilterData] = useState(filterData)
  const payloads = useRef({ eCategory: 'i', dByMonth: currentMonthYear(), sTimezone: getTimeZone() })
  const filterPayloads = useRef({ eCategory: 'i', dByMonth: currentMonthYear(), sTimezone: getTimeZone(), iTeamId: null, iSeriesId: null, iVenueId: null })
  const month = []
  const monthArray = monthCal(month)
  const [open, setOpen] = useState(false)
  const [toggleFilter, setToggleFilter] = useState(false)
  const [updateScheduleMatch, { data: updateScheduleMatchData, loading }] = useLazyQuery(CURRENT_MATCHES)
  const [updateFilter, { data: updateFilterData }] = useLazyQuery(FIXTURE_FILTER)

  const handleFilter = () => {
    setToggleFilter(!toggleFilter)
  }

  const handleCategoryFilter = (value) => {
    payloads.current = { ...payloads.current, eCategory: value }
    filterPayloads.current = { ...filterPayloads.current, eCategory: value }
    update()
  }

  const handleYear = (value) => {
    payloads.current = { ...payloads.current, dByMonth: decodeMonth(value) }
    filterPayloads.current = { ...filterPayloads.current, dByMonth: decodeMonth(value) }
    update()
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

  function update() {
    updateScheduleMatch({ variables: { input: { ...payloads.current } } })
    updateFilter({ variables: { input: filterPayloads.current } })
  }

  useEffect(() => {
    updateScheduleMatchData && setFixtureData(updateScheduleMatchData?.listAllFixtures)
  }, [updateScheduleMatchData])

  useEffect(() => {
    if (updateFilterData) {
      setNewFilterData(updateFilterData?.listAllFixturesFilter)
    }
  }, [updateFilterData])

  useEffect(() => {
    updateFilter({ variables: { input: filterPayloads.current } })
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
            <NameFilter formStyles={formStyles} handleClear={handleClear} filterData={newFilterData} handleFilterChange={handleFilterChange}/>
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
          <NameFilter formStyles={formStyles} mobilefilter={mobilefilter} fixtureData={fixtureData} handleClear={handleClear} filterData={newFilterData} handleFilterChange={handleFilterChange}/>
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
            <a className={`${payloads.current.eCategory === 'i' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('i')}>
              <Trans i18nKey="common:International" />
            </a>
          </Nav.Item>
          <Nav.Item className={`${navStyles.item}`}>
            <a className={`${payloads.current.eCategory === 'l' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('l')}>
              <Trans i18nKey="common:League" />
            </a>
          </Nav.Item>
          <Nav.Item className={`${navStyles.item}`}>
            <a className={`${payloads.current.eCategory === 'd' && navStyles.active} nav-link`} onClick={() => handleCategoryFilter('d')}>
              <Trans i18nKey="common:Domestic" />
            </a>
          </Nav.Item>
        </Nav>
      </div>
      <DateSlider monthArray={monthArray} selectedMonth={payloads.current.dByMonth} handleYear={handleYear} />
      <FixtureData data={fixtureData} id={fixtureData?._id} />
      {!loading && fixtureData?.length === 0 && <NoData />}
      {loading && fixtureLoader()}
    </div>
  )
}

ScheduleContent.propTypes = {
  data: PropTypes.object,
  filterData: PropTypes.object
}
