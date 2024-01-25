import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import { validationErrors } from 'shared/constants/validationErrors'

import './style.scss'
import LogisticsModal from './LogisticsModal'
import { updateManualLogistics } from 'modules/manualLogistics/redux/service'
import { useDispatch, useSelector } from 'react-redux'
import { updateToS3 } from 'shared/utils'
import { getPreSignedUrl } from 'shared/functions'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import Progressbar from './ProgressBar'
import { CLEAR_MANUAL_LOGISTICS_DATA } from 'modules/manualLogistics/redux/action'
import { filterOptions, validateAction } from '../utils'

const ManualLogistics = ({ order, getOrderDetails }) => {
  const [showSetManualModal, setshowSetManualModal] = useState(false)
  const [preview, setPreview] = useState(null)
  const [actionError, setActionError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [logisticsData, setLogisticsData] = useState(null)
  const [btnText, setButtonText] = useState('Set Manual Logistics')
  const logistcsUpdated = useSelector((state) => state.manualLogistics.logistcsUpdated)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const loggedInUserId = localStorage.getItem('userId')
  const logisticsOptions = filterOptions(order.sellerId === loggedInUserId ? 'seller' : 'buyer', order.status)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control
  } = useForm({
    mode: 'all'
  })

  useEffect(() => {
    setshowSetManualModal(false)
    setShowForm(false)
    setLoading(false)
    if (order.status >= 18 && order.status <= 27) {
      setButtonText('Update Logistics Status')
    }
    reset({
      action: '',
      image: '',
      dateTime: '',
      description: ''
    })
    setPreview(null)
  }, [order])

  useEffect(() => {
    if (logistcsUpdated) {
      getOrderDetails()
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Order logistics updated',
          type: TOAST_TYPE.Success
        }
      })
      dispatch({ type: CLEAR_MANUAL_LOGISTICS_DATA })
      setshowSetManualModal(false)
    }
  }, [logistcsUpdated])

  const toggleConfirmationModal = () => {
    setshowSetManualModal((prev) => !prev)
  }

  const handleConfirmation = () => {
    setLoading(true)
    const data = logisticsData
    let payload = {
      action: data.action.value,
      dateTime: data.dateTime || null,
      description: data.description
    }
    if (data.image[0]) {
      getPreSignedUrl({ fileName: data.image[0].name }).then((res) => {
        const fileType = data.image[0].name.split('.')[1]
        updateToS3(data.image[0], res.data.result.file.url)
          .then((res) => {
            payload = {
              ...payload,
              fileAwsUrl: res,
              fileType
            }
            dispatch(updateManualLogistics(order.id, payload))
          })
          .catch((err) => {
            dispatch({
              type: SHOW_TOAST,
              payload: {
                message: err?.message || validationErrors.serverError,
                type: TOAST_TYPE.Error
              }
            })
            toggleConfirmationModal()
            logisticsData(false)
          })
      })
    } else {
      dispatch(updateManualLogistics(order.id, payload))
    }
  }

  const handleActionChange = (onChange, e) => {
    if (e.value) {
      const action = e.value
      const validationResponse = validateAction(action, order.status)
      if (!validationResponse.isError) {
        setActionError('')
        onChange(e)
      } else {
        setActionError(validationResponse.errorMsg)
        onChange([])
      }
    }
  }

  const submitForm = (data) => {
    setLogisticsData(data)
    toggleConfirmationModal()
  }

  return (
    <>

      {order.status >= 18 && <Progressbar status={order.status} />}
      {((!showForm && order.sellerId === loggedInUserId && order.status === 9) || (!showForm && order.status >= 18 && order.status <= 27)) && order.status !== 26 && (
        <Row>
          <button className='logistics-button' onClick={() => setShowForm(true)}>{btnText}</button>
        </Row>
      )}

      <div className="manual-logistics">
        {showForm && (
          <>
            <Form onSubmit={handleSubmit((data) => submitForm(data))} autoComplete="off">
              <h4 className="form-heading">Manual Logistics Settings:</h4>
              <Row>
                <Col xl="12">
                  <Form.Group className="form-group dropD">
                    <Form.Label className="d-block">Update Action</Form.Label>
                    <Controller
                      name="action"
                      control={control}
                      rules={{ required: actionError !== '' ? actionError : validationErrors.required }}
                      render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                          ref={ref}
                          value={value}
                          placeholder="Select Logistics Status"
                          options={logisticsOptions}
                          className={`react-select ${errors.action && 'error'}`}
                          classNamePrefix="select"
                          onChange={(e) => {
                            handleActionChange(onChange, e)
                          }}
                        />
                      )}
                    />
                    {!errors.action && actionError !== '' && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {actionError}
                      </Form.Control.Feedback>
                    )}
                    {errors.action && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {actionError !== '' ? actionError : errors.action.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Form.Group className="form-group file-input-group" as={Col} xs="12" lg="6">
                  <div className="image-box">
                    {preview && <img src={preview} />}
                  </div>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="file-input"
                    {...register('image', {
                      validate: (value) => {
                        const file = value[0]
                        if (file) {
                          if (file.type.includes('image/')) {
                            setPreview(URL.createObjectURL(file))
                          } else {
                            setPreview(null)
                            setValue('image', null)
                            return 'File type not supported'
                          }
                        }
                      }
                    })}
                  />
                  <label className='upload-button' htmlFor="image">Upload image</label>
                  {errors.image && (
                    <Form.Control.Feedback type="invalid" className="invalidFeedback">
                      {errors.image.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Row>

              <Row>
                <Form.Group className="form-group" as={Col} lg="12">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    name="description"
                    placeholder="Enter Description"
                    {...register('description')}
                  />
                  {errors.description && (
                    <Form.Control.Feedback type="invalid" className="invalidFeedback">
                      {errors.description.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Row>

              <Row>
                <Col xl="12">
                  <Form.Group className="form-group">
                    <Form.Label className="d-block">Date and Time</Form.Label>
                    <Controller
                      name="dateTime"
                      control={control}
                      render={({ field: { onChange, value = '' } }) => (
                        <DatePicker
                          placeholderText="Select date and time"
                          selected={value}
                          onChange={(date) => {
                            onChange(date)
                          }}
                          className={`form-control ${errors.dateTime && 'error'}`}
                          popperPlacement="bottom"
                          dateFormat="yyyy-MM-dd HH:mm:ss"
                          showMonthDropdown
                          showYearDropdown
                          showTimeSelect
                          dropdownMode="select"
                          floatLabelType="Auto"
                        />
                      )}
                    />

                    {errors.dateTime && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.dateTime.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Button className="white-border-btn" disabled={loading} onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              &nbsp; &nbsp;
              <Button className="white-btn" type="submit" disabled={loading}>
                Save Update
              </Button>
            </Form>
            <LogisticsModal
              title={'Confirm logistics status ?'}
              show={showSetManualModal}
              handleClose={toggleConfirmationModal}
              payload={logisticsData}
              handleConfirmation={handleConfirmation}
              loading={loading}
            />
          </>
        )
        }
      </div>
    </>
  )
}

export default ManualLogistics

ManualLogistics.propTypes = {
  order: PropTypes.object,
  getOrderDetails: PropTypes.func
}
