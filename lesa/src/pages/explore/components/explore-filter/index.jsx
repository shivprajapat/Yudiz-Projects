import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Button, Form, Dropdown } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'

import { filterIcon } from 'assets/images'
import { currencyOptions, mediaTypeOptions } from 'shared/constants'
import { getDirtyFormValues } from 'shared/utils'
import MultiRange from 'shared/components/multi-range'

const ExploreFilter = ({ handleFilterSubmit, handleSort, handleReset, params }) => {
  const sortBy = <FormattedMessage id="sortBy" />
  const selectMediaType = useIntl().formatMessage({ id: 'selectMediaType' })

  const [selectedDropDownItem, setSelectedDropDownItem] = useState(sortBy)
  const [filter, setFilter] = useState(false)
  const [values, setValues] = useState()

  const {
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields },
    setValue
  } = useForm({})

  useEffect(() => {
    if (params?.current?.minPrice || params?.current?.maxPrice) {
      setValues([Number(params?.current?.minPrice), Number(params?.current?.maxPrice)])
    } else {
      setValues([0, 1000000])
    }
    if (params?.current?.mediaType) {
      setValue(
        'mediaType',
        mediaTypeOptions?.filter((item) => item?.value === params.current?.mediaType)
      )
    }
    if (params?.current?.currencyType) {
      setValue(
        'currencyType',
        currencyOptions?.filter((item) => item?.value === params.current?.currencyType)
      )
    }
    if (params?.current?.sortOrder === '1') {
      setSelectedDropDownItem('Lowest to highest')
    } else if (params?.current?.sortOrder === '-1') {
      setSelectedDropDownItem('Highest to lowest')
    }
  }, [])

  const onSubmit = (data) => {
    const payload = getDirtyFormValues(dirtyFields, data)
    if (payload.mediaType) payload.mediaType = payload.mediaType.value
    if (payload.currencyType) {
      payload.currencyType = data.currencyType.value
    } else payload.currencyType = 'ETH'

    payload.minPrice = values[0]
    payload.maxPrice = values[1]
    handleFilterSubmit({ ...payload, page: 1 })
  }

  const resetFilter = () => {
    reset({ mediaType: '', currencyType: '' })
    setValues([0, 1000000])
    handleReset()
  }

  const sortAssets = (column, order) => {
    handleSort({ sortColumn: column, sortOrder: order, page: 1 })
  }

  const handleFilter = () => {
    setFilter(!filter)
  }
  const handleSetValues = (values) => {
    setValues(values)
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
              <Dropdown autoClose="outside" className="price-dropdown">
                <Dropdown.Toggle>
                  <FormattedMessage id="selectPriceRange" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item className="currency-dropdown">
                    <Controller
                      name="currencyType"
                      control={control}
                      defaultValue={currencyOptions[0]}
                      render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                          ref={ref}
                          value={value}
                          placeholder="Select Currency"
                          options={currencyOptions}
                          className="currency-select"
                          classNamePrefix="select"
                          onChange={(e) => {
                            onChange(e)
                          }}
                        />
                      )}
                    />
                  </Dropdown.Item>
                  <MultiRange values={values} handleSetValues={handleSetValues} />
                </Dropdown.Menu>
              </Dropdown>
              {/* For Availability dropdown */}
              {/* <Select className='react-select' classNamePrefix='select' placeholder='Select Availability' options={availabilityOptions} /> */}
              <Controller
                name="mediaType"
                control={control}
                render={({ field: { onChange, value = [], ref } }) => (
                  <Select
                    ref={ref}
                    value={value}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder={selectMediaType}
                    options={mediaTypeOptions}
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
      <div className="sort-dropdown">
        <Dropdown>
          <Dropdown.Toggle variant="success">{selectedDropDownItem}</Dropdown.Toggle>
          <Dropdown.Menu onClick={(e) => setSelectedDropDownItem(e.target.innerText)}>
            <Dropdown.Item onClick={() => sortAssets('sellingPrice', -1)} active={selectedDropDownItem === 'Highest to lowest'}>
              <FormattedMessage id="highestToLowest" />
            </Dropdown.Item>
            <Dropdown.Item onClick={() => sortAssets('sellingPrice', 1)} active={selectedDropDownItem === 'Lowest to highest'}>
              <FormattedMessage id="lowestToHighest" />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}
ExploreFilter.propTypes = {
  handleFilterSubmit: PropTypes.func,
  handleSort: PropTypes.func,
  handleReset: PropTypes.func,
  params: PropTypes.object
}
export default ExploreFilter
