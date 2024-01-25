import React, { useState } from 'react'
import Select from 'react-select'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { filterIcon } from 'assets/images'
import { dropFilterOptions } from 'shared/constants'

const DropFilter = ({ handleChangeFilter, handleReset }) => {
  const [filter, setFilter] = useState(false)

  const { handleSubmit, control, reset } = useForm({})

  const onSubmit = (data) => {
    handleChangeFilter(data?.type?.value)
  }

  const resetFilter = () => {
    reset({ type: '' })
    handleReset()
  }

  const handleFilter = () => {
    setFilter(!filter)
  }

  return (
    <div className="explore-filter d-flex" id="explore-filter">
      <div className={`filter d-flex ${filter && 'filter-style'}`}>
        <Button className="filter-btn d-flex align-items-center" onClick={handleFilter}>
          <img src={filterIcon} alt="filter-icon" className="img-fluid" />
          <span>
            <FormattedMessage id="filter" />
          </span>
        </Button>
        {filter && (
          <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className={`filter-block ${filter && 'active'}`}>
              <Controller
                name="type"
                control={control}
                render={({ field: { onChange, value = [], ref } }) => (
                  <Select
                    ref={ref}
                    value={value}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="select"
                    options={dropFilterOptions}
                    onChange={(e) => {
                      onChange(e)
                    }}
                  />
                )}
              />
              <div className="apply-clear-btns d-flex">
                <Button className="secondary-white-btn apply-btn flex-shrink-0" type="submit">
                  <FormattedMessage id="apply" />
                </Button>
                <Button className="secondary-white-border-btn clear-btn flex-shrink-0" onClick={() => resetFilter()}>
                  <FormattedMessage id="clear" />
                </Button>
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  )
}
DropFilter.propTypes = {
  handleChangeFilter: PropTypes.func,
  handleReset: PropTypes.func
}
export default DropFilter
