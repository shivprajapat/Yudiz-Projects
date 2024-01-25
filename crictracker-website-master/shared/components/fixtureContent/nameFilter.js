import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import { FilterIcon } from '@shared-components/ctIcons'
import CustomSelect from '../customSelect'

const NameFilter = ({ formStyles, mobilefilter, filterData, handleFilterChange, handleClear, isMobile }) => {
  const [value, setValue] = useState({ venue: undefined, team: undefined, series: undefined })

  const handleClearFilter = () => {
    setValue({})
    handleClear()
  }

  function handleChange(v, type) {
    isMobile && window.scrollTo(0, 150)
    setValue({ ...value, [type]: v })
    handleFilterChange(v, type)
  }

  const optionTeams = filterData?.aTeam?.map((team) => ({
    sValue: team._id,
    sLabel: team.sTitle
  }))

  const optionSeries = filterData?.aSeries?.map((series) => ({
    sValue: series._id,
    sLabel: series.sTitle
  }))

  const optionVenue = filterData?.aVenue?.map((venue) => ({
    sValue: venue._id,
    sLabel: venue.sName
  }))

  return (
    <Form className={`${styles.nameFilter} ${mobilefilter?.nameFilter} d-flex flex-column flex-md-row align-items-center`}>
      <div className={`${styles.icon} ${mobilefilter?.icon} `}>
        <FilterIcon />
      </div>
      <div className={`${formStyles?.formGroup} ${mobilefilter?.formGroup} ${styles?.formGroup} `}>
        <Form.Label className={`${formStyles?.label} d-block d-md-none`}>
          <Trans i18nKey="common:Venue" />
        </Form.Label>
        <CustomSelect
          options={optionVenue}
          value={value?.venue}
          labelKey="sLabel"
          valueKey="sValue"
          placeholder="Venue"
          isClearable
          isNative
          onChange={(e) => {
            handleChange(e, 'venue')
          }}
        />
      </div>
      <div className={`${formStyles?.formGroup} ${mobilefilter?.formGroup} ${styles?.formGroup} `}>
        <Form.Label className={`${formStyles?.label} d-block d-md-none`}>
          <Trans i18nKey="common:Team" />
        </Form.Label>
        <CustomSelect
          options={optionTeams}
          value={value?.team}
          labelKey="sLabel"
          valueKey="sValue"
          placeholder="Team"
          isClearable
          isNative
          onChange={(e) => {
            handleChange(e, 'team')
          }}
        />
      </div>
      <div className={`${formStyles?.formGroup} ${mobilefilter?.formGroup} ${styles?.formGroup} `}>
        <Form.Label className={`${formStyles?.label} d-block d-md-none`}>
          <Trans i18nKey="common:Series" />
        </Form.Label>
        <CustomSelect
          options={optionSeries}
          value={value?.series}
          labelKey="sLabel"
          valueKey="sValue"
          placeholder="Series"
          isClearable
          isNative
          onChange={(e) => {
            handleChange(e, 'series')
          }}
        />
      </div>
      <div>
        <Button className="theme-btn outline-btn xsmall-btn me-2" onClick={handleClearFilter}>
          <Trans i18nKey="common:Clear" />
        </Button>
      </div>
    </Form>
  )
}

NameFilter.propTypes = {
  formStyles: PropTypes.any,
  mobilefilter: PropTypes.any,
  filterData: PropTypes.object,
  handleFilterChange: PropTypes.any,
  handleClear: PropTypes.func,
  handleScroll: PropTypes.func,
  isMobile: PropTypes.bool
}

export default NameFilter
