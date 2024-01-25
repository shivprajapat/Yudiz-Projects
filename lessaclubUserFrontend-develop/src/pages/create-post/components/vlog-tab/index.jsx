import React from 'react'
import { Form } from 'react-bootstrap'
import ReactPlayer from 'react-player'
import { useFormContext } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { validationErrors } from 'shared/constants/validationErrors'
import useDragAndDrop from 'shared/hooks/use-drag-and-drop'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const VlogTab = ({ currentTab }) => {
  const dispatch = useDispatch()

  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
    watch
  } = useFormContext()
  const videoField = watch('vlog.video.files')

  const handleVlogChange = (e, isDrag) => {
    const file = isDrag ? e[0] : e.target.files[0]

    if (file?.type?.split('/')[0] !== 'video') {
      return dispatch({
        type: SHOW_TOAST,
        payload: {
          type: TOAST_TYPE.Error,
          message: 'Please upload a video file'
        }
      })
    }
    if (file.size > 105000000) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: <FormattedMessage id="PleaseUploadAFileSmallerThan100MB" />,
          type: TOAST_TYPE.Error
        }
      })
    } else if (isDrag || (e && e.target.files.length > 0)) {
      setValue('vlog.video.files', { fileObject: file, url: URL.createObjectURL(file), type: file.type.split('/')[1], updated: true })
      clearErrors('vlog.video')
    }
  }

  const { dropRef, isDragging } = useDragAndDrop(handleVlogChange)

  return (
    <>
      <Form.Group className="form-group">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="vlog.title"
          className={errors?.vlog?.title && 'error'}
          {...register('vlog.title', {
            required: currentTab === 'vlog' ? validationErrors.required : false,
            maxLength: {
              value: 20,
              message: validationErrors.maxLength(20)
            }
          })}
        />
        {errors?.vlog?.title && (
          <Form.Control.Feedback type="invalid" className="invalidFeedback">
            {errors?.vlog?.title?.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="vlog.description"
          {...register('vlog.description', {
            required: currentTab === 'vlog' ? validationErrors.required : false,
            minLength: { value: 10, message: validationErrors.rangeLength(10, 100) },
            maxLength: { value: 100, message: validationErrors.rangeLength(10, 100) }
          })}
          className={errors?.vlog?.description && 'error'}
        />
        {errors?.vlog?.description && (
          <Form.Control.Feedback type="invalid" className="invalidFeedback">
            {errors?.vlog?.description.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <div
        className="upload-box"
        ref={dropRef}
        style={{ border: `${isDragging ? '2px dashed #C7FFBD' : errors?.vlog?.video ? '2px dashed #ff0000' : ''}` }}
      >
        <input
          type="file"
          name="vlog.video"
          id="vlog.video"
          accept="video/*"
          {...register('vlog.video', {
            required: currentTab === 'blog' ? false : videoField ? false : validationErrors.required
          })}
          hidden
          onChange={(e) => {
            handleVlogChange(e, false)
          }}
        />

        {videoField && (
          <div className="uploaded-file">
            <ReactPlayer
              config={{ file: { attributes: { controlsList: 'nodownload' } } }}
              url={videoField?.url}
              controls
              width="100%"
              height="100%"
            />
          </div>
        )}

        {!videoField && (
          <div className="upload-desc">
            <h6>Drag & Drop files here to upload</h6>
            <label htmlFor="vlog.video" className="browse-btn">
              Browse File
            </label>
            <span>Max size limit - 100MB</span>
          </div>
        )}

        {videoField && (
          <div>
            <label htmlFor="vlog.video" className="change-img-btn">
              change vlog
            </label>
          </div>
        )}
      </div>
      {errors?.vlog?.video && (
        <Form.Control.Feedback type="invalid" className="invalidFeedback">
          {errors?.vlog?.video?.message}
        </Form.Control.Feedback>
      )}
    </>
  )
}
VlogTab.propTypes = {
  currentTab: PropTypes.string
}
export default VlogTab
