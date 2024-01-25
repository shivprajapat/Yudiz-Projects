import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom'

import { validationErrors } from 'shared/constants/validationErrors'
import useDragAndDrop from 'shared/hooks/use-drag-and-drop'

const UploadArtwork = ({ stepOneField, handleArtworkChange, artworkMediaType, artwork, stepOneErrors }) => {
  const { id, type } = useParams()
  const { dropRef, isDragging } = useDragAndDrop(handleArtworkChange, id)
  const addImage = stepOneField('addImage', { required: artworkMediaType ? false : validationErrors.required })
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
      <div className="upload-box" ref={dropRef} style={{ border: `${isDragging ? '2px dashed #C7FFBD' : ''}` }}>
        <input type="hidden" name="editImage" {...stepOneField('editImage')} />
        <input
          type="file"
          name="addImage"
          id="addImage"
          accept="image/*,video/*,audio/*"
          hidden
          {...addImage}
          onChange={(e) => {
            handleArtworkChange(e, false)
          }}
        />
        {artwork && artworkMediaType && (
          <div className="uploaded-file">
            {['png', 'jpg', 'jpeg'].includes(artworkMediaType) ? (
              <img className="img" src={artwork} alt="asset img" />
            ) : (
              <ReactPlayer url={[artwork]} controls width="100%" height="100%" />
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
    </>
  )
}
UploadArtwork.propTypes = {
  stepOneField: PropTypes.func,
  handleArtworkChange: PropTypes.func,
  artworkMediaType: PropTypes.string,
  drop: PropTypes.any,
  artwork: PropTypes.string,
  stepOneErrors: PropTypes.object
}
export default UploadArtwork
