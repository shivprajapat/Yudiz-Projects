import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

import Drawer from '../drawer'
import { validationErrors } from 'shared/constants/ValidationErrors'

function DateFilter({ headerEvent, setIsFilterOpen, setIsFilter, isFilterOpen }) {
  const [filterDate, setFilterDate] = useState({ dFetchStart: '', dFetchEnd: '' })
  const {
    register,
    getValues,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: 'all'
  })

  function handleDate(e) {
    setFilterDate({ ...filterDate, [e.target.name]: e.target.value })
  }

  function applyFilter() {
    setIsFilter(true)
    setIsFilterOpen(false)
    headerEvent('filter', getValues())
  }

  function resetFilter() {
    reset({
      dFetchStart: '',
      dFetchEnd: ''
    })
    setIsFilter(false)
    setFilterDate({ dFetchStart: '', dFetchEnd: '' })
    headerEvent('filter', getValues())
  }
  return (
    <div>
      <Drawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(!isFilterOpen)} title={useIntl().formatMessage({ id: 'filter' })}>
        <Form onSubmit={handleSubmit(applyFilter)} autoComplete='off'>
          <Form.Group className='form-group'>
            <Form.Label>
              <FormattedMessage id='from' />
            </Form.Label>
            <Form.Control
              name='dFetchStart'
              type='date'
              className={errors.dFetchStart && 'error'}
              {...register('dFetchStart', {
                required: validationErrors.required
              })}
              onChange={(e) => handleDate(e)}
            />
            {errors.dFetchStart && <Form.Control.Feedback type='invalid'>{errors.dFetchStart.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group className='form-group'>
            <Form.Label>
              <FormattedMessage id='to' />
            </Form.Label>
            <Form.Control
              name='dFetchEnd'
              type='date'
              className={errors.dFetchEnd && 'error'}
              onChange={(e) => handleDate(e)}
              {...register('dFetchEnd', {
                required: validationErrors.required
              })}
              min={filterDate.dFetchStart}
            />
            {errors.dFetchEnd && <Form.Control.Feedback type='invalid'>{errors.dFetchEnd.message}</Form.Control.Feedback>}
          </Form.Group>
          <div className='filter-btn-container'>
            <Button className='common-btn' onClick={() => resetFilter()}>
              <FormattedMessage id='reset' />
            </Button>
            <Button className='common-btn' variant='primary' type='submit'>
              <FormattedMessage id='apply' />
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  )
}
DateFilter.propTypes = {
  headerEvent: PropTypes.func,
  setIsFilterOpen: PropTypes.func,
  setIsFilter: PropTypes.func,
  isFilterOpen: PropTypes.bool
}
export default DateFilter
