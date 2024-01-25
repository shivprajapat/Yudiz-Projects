import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import './style.scss'
import { validationErrors } from 'shared/constants/validationErrors'
import { createCommunity, updateCommunity } from 'modules/communities/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { uploadAsset } from 'modules/assets/redux/service'
import { updateToS3 } from 'shared/utils'

const AddEditCommunityModal = ({ show, handleClose, defaultValue, id }) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const resStatus = useSelector((state) => state.communities.resStatus)
  const resMessage = useSelector((state) => state.communities.resMessage)
  const assetUploadStore = useSelector((state) => state.asset.assetUpload)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    clearErrors
  } = useForm({ mode: 'all' })

  const logoField = watch('logoField.files')
  const name = watch('name')
  const description = watch('description')

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
      setPreSignUrl().then((res) => addEditCommunity(fileUrl))
    }
  }, [assetUploadStore])

  const onSubmit = () => {
    setLoading(true)
    if (logoField?.updated) {
      dispatch(uploadAsset({ fileName: logoField?.fileObject?.name }))
    } else {
      addEditCommunity()
    }
  }
  const addEditCommunity = (fileUrl) => {
    const formValues = { name: name, description: description }
    const payload = fileUrl ? { ...formValues, photo: fileUrl } : formValues

    if (id) {
      dispatch(
        updateCommunity(id, payload, () => {
          setLoading(false)
          handleClose()
        })
      )
    } else {
      dispatch(
        createCommunity(payload, () => {
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
      <Modal.Header>
        <Modal.Title>
          <FormattedMessage id="createCommunity" />
        </Modal.Title>
      </Modal.Header>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="nameOfCommunity" />
            </Form.Label>
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
              <FormattedMessage id="description" />
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
                    <FormattedMessage id="changeCommunityImage" />
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
AddEditCommunityModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  defaultValue: PropTypes.object,
  id: PropTypes.string
}

export default AddEditCommunityModal
