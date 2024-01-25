import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import { Form, Button, Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

import { TOAST_TYPE } from 'shared/constants'
import axios from 'shared/libs/axios'
import { useDispatch } from 'react-redux'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { setParamsForGetRequest } from 'shared/utils'
import { validationErrors } from 'shared/constants/validationErrors'

const ExportModal = ({ show, handleClose, title, requestParams, api }) => {
  const [loading, setLoading] = useState(false)
  const [radioCheckedVal, setRadioCheckedVal] = useState('')

  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })

  const onSubmit = async (data) => {
    let params

    if (!data.export) {
      return
    }

    setLoading(true)

    if (data.export === 'exportThisPage') {
      params = requestParams
    }

    if (data.export === 'exportFiltered') {
      params = requestParams
      delete params.fromDate
      delete params.toDate

      if (data?.fromDate) {
        params = { ...params, fromDate: data.fromDate, csvExport: true }
      }
      if (data?.toDate) {
        params = { ...params, toDate: data.toDate, csvExport: true }
      }
    }
    try {
      const response = await axios.get(`${api}${setParamsForGetRequest(params)}`)
      if (response.data) {
        setLoading(false)
        reset()
        handleClose()
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: 'Please download the current export from the download menu',
            type: TOAST_TYPE.Success
          }
        })
      }
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.message,
          type: TOAST_TYPE.Error
        }
      })
      setLoading(false)
      reset()
      handleClose()
    }
  }

  const radioChangehandler = (e) => {
    setRadioCheckedVal(e.target.value)
  }

  return (
    <Modal show={show} onHide={handleClose} centered className="user-create-modal">
      <Modal.Header style={{ border: 'none' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="form-group mb-4 admin-customers-radio">
            <Form.Label>Please select the type of export</Form.Label>
            <div className="d-flex gap-2 mb-1">
              <input
                type="radio"
                id="exportThisPage"
                name="export"
                className="customer-filter-radio"
                value="exportThisPage"
                {...register('export', {
                  required: false
                })}
                onChange={radioChangehandler}
                checked={radioCheckedVal === 'exportThisPage'}
              />
              <label htmlFor="exportThisPage">Only export the data of this page</label>
            </div>
            <div className="d-flex gap-2">
              <input
                type="radio"
                id="exportFiltered"
                name="export"
                className="customer-filter-radio"
                value="exportFiltered"
                {...register('export', {
                  required: false
                })}
                onChange={radioChangehandler}
                checked={radioCheckedVal === 'exportFiltered'}
              />
              <label htmlFor="exportFiltered">Export data between two dates</label>
            </div>
          </Form.Group>
          {radioCheckedVal === 'exportFiltered' ? (
            <>
              <Form.Group className="form-group">
                <Form.Label className="d-block">From Date</Form.Label>
                <Controller
                  name="fromDate"
                  control={control}
                  rules={{
                    required: validationErrors.required
                  }}
                  render={({ field: { onChange, value = '' } }) => (
                    <DatePicker
                      placeholderText="Select from date"
                      selected={value}
                      onChange={(update) => {
                        onChange(update)
                      }}
                      className={`form-control ${errors.fromDate && 'error'}`}
                      popperPlacement="bottom"
                      dateFormat="MMMM d, yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      floatLabelType="Auto"
                    />
                  )}
                />
                {errors?.fromDate && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors?.fromDate?.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="d-block">To Date</Form.Label>
                <Controller
                  name="toDate"
                  control={control}
                  rules={{
                    required: validationErrors.required
                  }}
                  render={({ field: { onChange, value = '' } }) => (
                    <DatePicker
                      placeholderText="Select to date"
                      selected={value}
                      onChange={(update) => {
                        onChange(update)
                      }}
                      className={`form-control ${errors.toDate && 'error'}`}
                      popperPlacement="bottom"
                      dateFormat="MMMM d, yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      floatLabelType="Auto"
                    />
                  )}
                />
                {errors?.toDate && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors?.toDate?.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button className="white-btn" type="submit" disabled={loading}>
            Export
          </Button>
          <Button
            className="white-border-btn"
            onClick={() => {
              reset({
                export: ''
              })
              setRadioCheckedVal(null)
              handleClose()
            }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
ExportModal.propTypes = {
  show: PropTypes.bool,
  requestParams: PropTypes.object,
  title: PropTypes.string,
  handleClose: PropTypes.func,
  api: PropTypes.string
}
export default ExportModal
