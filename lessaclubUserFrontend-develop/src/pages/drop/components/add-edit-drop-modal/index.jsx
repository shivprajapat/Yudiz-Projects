import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import DatePicker from 'react-datepicker'

import './style.scss'
import { validationErrors } from 'shared/constants/validationErrors'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { uploadAsset } from 'modules/assets/redux/service'
import { createDrop, updateDrop } from 'modules/drop/redux/service'
import { formatToIso, updateToS3 } from 'shared/utils'

const AddEditDropModal = ({ show, handleClose, defaultValue, id }) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const resStatus = useSelector((state) => state.drop.resStatus)
  const resMessage = useSelector((state) => state.drop.resMessage)
  const assetUploadStore = useSelector((state) => state.asset.assetUpload)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    clearErrors,
    control,
    getValues
  } = useForm({ mode: 'all' })

  const values = getValues()
  const logoField = watch('logoField.files')
  const name = watch('name')
  const description = watch('description')
  const startTime = watch('startTime')
  const endTime = watch('endTime')

  useEffect(() => {
    if (!resStatus && resMessage) {
      setLoading(false)
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (defaultValue) {
      reset({
        name: defaultValue?.name,
        description: defaultValue?.description
      })
      if (defaultValue?.photo) {
        setValue('logoField.files', { url: defaultValue?.photo })
        clearErrors('logoField')
      }
    } else {
      reset({})
    }
  }, [])

  useEffect(() => {
    if (assetUploadStore && assetUploadStore.file) {
      let fileUrl
      const setPreSignUrl = async () => {
        fileUrl = await updateToS3(logoField?.fileObject, assetUploadStore.file.url)
      }
      setPreSignUrl().then((res) => addEditDrop(fileUrl))
    }
  }, [assetUploadStore])

  const onSubmit = () => {
    setLoading(true)
    if (logoField?.updated) {
      dispatch(uploadAsset({ fileName: logoField?.fileObject?.name }))
    } else {
      addEditDrop()
    }
  }
  const addEditDrop = (fileUrl) => {
    const formValues = { name: name, description: description, startTime: formatToIso(startTime), endTime: formatToIso(endTime) }
    const payload = fileUrl ? { ...formValues, photo: fileUrl } : formValues

    if (id) {
      dispatch(
        updateDrop(id, payload, () => {
          setLoading(false)
          handleClose()
        })
      )
    } else {
      dispatch(
        createDrop(payload, () => {
          setLoading(false)
          handleClose()
        })
      )
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 105000000) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: <FormattedMessage id="PleaseUploadAFileSmallerThan100MB" />,
            type: TOAST_TYPE.Error
          }
        })
      } else {
        setValue('logoField.files', { fileObject: file, url: URL.createObjectURL(file), type: file.type.split('/')[1], updated: true })
        clearErrors('logoField')
      }
    }
  }

  const getEndTimeStatus = (time) => {
    if (time.getTime() < startTime.getTime()) {
      return false
    }
    return true
  }

  const getEndDatetatus = (time) => {
    if (time.getDate() < startTime.getDate()) {
      return false
    }
    return true
  }

  const filterPassedTime = (time) => {
    const currentDate = new Date()
    const selectedDate = new Date(time)

    return currentDate.getTime() < selectedDate.getTime()
  }

  return (
    <Modal
      show={show}
      backdrop="static"
      onHide={handleClose}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="communities-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create Drop</Modal.Title>
      </Modal.Header>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="form-group">
            <Form.Label>Name of Drop*</Form.Label>
            <Form.Control
              type="text"
              name="name"
              className={errors.name && 'error'}
              {...register('name', {
                required: validationErrors.required,
                maxLength: {
                  value: 20,
                  message: validationErrors.maxLength(20)
                }
              })}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.name.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="description" />*
            </Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              className={errors.description && 'error'}
              name="description"
              {...register('description', {
                required: validationErrors.required,
                maxLength: {
                  value: 30,
                  message: validationErrors.maxLength(30)
                }
              })}
            />
            {errors.description && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.description.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Row>
            <Col xl="6">
              <Form.Group className="form-group">
                <Form.Label className="d-block">
                  <FormattedMessage id="chooseStartTime" />*
                </Form.Label>
                <Controller
                  name="startTime"
                  control={control}
                  rules={{ required: validationErrors.required }}
                  render={({ field: { onChange, value = '' } }) => (
                    <DatePicker
                      placeholderText="Select start date and time"
                      selected={value || values?.startTime}
                      minDate={new Date()}
                      filterTime={filterPassedTime}
                      className={`form-control ${errors.startTime && 'error'}`}
                      popperPlacement="bottom"
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy HH:mm"
                      timeFormat="HH:mm"
                      onChange={(update) => {
                        onChange(update)
                      }}
                    />
                  )}
                />
                {errors.startTime && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.startTime.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col xl="6">
              <Form.Group className="form-group">
                <Form.Label className="d-block">
                  <FormattedMessage id="chooseEndTime" />*
                </Form.Label>
                <Controller
                  name="endTime"
                  control={control}
                  rules={{ required: validationErrors.required }}
                  render={({ field: { onChange, value = '' } }) => (
                    <DatePicker
                      placeholderText="Select end date and time"
                      selected={value || values?.endTime}
                      minDate={new Date(startTime)}
                      filterDate={getEndDatetatus}
                      filterTime={getEndTimeStatus}
                      className={`form-control ${errors.endTime && 'error'}`}
                      showTimeSelect
                      disabled={!startTime}
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy HH:mm"
                      timeFormat="HH:mm"
                      onChange={(update) => {
                        onChange(update)
                      }}
                    />
                  )}
                />
                {errors.endTime && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.endTime.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className="upload-box">
            <input
              type="file"
              name="logoField"
              id="logoField"
              accept="image/*"
              hidden
              {...register('logoField', { required: logoField ? false : validationErrors.required })}
              onChange={(e) => {
                handleImageChange(e)
              }}
            />
            {logoField?.url && (
              <>
                <div className="uploaded-file">
                  <img className="img" src={logoField?.url} alt="asset img" />
                </div>
                <div>
                  <label htmlFor="logoField" className="change-img-btn">
                    Change drop image
                  </label>
                </div>
              </>
            )}

            {!logoField?.url && (
              <div className="upload-desc">
                <label htmlFor="logoField" className="browse-btn">
                  <FormattedMessage id="browseFile" />
                </label>
                <span>
                  <FormattedMessage id="maxFileSize" />
                </span>
              </div>
            )}
          </div>
          {errors?.logoField && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.logoField?.message}
            </Form.Control.Feedback>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="secondary-white-border-btn" onClick={handleClose} disabled={loading}>
            <FormattedMessage id="close" />
          </Button>
          <Button className="white-btn" type="submit" disabled={loading}>
            {id ? <FormattedMessage id="update" /> : <FormattedMessage id="create" />}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
AddEditDropModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  defaultValue: PropTypes.object,
  id: PropTypes.string
}

export default AddEditDropModal
