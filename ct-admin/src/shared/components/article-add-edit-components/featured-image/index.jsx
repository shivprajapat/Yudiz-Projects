import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import ArticleTab from 'shared/components/article-tab'
import DifferentThumbnail from '../different-thumbnail'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { removeTypeName, getImgURL } from 'shared/utils'
import ImageEditor from 'shared/components/image-editor'
import MediaGallery from 'shared/components/media-gallery'
import { S3_PREFIX } from 'shared/constants'
import useModal from 'shared/hooks/useModal'
import CommonInput from 'shared/components/common-input'

function FeaturedImage({ register, setValue, onDelete, articleData, disabled, values, errors, clearErrors, reset }) {
  const [image, setImage] = useState()
  const [isThumbnailVisible, setIsThumbnailVisible] = useState(false)
  const { isShowing, toggle } = useModal()
  const [show, setShow] = useState(false)
  const [imageSUrl, setImageSUrl] = useState()
  const [file, setFile] = useState(null)
  const inputRef = useRef()

  function handleImageChange(e) {
    if (e.target.files.length) {
      setFile(e.target.files[0])
      setShow(true)
    }
  }

  function handleThumbnail(e) {
    setIsThumbnailVisible(!isThumbnailVisible)
  }

  function deleteImg() {
    setImage('')
    setValue('oImg.sUrl', '')
    setValue('oImg.fSUrl', '')
    onDelete('oImg')
  }

  useEffect(() => {
    if (articleData) {
      if (!values?.oImg?.fSUrl?.length && articleData?.oImg?.sUrl) setImage(getImgURL(articleData.oImg.sUrl))
      if (articleData.oTImg) {
        !Object.values(removeTypeName(articleData.oTImg)).every((x) => x === null || x === '') && setIsThumbnailVisible(true)
      }
    }
  }, [articleData])
  const thumbnail = register('oImg.fSUrl', { required: values?.oImg?.sUrl ? false : validationErrors.required })
  function onConfirm(croppedFile) {
    const file = [croppedFile]
    setValue('oImg.fSUrl.files', file)
    clearErrors('oImg.fSUrl')
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
    setValue('oImg.sText', data.sText)
    setValue('oImg.sCaption', data.sCaption)
    setValue('oImg.sAttribute', data.sAttribute)
    setValue('oImg.sUrl', imageSUrl)
    clearErrors('oImg.fSUrl')
    setImage(S3_PREFIX + imageSUrl)
    toggle()
  }

  return (
    <>
      <ImageEditor
        file={file}
        aspectRatio={16 / 10}
        show={show}
        setShow={setShow}
        onConfirmProp={(croppedFile) => {
          onConfirm(croppedFile)
        }}
        onCompleted={(e) => onCompleted(e)}
      />
      <ArticleTab title={useIntl().formatMessage({ id: 'featuredImage' })} event={1}>
        <div className="f-image d-flex align-items-center justify-content-center">
          <input type="hidden" name="oImg.sUrl" {...register('oImg.sUrl')} />
          <input
            type="file"
            name="oImg.fSUrl"
            id="featureImg"
            hidden
            {...thumbnail}
            ref={inputRef}
            onChange={(e) => {
              handleImageChange(e)
            }}
            disabled={disabled}
          />
          {image && <img src={image} alt="Featured Image" />}
          {!image && (
            <div>
              <label htmlFor="featureImg" className={disabled ? 'disabled' : ''}>
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
            <Button variant="outline-secondary" disabled={disabled} size="sm" onClick={deleteImg}>
              <FormattedMessage id="deleteImage" />
            </Button>
            {/* FOR PHASE 2 */}
            {/* <Button variant="outline-secondary" disabled={disabled} size="sm">
              <FormattedMessage id="photoEditor" />
            </Button>
            <Button variant="outline-secondary" disabled={disabled} size="sm">
              <FormattedMessage id="clearFocusPoint" />
            </Button> */}
            <label className={`btn btn-outline-secondary btn-sm ${disabled ? 'disabled' : ''}`} onClick={() => toggle()}>
              <FormattedMessage id="replaceImage" />
            </label>
          </div>
        )}
        {errors?.oImg?.fSUrl && <Form.Control.Feedback type="invalid">{errors?.oImg?.fSUrl.message}</Form.Control.Feedback>}
        <CommonInput
          type="text"
          register={register}
          errors={errors}
          className={`form-control ${errors?.oImg?.sText && 'error'}`}
          name="oImg.sText"
          label="altText"
          disabled={disabled}
          required
        />
        <CommonInput
          type="textarea"
          register={register}
          errors={errors}
          className={`form-control ${errors?.oImg?.sCaption && 'error'}`}
          name="oImg.sCaption"
          label="caption"
          disabled={disabled}
          required
        />
        <CommonInput
          type="textarea"
          register={register}
          errors={errors}
          className={`form-control ${errors?.oImg?.sAttribute && 'error'}`}
          name="oImg.sAttribute"
          label="attribution"
          disabled={disabled}
          required
        />
        <Form.Check
          type="checkbox"
          label={useIntl().formatMessage({ id: 'setDifferentThumbnail' })}
          id="Thumbnail"
          className="mb-0"
          checked={isThumbnailVisible}
          onChange={handleThumbnail}
          disabled={disabled}
        />
      </ArticleTab>
      {isThumbnailVisible && (
        <DifferentThumbnail
          register={register}
          setValue={setValue}
          onDelete={onDelete}
          articleData={articleData}
          disabled={disabled}
          values={values}
          errors={errors}
          clearErrors={clearErrors}
        />
      )}
    </>
  )
}
FeaturedImage.propTypes = {
  register: PropTypes.func,
  setValue: PropTypes.func,
  onDelete: PropTypes.func,
  articleData: PropTypes.object,
  values: PropTypes.object,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  clearErrors: PropTypes.func,
  reset: PropTypes.func
}
export default FeaturedImage
