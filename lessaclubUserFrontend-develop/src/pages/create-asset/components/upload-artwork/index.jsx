import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Collapse, Form } from 'react-bootstrap'
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom'

import { GlbViewer } from 'modules/3DFiles'
import { validationErrors } from 'shared/constants/validationErrors'
import useDragAndDrop from 'shared/hooks/use-drag-and-drop'
import { InfoIcon, FileZipIcon } from 'assets/images/icon-components/icons'

const UploadArtwork = ({
  stepOneField,
  handleArtworkChange,
  handleThumbnailChange,
  artworkMediaType,
  thumbnailArtworkMediaType,
  artwork,
  thumbnailArtwork,
  stepOneErrors,
  setArtwork,
  setThumbnailArtwork,
  assetFile,
  assetFileSize,
  handle3DAssetsChange,
  threeDAssetData = {}
}) => {
  const { id, type } = useParams()
  const [isThreeD, setIsThreeD] = useState(false)
  const { dropRef, isDragging } = useDragAndDrop(handleArtworkChange, id)
  const { dropRef: thumbnailDropRef, isDragging: isThumbnailDragging } = useDragAndDrop(handleThumbnailChange, id)
  const addImage = stepOneField('addImage', { required: (artworkMediaType || isThreeD) ? false : validationErrors.required })

  const { dropRef: threeDThumbnailDropRef, isThreeDThumbnailDragging } = useDragAndDrop(handle3DAssetsChange, id)
  const { dropRef: threeDPreviewDropRef, isDragging: isThreeDPreviewDragging } = useDragAndDrop(handle3DAssetsChange, id)
  const { dropRef: threeDOriginalDropRef, isDragging: isThreeDOriginalDragging } = useDragAndDrop(handle3DAssetsChange, id)

  const threeDThumbnail = stepOneField('threeDThumbnail', { required: isThreeD ? validationErrors.required : false })
  const threeDPreview = stepOneField('threeDPreview', { required: isThreeD ? validationErrors.required : false })
  const threeDOriginal = stepOneField('threeDOriginal', { required: isThreeD ? validationErrors.required : false })

  const isThumbnailRequired = () => {
    if (!assetFile) {
      return false
    }
    if (assetFile?.type.includes('image') && assetFile?.size < 30000000) {
      return false
    }
    if (!thumbnailArtwork && type === 'resell') {
      return false
    }
    if (thumbnailArtwork) {
      return false
    }
    return validationErrors.required
  }

  const addThumbnail = stepOneField('addThumbnail', { required: isThumbnailRequired() })

  const {
    threeDThumbnailObjUrl,
    threeDThumbnailMediaType,
    threeDPreviewObjUrl,
    threeDPreviewMediaType,
    threeDOriginalObjUrl,
    threeDOriginalMediaType
  } = threeDAssetData

  const handleThreeDChange = () => {
    setIsThreeD(!isThreeD)
    setArtwork(null)
    setThumbnailArtwork(null)
  }

  return (
    <>
      <div className="upload-artwork-title">
        <h6 className="text-capitalize">
          <FormattedMessage id={type ? 'artwork' : 'uploadArtwork'} />
        </h6>
        {!type && (
          <p>
            <FormattedMessage id="assetMediaTypes" />
          </p>
        )}
      </div>

      {type !== 'resell' && (
        <div className="form-check pt-4 pb-2 text-warning">
          <Form.Check
            id="checkGltf"
            onChange={handleThreeDChange}
            checked={isThreeD}
            aria-controls="example-collapse-text"
            aria-expanded={isThreeD}
          />
          <label className="form-check-label mt-1 font-label" htmlFor="checkGltf">
            Please check here if you are uploading a GLTF(3D)/GLB(3D) file.
          </label>
        </div>
      )}

      <Collapse in={isThreeD}>
        <div id="example-collapse-text">
          <div className="alert alert-dark d-flex align-items-start gap-2">
            <div className="d-none d-md-block">
              <InfoIcon />
            </div>
            Please add a thumbnail for your 3D asset.&nbsp; If you are uploading a GLTF file, please make sure to upload it as ZIP. &nbsp;
            We will be happy to convert it to GLB for you.
          </div>
          <div className="upload-box" ref={threeDThumbnailDropRef} style={{ border: `${isThreeDThumbnailDragging ? '2px dashed #C7FFBD' : ''}` }}>
            <input
              style={{ display: 'none' }}
              type="file"
              name="threeDThumbnail"
              id="threeDThumbnail"
              accept="image/*"
              {...threeDThumbnail}
              onChange={(e) => {
                handle3DAssetsChange({ event: e, isDrag: false, sizeLimit: 10500000 })
              }}
            />
            {threeDThumbnailObjUrl && threeDThumbnailMediaType && (
              <div className="uploaded-file">
                <img className="img" src={threeDThumbnailObjUrl} alt="asset img" />
              </div>
            )}
            {!threeDThumbnailObjUrl && (
              <div className="upload-desc">
                <h6>
                  <FormattedMessage id="dragAndDropFilesHereToUpload" />
                </h6>
                <label htmlFor="threeDThumbnail" className="browse-btn">
                  Browse Thumbnail
                </label>
                <span>
                  <FormattedMessage id="maxThumbnailSize" />
                </span>
              </div>
            )}

            {threeDThumbnailObjUrl && !id && (
              <div>
                <label htmlFor="threeDThumbnail" className="change-img-btn">
                  Change Thumbnail
                </label>
              </div>
            )}
          </div>
          <div className="upload-box" ref={threeDPreviewDropRef} style={{ border: `${isThreeDPreviewDragging ? '2px dashed #C7FFBD' : ''}` }}>
            <input
              style={{ display: 'none' }}
              type="file"
              name="threeDPreview"
              id="threeDPreview"
              accept={isThreeD ? '.zip, .glb' : 'image/*,video/*,audio/*'}
              {...threeDPreview}
              onChange={(e) => {
                handle3DAssetsChange({ event: e, isDrag: false, sizeLimit: 30000000 })
              }}
            />
            {threeDPreviewObjUrl && threeDPreviewMediaType && (
              <div className="uploaded-file">
                {['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(threeDPreviewMediaType) ? (
                  <img className="img" src={threeDPreviewObjUrl} alt="asset img" />
                ) : ['glb'].includes(threeDPreviewMediaType) ? (
                  <GlbViewer artwork={threeDPreviewObjUrl} ignoreThumbnail showThumbnail={false} />
                ) : ['zip'].includes(threeDPreviewMediaType) ? (
                  <div className="d-flex flex-column justify-content-center align-items-center h-100">
                    <FileZipIcon />
                  </div>
                ) : (
                  <ReactPlayer config={{ file: { attributes: { controlsList: 'nodownload' } } }} url={[threeDPreviewObjUrl]} controls width="100%" height="100%" />
                )}
              </div>
            )}
            {!threeDPreviewObjUrl && (
              <div className="upload-desc">
                <h6>
                  <FormattedMessage id="dragAndDropFilesHereToUpload" />
                </h6>
                <label htmlFor="threeDPreview" className="browse-btn">
                  Browse Preview
                </label>
                <span>
                  <FormattedMessage id="max3DPreviewSize" />
                </span>
              </div>
            )}

            {threeDPreviewObjUrl && !id && (
              <div>
                <label htmlFor="threeDPreview" className="change-img-btn">
                  Change Preview
                </label>
              </div>
            )}
          </div>
          <div className="upload-box" ref={threeDOriginalDropRef} style={{ border: `${isThreeDOriginalDragging ? '2px dashed #C7FFBD' : ''}` }}>
            <input
              style={{ display: 'none' }}
              type="file"
              name="threeDOriginal"
              id="threeDOriginal"
              accept={isThreeD ? '.zip, .glb' : 'image/*,video/*,audio/*'}
              {...threeDOriginal}
              onChange={(e) => {
                handle3DAssetsChange({ event: e, isDrag: false, sizeLimit: 105000000 })
              }}
            />
            {threeDOriginalObjUrl && threeDOriginalMediaType && (
              <div className="uploaded-file">
                {['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(threeDOriginalMediaType) ? (
                  <img className="img" src={threeDOriginalObjUrl} alt="asset img" />
                ) : ['glb'].includes(threeDOriginalMediaType) ? (
                  <GlbViewer artwork={threeDOriginalObjUrl} ignoreThumbnail showThumbnail={false} />
                ) : ['zip'].includes(threeDOriginalMediaType) ? (
                  <div className="d-flex flex-column justify-content-center align-items-center h-100">
                    <FileZipIcon />
                  </div>
                ) : (
                  <ReactPlayer config={{ file: { attributes: { controlsList: 'nodownload' } } }} url={[threeDOriginalObjUrl]} controls width="100%" height="100%" />
                )}
              </div>
            )}
            {!threeDOriginalObjUrl && (
              <div className="upload-desc">
                <h6>
                  <FormattedMessage id="dragAndDropFilesHereToUpload" />
                </h6>
                <label htmlFor="threeDOriginal" className="browse-btn">
                  Browse File
                </label>
                <span>
                  <FormattedMessage id="maxFileSize" />
                </span>
              </div>
            )}

            {threeDOriginalObjUrl && !id && (
              <div>
                <label htmlFor="threeDOriginal" className="change-img-btn">
                  Change File
                </label>
              </div>
            )}
          </div>
        </div>
      </Collapse>
      <Collapse in={!isThreeD}>

        <div id='example-collapse-text'>
          {(!thumbnailArtwork && type === 'resell') ? (
            <>Thumbnail not uploaded by creator</>
          ) : (
            <>
              <div className={`upload-box${type === 'resell' ? ' resell' : ''}`} ref={thumbnailDropRef} style={{ border: `${isThumbnailDragging ? '2px dashed #C7FFBD' : ''}` }}>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  name="addThumbnail"
                  id="addThumbnail"
                  accept="image/*"
                  {...addThumbnail}
                  onChange={(e) => {
                    handleThumbnailChange(e, false)
                  }}
                />
                {thumbnailArtwork && thumbnailArtworkMediaType && (
                  <div className="uploaded-file">
                    <img className="img" src={thumbnailArtwork} alt="asset img" />
                  </div>
                )}
                {!thumbnailArtwork && (
                  <div className="upload-desc">
                    <h6>
                      <FormattedMessage id="dragAndDropFilesHereToUpload" />
                    </h6>
                    <label htmlFor="addThumbnail" className="browse-btn">
                      Browse Thumbnail
                    </label>
                    <span>
                      <FormattedMessage id="maxThumbnailSize" />
                    </span>
                  </div>
                )}

                {thumbnailArtwork && !id && (
                  <div>
                    <label htmlFor="addThumbnail" className="change-img-btn">
                      Change Thumbnail
                    </label>
                  </div>
                )}
              </div>

              {stepOneErrors.addThumbnail && !thumbnailArtworkMediaType && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {stepOneErrors.addThumbnail.message}
                </Form.Control.Feedback>
              )}
            </>
          )
          }

          <div className={`upload-box${type === 'resell' ? ' resell' : ''}`} ref={dropRef} style={{ border: `${isDragging ? '2px dashed #C7FFBD' : ''}` }}>
            <input type="hidden" name="editImage" {...stepOneField('editImage')} />
            <input
              style={{ display: 'none' }}
              type="file"
              name="addImage"
              id="addImage"
              accept={isThreeD ? '.zip, .glb' : 'image/*,video/*,audio/*'}
              {...addImage}
              onChange={(e) => {
                handleArtworkChange(e, false)
              }}
            />
            {artwork && artworkMediaType && (
              <div className="uploaded-file">
                {['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(artworkMediaType) ? (
                  <img className="img" src={artwork} alt="asset img" />
                ) : ['glb'].includes(artworkMediaType) ? (
                  <GlbViewer artwork={artwork} ignoreThumbnail showThumbnail={false} />
                ) : ['zip'].includes(artworkMediaType) ? (
                  <div className="d-flex flex-column justify-content-center align-items-center h-100">
                    <FileZipIcon />
                  </div>
                ) : (
                  <ReactPlayer config={{ file: { attributes: { controlsList: 'nodownload' } } }} url={[artwork]} controls width="100%" height="100%" />
                )}
              </div>
            )}

            {!artwork && (
              <div className="upload-desc">
                <h6>
                  <FormattedMessage id="dragAndDropFilesHereToUpload" />
                </h6>
                <label htmlFor="addImage" className="browse-btn">
                  <FormattedMessage id="browseFile" />
                </label>
                <span>
                  <FormattedMessage id="maxFileSize" />
                </span>
              </div>
            )}

            {artwork && !id && (
              <div>
                <label htmlFor="addImage" className="change-img-btn">
                  <FormattedMessage id="changeArtwork" />
                </label>
              </div>
            )}
          </div>
          {stepOneErrors.addImage && !artworkMediaType && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {stepOneErrors.addImage.message}
            </Form.Control.Feedback>
          )}
        </div>
      </Collapse>
    </>
  )
}
UploadArtwork.propTypes = {
  stepOneField: PropTypes.func,
  handleArtworkChange: PropTypes.func,
  handleThumbnailChange: PropTypes.func,
  artworkMediaType: PropTypes.string,
  thumbnailArtworkMediaType: PropTypes.string,
  drop: PropTypes.any,
  artwork: PropTypes.string,
  thumbnailArtwork: PropTypes.string,
  stepOneErrors: PropTypes.object,
  setArtwork: PropTypes.func,
  setThumbnailArtwork: PropTypes.func,
  handle3DAssetsChange: PropTypes.func,
  threeDAssetData: PropTypes.object,
  assetFileSize: PropTypes.number,
  assetFile: PropTypes.any
}

export default UploadArtwork
