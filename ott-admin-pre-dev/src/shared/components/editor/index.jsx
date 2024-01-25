import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { GENERATE_PRE_SIGNED } from 'graph-ql/generate-pre-signed-url'
import { uploadImage } from 'shared/functions/PreSignedData'
import { ARTICLE_BASE_URL, S3_PREFIX, TOAST_TYPE } from 'shared/constants'
import { convertUrlToEmbed } from 'shared/lib/to-embed'
import { removeStylesFromString } from 'shared/utils'
import CustomTweet from '../customTweet'
import { ToastrContext } from '../toastr'
import { FormattedMessage } from 'react-intl'
const { renderToStaticMarkup } = require('react-dom/server')

function TinyEditor({ control, required, initialValue, disabled, name, onlyTextFormatting }) {
  const [content, setContent] = useState()
  const [generatePreSignedUrl] = useMutation(GENERATE_PRE_SIGNED)
  const { dispatch } = useContext(ToastrContext)
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

  const handlePlugins = () => {
    if (onlyTextFormatting) {
      return 'link paste'
    } else {
      return 'lists link code preview charmap image media wordcount anchor fullscreen autolink autoresize autosave codesample directionality emoticons help hr image imagetools importcss insertdatetime legacyoutput nonbreaking noneditable pagebreak paste print quickbars searchreplace tabfocus template textpattern toc visualblocks visualchars table'
    }
  }
  // fontfamily fontsize blocks
  const handleToolbar = () => {
    if (onlyTextFormatting) {
      return 'fontsize backcolor forecolor charmap image media preview fullscreen anchor autolink autoresize restoredraft codesample ltr rtl emoticons hr pastetext insertdatetime nonbreaking pagebreak print quickimage quicktable searchreplace template toc visualblocks visualchars myCustomToolbarButton'
    } else {
      return 'fontsize backcolor forecolor charmap image media preview fullscreen anchor autolink autoresize restoredraft codesample ltr rtl emoticons hr pastetext insertdatetime nonbreaking pagebreak print quickimage quicktable searchreplace template toc visualblocks visualchars myCustomToolbarButton help adsButton addTweet addInstagram'
    }
  }

  useEffect(() => {
    if (initialValue && !content) {
      setContent(initialValue)
    }
  }, [initialValue])

  const tweet = (data) => renderToStaticMarkup(<CustomTweet post={data}/>)

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
              extended_valid_elements: 'script[language|type|src],img[class|src|alt|title|width|loading=lazy]',
              allow_script_urls: true,
              valid_children: '+*[*]',
              cleanup: false,
              valid_elements: '*[*],script[src|type]',
              plugins: handlePlugins(),
              toolbar1:
                'blocks bold italic blockquote underline strikethrough bullist numlist outdent indent alignleft aligncenter alignright alignjustify link code undo redo',
              toolbar2: handleToolbar(),
              skin: 'oxide-dark',
              content_css: ['dark', '/style.css'],
              toolbar_location: 'top',
              toolbar_sticky: true,
              toolbar_sticky_offset: 65,
              min_height: 1000,
              image_caption: true,
              invalid_styles: {
                // '*': 'font-family color background-color display',
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
                function socialMedia(media, label) {
                  return {
                    title: `Add ${media}`,
                    body: {
                      type: 'panel',
                      items: [{
                        type: 'input',
                        name: 'type',
                        label: `${media} ${label}`,
                        flex: true
                      }]
                    },
                    onSubmit: function(api) {
                      const inputContent = api.getData().type
                      const instaDomain = 'https://www.instagram.com/'
                      if (media === 'Tweet' && inputContent?.length > 0) {
                        fetch(`${ARTICLE_BASE_URL}api/generate-twitter-data/${inputContent}`, {
                          method: 'post',
                          headers: { 'Content-Type': 'application/json' }
                        }).then((response) => {
                          return response.json()
                        }).then((data) => {
                          if (data?.message === 'Something went wrong') {
                            dispatch({
                              type: 'SHOW_TOAST',
                              payload: { message: data?.message, type: TOAST_TYPE.Error }
                            })
                          } else {
                            data && editor.insertContent(tweet(data))
                            api.close()
                          }
                        })
                      } else if (media === 'Instagram' && inputContent?.includes(instaDomain) && inputContent?.length > 0) {
                        const instagramUrl = inputContent.split('?')[0]
                        editor.insertContent(renderToStaticMarkup(
                            <div className='ct-instagram-embed'>
                              <iframe id='instaFrame' className='ct-insta-frame' loading="lazy" width="400" height="800" src={`${instagramUrl}embed/captioned`}
                              ></iframe>
                            </div>
                        ))
                        api.close()
                      } else {
                        dispatch({
                          type: 'SHOW_TOAST',
                          payload: { message: <FormattedMessage id={`inValid${media}`}/>, type: TOAST_TYPE.Error }
                        })
                      }
                    },
                    buttons: [
                      {
                        text: 'Close',
                        type: 'cancel',
                        onclick: 'close'
                      },
                      {
                        text: 'Insert',
                        type: 'submit',
                        primary: true,
                        enabled: true
                      }
                    ]
                  }
                }
                editor.ui.registry.addButton('addTweet', {
                  text: 'Add Tweet',
                  onAction: (_) => {
                    editor.windowManager.open(socialMedia('Tweet', 'ID'))
                  }
                })
                editor.ui.registry.addButton('addInstagram', {
                  text: 'Instagram Post',
                  onAction: (_) => {
                    editor.windowManager.open(socialMedia('Instagram', 'URL'))
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
                  const removedStyleData = removeStylesFromString(data)
                  editor.insertContent(removedStyleData)
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
  onlyTextFormatting: PropTypes.bool,
  name: PropTypes.string
}
export default React.memo(TinyEditor)
