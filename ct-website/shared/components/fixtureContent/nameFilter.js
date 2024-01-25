import React from 'react'
import { Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import { Controller, useForm } from 'react-hook-form'

import styles from './style.module.scss'
import { FilterIcon } from '@shared-components/ctIcons'
import CustomSelect from '../customSelect'

const NameFilter = ({ formStyles, mobilefilter, filterData, handleFilterChange, handleClear }) => {
  const { control, reset } = useForm()

  const handleClearFilter = () => {
    reset({})
    handleClear()
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
        <Controller
          name="venue"
          control={control}
          render={({ field: { onChange, value = [] } }) => (
            <CustomSelect
              options={optionVenue}
              value={value}
              labelKey="sLabel"
              valueKey="sValue"
              placeholder="Select Venue"
              isClearable
              onChange={(e) => {
                onChange(e)
                handleFilterChange(e, 'venue')
              }}
            />
          )}
        />
      </div>
      <div className={`${formStyles?.formGroup} ${mobilefilter?.formGroup} ${styles?.formGroup} `}>
        <Form.Label className={`${formStyles?.label} d-block d-md-none`}>
          <Trans i18nKey="common:Team" />
        </Form.Label>
        <Controller
          name="team"
          control={control}
          render={({ field: { onChange, value = [] } }) => (
            <CustomSelect
              options={optionTeams}
              value={value}
              labelKey="sLabel"
              valueKey="sValue"
              placeholder="Select Team"
              isClearable
              onChange={(e) => {
                onChange(e)
                handleFilterChange(e, 'team')
              }}
            />
          )}
        />
      </div>
      <div className={`${formStyles?.formGroup} ${mobilefilter?.formGroup} ${styles?.formGroup} `}>
        <Form.Label className={`${formStyles?.label} d-block d-md-none`}>
          <Trans i18nKey="common:Series" />
        </Form.Label>
        <Controller
          name="series"
          control={control}
          render={({ field: { onChange, value = [] } }) => (
            <CustomSelect
              options={optionSeries}
              value={value}
              labelKey="sLabel"
              valueKey="sValue"
              placeholder="Select Series"
              isClearable
              onChange={(e) => {
                onChange(e)
                handleFilterChange(e, 'series')
              }}
            />
          )}
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
  handleScroll: PropTypes.func
}

export default NameFilter
