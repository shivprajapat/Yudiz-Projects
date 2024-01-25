import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'

import { getQueryVariable } from 'shared/utils'
import {
  currencyOptions,
  mediaTypeOptions,
  blockchainNetworkOptions,
  fileTypeOptions,
  categoryTypeOptions,
  assetTypeOptions
} from 'shared/constants'

const AssetFilter = ({ filterChange, requestParams, setRequestParams }) => {
  const { control, handleSubmit, reset, setValue, register } = useForm({ mode: 'onChange' })

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()
  const [radioCheckedVal, setRadioCheckedVal] = useState('')

  const defaultCategoryId = getQueryVariable('categoryId')
  const defaultMediaType = getQueryVariable('mediaType')
  const defaultFileType = getQueryVariable('fileType')
  const defaultCurrencyType = getQueryVariable('currencyType')
  const defaultBlockchainNetwork = getQueryVariable('blockchainNetwork')
  const defaultCreatedFromDate = getQueryVariable('createdFrom')
  const defaultCreatedToDate = getQueryVariable('createdTo')
  const defaultIsExclusive = getQueryVariable('isExclusive')
  const defaultIsPhysical = getQueryVariable('isPhysical')

  useEffect(() => {
    if (defaultIsPhysical) {
      setValue(
        'assetType',
        defaultIsPhysical === 'true' ? { value: 'physical', label: 'Physical' } : { value: 'digital', label: 'Digital' }
      )
    }

    if (defaultCreatedFromDate) {
      const dateStrArr = defaultCreatedFromDate.split('+')
      const dateFormat = `${dateStrArr.at(3)}-${dateStrArr.at(1)}-${dateStrArr.at(2)}`
      const jsDate = new Date(dateFormat)
      setValue('createdFromDate', jsDate)
    }

    if (defaultCreatedToDate) {
      const dateStrArr = defaultCreatedToDate.split('+')
      const dateFormat = `${dateStrArr.at(3)}-${dateStrArr.at(1)}-${dateStrArr.at(2)}`
      const jsDate = new Date(dateFormat)
      setValue('createdToDate', jsDate)
    }

    if (defaultCategoryId) {
      setValue(
        'categoryId',
        categoryTypeOptions.find((option) => option.value === Number(defaultCategoryId))
      )
    }

    if (defaultMediaType) {
      setValue(
        'mediaType',
        mediaTypeOptions.find((option) => option.value === defaultMediaType)
      )
    }

    if (defaultFileType) {
      setValue(
        'fileType',
        fileTypeOptions.find((option) => option.value === defaultFileType)
      )
    }

    if (defaultCurrencyType) {
      setValue(
        'currencyType',
        currencyOptions.find((option) => option.value === defaultCurrencyType)
      )
    }

    if (defaultBlockchainNetwork) {
      setValue(
        'blockchainNetwork',
        blockchainNetworkOptions.find((option) => option.value === defaultBlockchainNetwork)
      )
    }

    if (defaultIsExclusive !== null) {
      setRadioCheckedVal(defaultIsExclusive)
    }
  }, [])

  const onSubmit = (data) => {
    if (data.isExclusive) {
      const exclusiveAssetBoolean = data.isExclusive === 'true'
      data = { ...data, isExclusive: exclusiveAssetBoolean }
    }

    if (data.assetType) {
      const physicalAssetBoolean = data.assetType.value === 'physical'
      data = { ...data, isPhysical: physicalAssetBoolean }
    }

    delete data.assetType
    filterChange(data)
  }

  const onReset = () => {
    reset({
      categoryId: '',
      mediaType: '',
      fileType: '',
      currencyType: '',
      blockchainNetwork: '',
      isExclusive: '',
      createdFromDate: '',
      assetType: ''
    })
    setSearchParams('')
    setRequestParams({ page: 1, perPage: 10 })
    setRadioCheckedVal(null)
  }

  const radioChangehandler = (e) => {
    setRadioCheckedVal(e.target.value)
  }

  return (
    <Form className="customer-filter" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="top-d-button">
        <Button className="white-btn me-2" type="reset" onClick={onReset}>
          Reset
        </Button>
        <Button className="white-btn" type="submit">
          Apply
        </Button>
      </div>
      <Form.Group className="form-group mb-4">
        <Form.Label>Category</Form.Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={categoryTypeOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group mb-4">
        <Form.Label>Media Type</Form.Label>
        <Controller
          name="mediaType"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={mediaTypeOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group mb-4">
        <Form.Label>Asset Type</Form.Label>
        <Controller
          name="assetType"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={assetTypeOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group mb-4">
        <Form.Label>File Type</Form.Label>
        <Controller
          name="fileType"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={fileTypeOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group mb-4">
        <Form.Label>Currency Type</Form.Label>
        <Controller
          name="currencyType"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={currencyOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group mb-4">
        <Form.Label>Blockchain Network</Form.Label>
        <Controller
          name="blockchainNetwork"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={blockchainNetworkOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label className="d-block">Created Date(From)</Form.Label>
        <Controller
          name="createdFromDate"
          control={control}
          rules={{
            required: false
          }}
          render={({ field: { onChange, value = '' } }) => (
            <DatePicker
              placeholderText="Select created date of the asset"
              selected={value}
              onChange={(update) => {
                onChange(update)
              }}
              className="form-control"
              popperPlacement="bottom"
              dateFormat="MMMM d, yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              floatLabelType="Auto"
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label className="d-block">Created Date(To)</Form.Label>
        <Controller
          name="createdToDate"
          control={control}
          rules={{
            required: false
          }}
          render={({ field: { onChange, value = '' } }) => (
            <DatePicker
              placeholderText="Select created date of the asset"
              selected={value}
              onChange={(update) => {
                onChange(update)
              }}
              className="form-control"
              popperPlacement="bottom"
              dateFormat="MMMM d, yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              floatLabelType="Auto"
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group mb-4 admin-customers-radio">
        <Form.Label>Exclusive Assets</Form.Label>
        <div className="d-flex gap-2 mb-1">
          <input
            type="radio"
            id="exclusive"
            name="isExclusive"
            className="customer-filter-radio"
            value={true}
            {...register('isExclusive', {
              required: false
            })}
            onChange={radioChangehandler}
            checked={radioCheckedVal === 'true'}
          />
          <label htmlFor="exclusive">Show exclusive assets only</label>
        </div>
        <div className="d-flex gap-2">
          <input
            type="radio"
            id="nonExclusive"
            name="isExclusive"
            className="customer-filter-radio"
            value={false}
            {...register('isExclusive', {
              required: false
            })}
            onChange={radioChangehandler}
            checked={radioCheckedVal === 'false'}
          />
          <label htmlFor="nonExclusive">Show multi chain assets only</label>
        </div>
      </Form.Group>
    </Form>
  )
}
AssetFilter.propTypes = {
  filterChange: PropTypes.func,
  requestParams: PropTypes.object,
  setRequestParams: PropTypes.func
}

export default AssetFilter
