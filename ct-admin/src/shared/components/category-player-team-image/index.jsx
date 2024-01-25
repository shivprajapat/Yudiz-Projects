import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import { S3_PREFIX } from 'shared/constants'
import CategoryPlayerTeamTab from '../category-player-team-tab'
import ImageEditor from '../image-editor'
import MediaGallery from 'shared/components/media-gallery'
import useModal from 'shared/hooks/useModal'
import CommonInput from '../common-input'

function CategoryPlayerTeamImage({ register, setValue, onDelete, values, errors, data, clearErrors }) {
  const [image, setImage] = useState()
  const [show, setShow] = useState(false)
  const [file, setFile] = useState(null)
  const [imageSUrl, setImageSUrl] = useState()
  const { isShowing, toggle } = useModal()
  const thumbnail = register('oImg.fSUrl')
  const inputRef = useRef()

  useEffect(() => {
    if (data) {
      if (!values?.oImg?.fSUrl?.length && data?.oImg?.sUrl) setImage(`${S3_PREFIX}${data.oImg.sUrl}`)
    }
  }, [data])

  function handleImageChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setShow(true)
    }
  }

  function deleteImg() {
    setImage('')
    setValue('oImg.sUrl', '')
    setValue('oImg.fSUrl', '')
    onDelete('oImg')
  }

  function onConfirm(croppedFile) {
    const file = [croppedFile]
    setValue('oImg.fSUrl.files', file)
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

      <CategoryPlayerTeamTab title={useIntl().formatMessage({ id: 'featuredImage' })} event={1}>
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
          />
          {image && <img src={image} alt="Featured Image" />}
          {!image && (
            <div>
              <label htmlFor="featureImg">
                <i className="icon-upload" />
                <FormattedMessage id="uploadImage" />
              </label>
              {/* FOR PHASE 2 */}
              <span className="or d-block">
                <FormattedMessage id="or" />
              </span>
              <Button size="sm" variant="primary" onClick={() => toggle()}>
                <FormattedMessage id="mediaGallery" />
              </Button>
            </div>
          )}
          <MediaGallery show={isShowing} handleHide={toggle} handleData={handleData} imageUrl={imageUrl} />
        </div>
        {image && (
          <div className="change-img-btn">
            <Button variant="outline-secondary" size="sm" onClick={deleteImg}>
              <FormattedMessage id="delete" />
            </Button>
            {/* FOR PHASE 2 */}
            {/* <Button variant="outline-secondary" size="sm">
              <FormattedMessage id="photoEditor" />
            </Button>
            <Button variant="outline-secondary" size="sm">
              <FormattedMessage id="clearFocusPoint" />
            </Button> */}
            <label className="btn btn-outline-secondary btn-sm" onClick={() => toggle()}>
              <FormattedMessage id="replaceImage" />
            </label>
          </div>
        )}
        <CommonInput
          type="text"
          register={register}
          errors={errors}
          className={`form-control ${errors?.oImg?.sText && 'error'}`}
          name="oImg.sText"
          label="altText"
        />
        <CommonInput
          type="textarea"
          register={register}
          errors={errors}
          className={`form-control ${errors?.oImg?.sCaption && 'error'}`}
          name="oImg.sCaption"
          label="caption"
        />
        <CommonInput
          type="textarea"
          register={register}
          errors={errors}
          className={`form-control ${errors?.oImg?.sAttribute && 'error'}`}
          name="oImg.sAttribute"
          label="attribution"
        />
      </CategoryPlayerTeamTab>
    </>
  )
}
CategoryPlayerTeamImage.propTypes = {
  register: PropTypes.func,
  setValue: PropTypes.func,
  onDelete: PropTypes.func,
  articleData: PropTypes.object,
  values: PropTypes.object,
  errors: PropTypes.object,
  data: PropTypes.object,
  clearErrors: PropTypes.func
}
export default CategoryPlayerTeamImage
