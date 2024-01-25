import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { validationErrors } from 'shared/constants/validationErrors'
import { getPreSignedUrl } from 'shared/functions'
import { updateToS3 } from 'shared/utils'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import Loading from '../loading'

const TinyEditor = ({ control, required, disabled, name }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const handleImageUpload = (callback) => {
    return new Promise((resolve, reject) => {
      getPreSignedUrl({ fileName: callback.blob()?.name }).then((data) => {
        updateToS3(callback.blob(), data.data.result.file.url)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            dispatch({
              type: SHOW_TOAST,
              payload: {
                message: err?.message || validationErrors.serverError,
                type: TOAST_TYPE.Error
              }
            })
            reject(err)
          })
      })
    })
  }

  return (
    <>
      {loading && <Loading />}
      <Controller
        name={name}
        control={control}
        rules={required && { required: validationErrors.required }}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
            onInit={() => setLoading(false)}
            init={{
              extended_valid_elements: 'script[language|type|src]',
              allow_script_urls: true,
              valid_children: '+*[*]',
              cleanup: false,
              valid_elements: '*[*],script[src|type]',
              plugins:
                'lists link code preview charmap image media wordcount anchor fullscreen autolink autoresize autosave codesample directionality emoticons help  image importcss insertdatetime nonbreaking quickbars searchreplace template visualblocks visualchars table',
              toolbar1:
                'formatselect | bold italic blockquote underline strikethrough | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | link code | undo redo | backcolor forecolor | charmap | image media | preview | fullscreen | anchor | autolink | autoresize | restoredraft | codesample | ltr rtl | emoticons | pastetext | insertdatetime | nonbreaking | quickimage| quicktable | searchreplace | template | toc | visualblocks | visualchars| myCustomToolbarButton | help',
              skin: 'oxide-dark',
              content_css: 'dark',
              toolbar_location: 'top',
              // toolbar_sticky: true,
              toolbar_sticky_offset: 65,
              min_height: 1000,
              image_caption: true,
              invalid_styles: {
                '*': 'font-family color background-color display',
                table: 'width height margin border-collapse',
                tr: 'width height',
                th: 'width height',
                td: 'width height'
              },
              content_style: `
              ::-moz-selection {
                color: #ffffff;
                background: #ffffff47;
              }
              
              ::selection {
                color: #ffffff;
                background: #ffffff47;
              }
              .mce-content-body [data-mce-selected=inline-boundary] { background-color: transparent }
              .twitter_frame{ overflow: hidden; }
              .twitter_frame iframe{ margin-top: -18px }
              gt-ads { border: 1px dashed white; display: block; }
              gt-ads:before { content: 'Advertisement'; }
              `,
              images_upload_handler: handleImageUpload,
              media_live_embeds: true
            }}
            disabled={disabled}
            onEditorChange={(e) => {
              onChange(e)
            }}
            value={value}
          />
        )}
      />
    </>
  )
}
TinyEditor.propTypes = {
  control: PropTypes.object,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string
}
export default React.memo(TinyEditor)
