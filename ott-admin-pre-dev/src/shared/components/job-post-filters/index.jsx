import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'

import { parseParams } from 'shared/utils'
import { DESIGNATION_IN_JOB } from 'shared/constants'

function JobPostFilters({ filterChange }) {
  const { handleSubmit, setValue, control } = useForm({})
  const params = parseParams(location.search)

  useEffect(() => {
    if (params.eDesignationFilter) {
      const paramDesignation = DESIGNATION_IN_JOB.filter((d) => params.eDesignationFilter.includes(d.value) && d)
      setValue('eDesignationFilter', paramDesignation)
    }
  }, [])

  function onSubmit(data) {
    data.eDesignationFilter = data.eDesignationFilter ? data.eDesignationFilter.map((item) => item.value) : []
    filterChange({ data })
  }

  function onReset() {
    setValue('eDesignationFilter', '')
  }

  return (
    <Form className="user-filter" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="top-d-button">
        <Button variant="outline-secondary" type="reset" onClick={onReset} className="square me-2" size="sm">
          <FormattedMessage id="reset" />
        </Button>
        <Button variant="success" type="submit" className="square" size="sm">
          <FormattedMessage id="apply" />
        </Button>
      </div>
      <Form.Group className="form-group">
        <Form.Label>
          <FormattedMessage id="designation" />
        </Form.Label>
        <Controller
          name="eDesignationFilter"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              options={DESIGNATION_IN_JOB}
              isMulti
              isSearchable
              isClearable
              className="react-select"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>
    </Form>
  )
}
JobPostFilters.propTypes = {
  filterChange: PropTypes.func,
  defaultValue: PropTypes.array
}
export default JobPostFilters
