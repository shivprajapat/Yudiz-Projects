import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
import { useMutation } from '@apollo/client'

import { validationErrors } from 'shared/constants/ValidationErrors'
import { GENERATE_PRE_SIGNED } from 'graph-ql/generate-pre-signed-url'
import { uploadImage } from 'shared/functions/PreSignedData'
import { S3_PREFIX } from 'shared/constants'
import { convertUrlToEmbed } from 'shared/lib/to-embed'

function TinyEditor({ control, required, initialValue, disabled, name }) {
  const [content, setContent] = useState()
  const [generatePreSignedUrl] = useMutation(GENERATE_PRE_SIGNED)
  async function handleImageUpload(callback, success, meta) {
    const payload = [
      {
        sFileName: callback.blob()?.name?.split('.')[0] || '',
        sContentType: callback.blob().type,
        sType: 'articleEditorMedia'
      }
    ]
    const { data } = await generatePreSignedUrl({ variables: { generatePreSignedUrlInput: payload } })
    const uploadData = [
      {
        sUploadUrl: data.generatePreSignedUrl[0].sUploadUrl,
        file: callback.blob()
      }
    ]
    uploadImage(uploadData)
      .then(() => {
        success(S3_PREFIX + data.generatePreSignedUrl[0].sS3Url)
      })
      .catch((err) => {
        console.log('Image upload error', err)
      })
  }

  useEffect(() => {
    if (initialValue && !content) {
      setContent(initialValue)
    }
  }, [initialValue])

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={required && { required: validationErrors.required }}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey="316c8myuxuzlzc91yu01inf1y1v5ze7t1ymeangwik6eacc9"
            init={{
              extended_valid_elements: 'script[language|type|src]',
              allow_script_urls: true,
              valid_children: '+*[*]',
              cleanup: false,
              valid_elements: '*[*],script[src|type]',
              plugins:
                'lists link code preview charmap image media wordcount anchor fullscreen autolink autoresize autosave codesample directionality emoticons help hr image imagetools importcss insertdatetime legacyoutput nonbreaking noneditable pagebreak paste print quickbars searchreplace tabfocus template textpattern toc visualblocks visualchars table',
              toolbar1:
                'formatselect | bold italic blockquote underline strikethrough | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | link code | undo redo',
              toolbar2:
                'backcolor forecolor | charmap | image media | preview | fullscreen | anchor | autolink | autoresize | restoredraft | codesample | ltr rtl | emoticons | hr | pastetext | insertdatetime | nonbreaking | pagebreak | print | quickimage| quicktable | searchreplace | template | toc | visualblocks | visualchars| myCustomToolbarButton | help | adsButton ',
              skin: 'oxide-dark',
              content_css: 'dark',
              toolbar_location: 'top',
              toolbar_sticky: true,
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
              media_live_embeds: true,
              setup: (editor) => {
                editor.ui.registry.addButton('adsButton', {
                  text: 'Ads',
                  onAction: (_) => {
                    editor.insertContent('<gt-ads>&nbsp;&nbsp;</gt-ads>')
                  }
                })
                // editor.ui.registry.addButton('mediaGallery', {
                //   icon: 'image',
                //   onAction: (_) => {
                //     editor.insertContent('<gt-ads>&nbsp;&nbsp;</gt-ads>')
                //   }
                // })
                editor.addShortcut('meta+shift+p', 'Add pagebreak', () => {
                  editor.insertContent('<p><!-- pagebreak --></p>')
                })
                editor.on('PastePreProcess', async (e) => {
                  const content = e.content
                  e.content = ''
                  const data = await convertUrlToEmbed(content)
                  editor.insertContent(data)
                })
              }
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
  initialValue: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string
}
export default React.memo(TinyEditor)
