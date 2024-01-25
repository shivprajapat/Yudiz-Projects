import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactCropper from 'react-cropper'
import { Button, Modal } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import 'cropperjs/dist/cropper.css'
import { getFileInfo } from 'shared/utils'

function ImageEditor({ show, setShow, file, onConfirmProp, onCompleted }) {
  const { t } = useTranslation()

  const [cropper, setCropper] = useState()
  const [image, setImage] = useState()
  const [zoom, setZoom] = useState(0)
  const [rotate, setRotate] = useState(0)

  useEffect(() => {
    if (file !== null) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImage(reader.result)
      })
      reader.readAsDataURL(file)
    } else {
      setImage(null)
      setCropper(null)
    }
  }, [file, cropper])

  function onConfirm() {
    if (!cropper) {
      return
    }

    const croppedCanvas = {
      imageSmoothingQuality: 'high'
    }

    const canvasData = cropper.getCroppedCanvas(croppedCanvas)
    const fileInfo = getFileInfo(file)

    canvasData.toBlob((blob) => {
      const croppedFile = new File([blob], fileInfo.filename, {
        type: blob.type,
        lastModified: new Date()
      })
      typeof onConfirm === 'function' && onConfirmProp(croppedFile)
      typeof onCompleted === 'function' && onCompleted()
      setImage(null)
      setCropper(null)
      setShow(!show)
      setZoom(0)
      setRotate(0)
    }, fileInfo.mime)
  }

  function handleClose() {
    setCropper(false)
    setImage(null)
    setShow(!show)
    setZoom(0)
    setRotate(0)
    typeof onCompleted === 'function' && onCompleted()
  }

  function onRotateChange(e) {
    setRotate(e.target.value)
    cropper.rotateTo(e.target.value)
  }
  function onZoomChange(e) {
    setZoom(e.target.value)
    cropper.zoomTo(e.target.value)
  }
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" className="modal-medium" centered>
      <Modal.Body className={`${styles.cropBody}`}>
        {image && (
          <ReactCropper
            src={image}
            style={{ height: 360, width: '100%' }}
            aspectRatio={1}
            viewMode={1}
            dragMode="move"
            cropBoxMovable={false}
            center={true}
            toggleDragModeOnDblclick={false}
            checkOrientation={true}
            onInitialized={(instance) => setCropper(instance)}
            minCropBoxWidth={100}
            minCropBoxHeight={100}
            background={false}
          />
        )}
      </Modal.Body>
      <Modal.Footer className="d-block">
        <div className="d-flex align-items-center justify-content-between m-0 mb-1">
          <div>
            <div className="d-flex align-items-center mb-4">
              {t('common:Zoom')}
              <input
                className="mx-2"
                type="range"
                min={0}
                step={0.1}
                max={4}
                value={zoom}
                onChange={(value) => {
                  onZoomChange(value)
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              {t('common:Rotate')}
              <input
                className="mx-2"
                type="range"
                min={-180}
                max={180}
                value={rotate}
                onChange={(value) => {
                  onRotateChange(value)
                }}
              />
            </div>
          </div>
          <div className={`${styles.actionBtn} d-flex`}>
            <Button className="theme-btn outline-btn" onClick={handleClose} size="md">
              {t('common:Cancel')}
            </Button>
            <Button className="theme-btn" onClick={onConfirm}>
              {t('common:Confirm')}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

ImageEditor.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
  file: PropTypes.any,
  onConfirmProp: PropTypes.func,
  onCompleted: PropTypes.func
}

export default ImageEditor
