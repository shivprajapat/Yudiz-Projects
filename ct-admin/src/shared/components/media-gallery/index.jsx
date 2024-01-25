import React, { useState } from 'react'
import { Button, Col, Modal, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import UploadFiles from './upload-files'
import MediaLibrary from './media-library'
import MediaFooter from './media-footer'
import { FormattedMessage } from 'react-intl'
import { FormProvider, useForm } from 'react-hook-form'

const MediaGallery = ({ show, handleHide, handleData, onSubmit, imageUrl }) => {
  const [tab, setTab] = useState('upload')
  const [singleImage, setSingleImage] = useState()
  const methods = useForm()
  const { handleSubmit, reset } = methods

  const handleTab = (value) => {
    setTab(value)
    setSingleImage('')
  }

  const handleImage = (data) => {
    imageUrl && imageUrl(data)
    setSingleImage(data)
    reset({
      sText: data?.sText,
      sCaption: data?.sCaption,
      sAttribute: data?.sAttribute
    })
  }

  const handleChoose = (data) => {
    handleData({
      ...data,
      sUrl: singleImage?.sUrl
    })
  }

  const handleTabs = () => {
    setTab('media')
  }
  return (
    <>
      <Modal
        className="media-modal"
        show={show}
        onHide={() => handleHide()}
        centered
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            <FormattedMessage id="addMedia" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul id="noanim-tab-example" className="data-table-tabs d-flex">
            <li className={tab === 'upload' ? 'active' : ''} onClick={() => handleTab('upload')}>
              <FormattedMessage id="uploadImage" />
            </li>
            <li className={tab === 'media' ? 'active' : ''} onClick={() => handleTab('media')}>
              <FormattedMessage id="mediaGallery" />
            </li>
          </ul>
          {tab === 'upload' ? (
            <UploadFiles handleTabs={handleTabs} />
          ) : (
            <FormProvider {...methods}>
              <Form>
                <MediaLibrary handleImage={handleImage} onSubmit={onSubmit} />
              </Form>
            </FormProvider>
          )}
        </Modal.Body>
        {tab === 'media' && (
          <Modal.Footer>
            <MediaFooter data={singleImage} reset={reset} />
            <Col xs={4} className="m-0 text-end">
              <Button onClick={handleSubmit(handleChoose)} size="md" variant="primary" type="submit" disabled={!singleImage}>
                <FormattedMessage id="choose" />
              </Button>
            </Col>
          </Modal.Footer>
        )}
      </Modal>
    </>
  )
}

MediaGallery.propTypes = {
  show: PropTypes.bool,
  handleHide: PropTypes.func,
  handleData: PropTypes.func,
  onSubmit: PropTypes.func,
  imageUrl: PropTypes.func
}

export default MediaGallery
