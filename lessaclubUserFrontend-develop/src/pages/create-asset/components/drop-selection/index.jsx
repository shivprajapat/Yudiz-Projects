import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { validationErrors } from 'shared/constants/validationErrors'
import { userImg } from 'assets/images'
import { debounce } from 'shared/utils'
import { getDrops } from 'modules/drop/redux/service'

const DropSelection = ({ errors, control }) => {
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')

  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10, isExpired: false, createdBy: userId })
  const [drops, setDrops] = useState()
  const isBottomReached = useRef(false)
  const totalDrops = useRef(0)

  const dropStore = useSelector((state) => state.drop.getDrops)

  useEffect(() => {
    if (requestParams) {
      dispatch(getDrops(requestParams))
    }
  }, [requestParams])

  useEffect(() => {
    if (dropStore?.nftDrop) {
      totalDrops.current = dropStore?.metaData?.totalItems
      if (isBottomReached.current) {
        setDrops([...drops, ...dropStore?.nftDrop])
      } else {
        setDrops(dropStore?.nftDrop)
      }
    }
  }, [dropStore])

  const handleScroll = () => {
    if (totalDrops.current > requestParams.page * 10) {
      setRequestParams({ ...requestParams, page: requestParams.page + 1 })
      isBottomReached.current = true
    }
  }

  const optimizedSearch = debounce((txt, { action, prevInputValue }) => {
    if (action === 'input-change') {
      setRequestParams({ ...requestParams, name: txt, page: 1 })
    }
    if (action === 'set-value') {
      prevInputValue && setRequestParams({ ...requestParams, name: '', page: 1 })
    }
    if (action === 'menu-close') {
      prevInputValue && setRequestParams({ ...requestParams, name: '', page: 1 })
    }
  })

  const getDropFormattedLabel = (value) => {
    return (
      <div className="d-flex align-items-center">
        <img src={value?.photo || userImg} />
        <span className="select-name">{value?.name}</span>
      </div>
    )
  }

  return (
    <Form.Group className="form-group">
      <Form.Label>Drop</Form.Label>
      <Controller
        name="currentNftDropId"
        control={control}
        rules={{ required: validationErrors.required }}
        render={({ field: { onChange, value = [], ref } }) => (
          <Select
            value={value}
            ref={ref}
            className={`react-select ${errors?.currentNftDropId && 'error'}`}
            classNamePrefix="select"
            formatOptionLabel={getDropFormattedLabel}
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.name}
            isSearchable
            options={drops}
            noOptionsMessage={() => 'No drops available'}
            onMenuScrollToBottom={handleScroll}
            onInputChange={(value, action) => optimizedSearch(value, action)}
            onChange={(e) => {
              onChange(e)
            }}
          />
        )}
      />
      {errors?.currentNftDropId && (
        <Form.Control.Feedback type="invalid" className="invalidFeedback">
          {errors?.currentNftDropId?.message}
        </Form.Control.Feedback>
      )}
      {dropStore?.metaData?.totalItems === 0 && (
        <Form.Control.Feedback type="invalid" className="invalidFeedback">
          There are no drops available
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}
DropSelection.propTypes = {
  errors: PropTypes.object,
  control: PropTypes.object
}
export default DropSelection
