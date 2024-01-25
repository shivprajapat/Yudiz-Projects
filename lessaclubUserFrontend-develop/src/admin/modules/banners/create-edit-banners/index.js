/* eslint-disable multiline-ternary */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { validationErrors } from 'shared/constants/validationErrors'
import { URL_REGEX } from 'shared/constants'

const CreateEditBanners = (props) => {
  const { show, handleClose, onSubmit, loading, handleImageChange, bannerData } = props
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ mode: 'all' })

  useEffect(() => {
    setValue('logoField', bannerData.bannerImageURL)
    setValue('bannerLink', bannerData?.bannerLink)
  }, [bannerData])
  return (
    <Modal
      show={show}
      backdrop="static"
      onHide={handleClose}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="create-edit-ad"
    >
      <Modal.Header closeButton>
        <Modal.Title>{bannerData.id ? 'Update Banner' : 'Create Banner'}</Modal.Title>
      </Modal.Header>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="upload-box">
            <input
              type="file"
              name="logoField"
              id="logoField"
              accept="image/*"
              hidden
              {...register('logoField', {
                validate: value => {
                  if (!value) {
                    return validationErrors.required
                  }
                }
              })}
              onChange={handleImageChange}
            />
            {
              bannerData.bannerImageURL
                ? <>
                  <div className="uploaded-file">
                    <img className="img" src={bannerData.bannerImageURL} alt="asset img" loading='lazy' />
                  </div>
                  <div>
                    <label htmlFor="logoField" className="change-img-btn">
                      Change banner image
                    </label>
                  </div>
                </>
                : <div className="upload-desc">
                  <span>
                    <FormattedMessage id="dragAndDropFilesHereToUpload" />
                  </span>
                  <label htmlFor="logoField" className="browse-btn">
                    <FormattedMessage id="browseFile" />
                  </label>
                  <div className='d-flex flex-column'>
                    <span>
                      <FormattedMessage id="maxFileSize" />
                    </span>
                    <span>
                      Preferred dimensions - 2400 * 1600
                    </span>
                  </div>
                </div>
            }
          </div>
          {errors?.logoField && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.logoField?.message}
            </Form.Control.Feedback>
          )}
          <Form.Group className="form-group mt-2">
            <Form.Label>Target Link*</Form.Label>
            <Form.Control
              type="text"
              name="bannerLink"
              className={errors.bannerLink && 'error'}
              {...register('bannerLink', {
                required: validationErrors.required,
                pattern: { value: URL_REGEX, message: validationErrors.url }
              })}
            />
            {errors.bannerLink && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.bannerLink.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="secondary-white-border-btn" onClick={handleClose} disabled={loading}>
            <FormattedMessage id="close" />
          </Button>
          <Button className="white-btn" type="submit" disabled={loading}>
            <FormattedMessage id={bannerData.id ? 'update' : 'create'} />
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default CreateEditBanners

CreateEditBanners.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  onSubmit: PropTypes.func,
  handleImageChange: PropTypes.func,
  bannerData: PropTypes.object,
  loading: PropTypes.bool
}
