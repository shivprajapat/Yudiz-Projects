import { useMutation } from '@apollo/client'
import { GENERATE_PRE_SIGNED } from 'graph-ql/generate-pre-signed-url'
import React, { useContext, useRef, useState } from 'react'
import { Container } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { ToastrContext } from 'shared/components/toastr'
import { uploadImage } from 'shared/functions/PreSignedData'
import { TOAST_TYPE } from 'shared/constants'
import Loading from '../loading'
import { INSERT_IMAGE } from 'graph-ql/article/mutation'
import { checkImageType } from 'shared/utils'

const UploadFiles = ({ handleTabs }) => {
  const { dispatch } = useContext(ToastrContext)
  const imageFile = useRef()
  const [loading, setLoading] = useState(false)

  const [insertImage] = useMutation(INSERT_IMAGE, {
    onCompleted: (data) => {
      if (data) {
        setLoading(false)
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.insertImage.sMessage, type: TOAST_TYPE.Success, btnTxt: close }
        })
        handleTabs()
      }
    }
  })
  const [generatePreSignedUrl] = useMutation(GENERATE_PRE_SIGNED, {
    onCompleted: (data) => {
      if (data) {
        const urls = data.generatePreSignedUrl
        const uploadData = []
        const img = document.createElement('img')

        img.src = URL.createObjectURL(imageFile.current)
        uploadData.push({ sUploadUrl: urls[0].sUploadUrl, file: imageFile.current })
        img.onload = () => {
          uploadImage(uploadData)
            .then((res) => {
              insertImage({
                variables: {
                  input: {
                    sUrl: data.generatePreSignedUrl[0].sS3Url,
                    oMeta: { nSize: imageFile.current.size, nWidth: img?.width, nHeight: img?.height }
                  }
                }
              })
            })
            .catch((err) => {
              console.log('err', err)
            })
        }
      }
    }
  })

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      if (checkImageType(e.target.files[0].type)) {
        imageFile.current = e.target.files[0]
        setLoading(true)
        generatePreSignedUrl({
          variables: {
            generatePreSignedUrlInput: {
              sFileName: imageFile.current.name.split('.')[0],
              sContentType: imageFile.current.type,
              sType: 'articleEditorMedia'
            }
          }
        })
      } else {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: <FormattedMessage id="imgValidation" />, type: TOAST_TYPE.Error }
        })
      }
    }
  }

  return (
    <>
      <Container>
        <div className="middle-div text-center">
          {!loading && (
            <div>
              <h1>
                <FormattedMessage id="dropFilesToUpload" />
              </h1>
              <p className="text-left dark-text">
                <FormattedMessage id="or" />
              </p>
              <input type="hidden" name="oImg.sUrl" />
              <input
                type="file"
                name="oImg.fSUrl"
                id="uploadImg"
                accept=".jpg,.png,.jpeg,.webp"
                hidden
                onChange={(e) => {
                  handleImageChange(e)
                }}
              />
              <label htmlFor="uploadImg" className="btn btn-primary">
                <i className="icon-upload big"></i>
                <FormattedMessage id="selectFile" />
              </label>
              <p className="mt-4 dark-text">
                <FormattedMessage id="MaximumFileSize" />
              </p>
            </div>
          )}
          {loading && (
            <div className="loader media-upload-loader">
              <Loading />
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

UploadFiles.propTypes = {
  handleTabs: PropTypes.func
}

export default UploadFiles
