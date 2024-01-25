import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import ArticleTab from 'shared/components/article-tab'
import ImageEditor from 'shared/components/image-editor'
import { getImgURL } from 'shared/utils'
import MediaGallery from 'shared/components/media-gallery'
import { S3_PREFIX } from 'shared/constants'
import useModal from 'shared/hooks/useModal'
// import { validationErrors } from 'shared/constants/ValidationErrors'

function DifferentThumbnail({ register, setValue, onDelete, articleData, disabled, values, errors, clearErrors }) {
  const [image, setImage] = useState()
  const [show, setShow] = useState(false)
  const { isShowing, toggle } = useModal()
  const [imageSUrl, setImageSUrl] = useState()
  const [file, setFile] = useState(null)
  const inputRef = useRef()

  function handleImageChange(e) {
    if (e.target.files.length) {
      setFile(e.target.files[0])
      setShow(true)
    }
  }

  function deleteImg() {
    setImage('')
    setValue('oTImg.sUrl', '')
    setValue('oTImg.fSUrl', '')
    onDelete('oTImg')
  }

  useEffect(() => {
    if (articleData && articleData?.oTImg?.sUrl && !values?.oTImg?.fSUrl?.length) setImage(getImgURL(articleData.oTImg.sUrl))
  }, [articleData])

  // const thumbnail = register('oTImg.fSUrl', { required: values?.oTImg?.sUrl ? false : validationErrors.required })
  const thumbnail = register('oTImg.fSUrl')
  function onConfirm(croppedFile) {
    const file = [croppedFile]
    setValue('oTImg.fSUrl.files', file)
    clearErrors('oTImg.fSUrl')
    setImage(URL.createObjectURL(croppedFile))
    inputRef.current.value = ''
  }
  function onCompleted(type) {
    setFile(null)
    if (type === 'close') inputRef.current.value = ''
  }

  const imageUrl = (data) => {
    setImageSUrl(data?.sUrl)
  }

  const handleData = (data) => {
    setValue('oTImg.sText', data.sText)
    setValue('oTImg.sCaption', data.sCaption)
    setValue('oTImg.sAttribute', data.sAttribute)
    setValue('oTImg.sUrl', imageSUrl)
    clearErrors('oTImg.fSUrl')
    setImage(S3_PREFIX + imageSUrl)
    toggle()
  }

  return (
    <>
      <ImageEditor
        file={file}
        show={show}
        aspectRatio={16 / 10}
        setShow={setShow}
        onConfirmProp={(croppedFile) => {
          onConfirm(croppedFile)
        }}
        onCompleted={(t) => onCompleted(t)}
      />
      <ArticleTab title={useIntl().formatMessage({ id: 'differentThumbnail' })} event={1}>
        <div className="f-image d-flex align-items-center justify-content-center">
          <input type="hidden" name="oTImg.sUrl" {...register('oTImg.sUrl')} />
          <input
            type="file"
            name="oTImg.fSUrl"
            id="DifferentThumbnail"
            hidden
            {...thumbnail}
            ref={inputRef}
            onChange={(e) => {
              handleImageChange(e)
            }}
            disabled={disabled}
          />
          {image && <img src={image} alt="Different Thumbnail" />}
          {!image && (
            <div>
              <label htmlFor="DifferentThumbnail" className={disabled ? 'disabled' : ''}>
                <i className="icon-upload" />
                <FormattedMessage id="uploadImage" />
              </label>
              {/* FOR PHASE 2 */}
              <span className="or d-block">
                <FormattedMessage id="or" />
              </span>
              <Button size="sm" variant="primary" disabled={disabled} onClick={() => toggle()}>
                <FormattedMessage id="mediaGallery" />
              </Button>
            </div>
          )}
          <MediaGallery show={isShowing} handleHide={toggle} handleData={handleData} imageUrl={imageUrl} />
        </div>
        {image && (
          <div className="change-img-btn">
            <Button variant="outline-secondary" size="sm" onClick={deleteImg} disabled={disabled}>
              <FormattedMessage id="deleteImage" />
            </Button>
            {/* FOR PHASE 2 */}
            {/* <Button variant="outline-secondary" size="sm" disabled={disabled}>
              <FormattedMessage id="photoEditor" />
            </Button>
            <Button variant="outline-secondary" size="sm" disabled={disabled}>
              <FormattedMessage id="clearFocusPoint" />
            </Button> */}
            <label className={`btn btn-outline-secondary btn-sm ${disabled ? 'disabled' : ''}`} onClick={() => toggle()}>
              <FormattedMessage id="replaceImage" />
            </label>
          </div>
        )}
        {errors?.oTImg?.fSUrl && <Form.Control.Feedback type="invalid">{errors?.oTImg?.fSUrl.message}</Form.Control.Feedback>}
        <Form.Group className="form-group">
          <Form.Label>
            <FormattedMessage id="altText" />
          </Form.Label>
          <Form.Control
            type="text"
            name="oTImg.sText"
            className={errors?.oTImg?.sText && 'error'}
            {...register('oTImg.sText')}
            disabled={disabled}
          />
          {errors?.oTImg?.sText && <Form.Control.Feedback type="invalid">{errors?.oTImg?.sText.message}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>
            <FormattedMessage id="caption" />
          </Form.Label>
          <Form.Control
            as="textarea"
            name="oTImg.sCaption"
            className={errors?.oTImg?.sCaption && 'error'}
            {...register('oTImg.sCaption')}
            disabled={disabled}
          />
          {errors?.oTImg?.sCaption && <Form.Control.Feedback type="invalid">{errors?.oTImg?.sCaption.message}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>
            <FormattedMessage id="attribution" />
          </Form.Label>
          <Form.Control
            as="textarea"
            name="oTImg.sAttribute"
            className={errors?.oTImg?.sAttribute && 'error'}
            {...register('oTImg.sAttribute')}
            disabled={disabled}
          />
          {errors?.oTImg?.sAttribute && <Form.Control.Feedback type="invalid">{errors?.oTImg?.sAttribute.message}</Form.Control.Feedback>}
        </Form.Group>
      </ArticleTab>
    </>
  )
}
DifferentThumbnail.propTypes = {
  register: PropTypes.func,
  setValue: PropTypes.func,
  onDelete: PropTypes.func,
  articleData: PropTypes.object,
  values: PropTypes.object,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  clearErrors: PropTypes.func
}
export default DifferentThumbnail
