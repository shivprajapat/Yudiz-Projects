import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'

import { validationErrors } from 'shared/constants/ValidationErrors'

function TinyEditor({ control, required, initialValue, disabled, name, onlyTextFormatting }) {
  const [content, setContent] = useState()
  const editorRef = useRef(null)

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
      return 'fontsize backcolor forecolor charmap image media preview fullscreen anchor autolink autoresize restoredraft codesample ltr rtl emoticons hr pastetext insertdatetime nonbreaking pagebreak print quickimage quicktable searchreplace template toc visualblocks visualchars myCustomToolbarButton help adsButton'
    }
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
              media_live_embeds: true,
              setup: (editor) => {
                editorRef.current = editor
                editor.ui.registry.addButton('adsButton', {
                  text: 'Ads',
                  onAction: (_) => {
                    editor.insertContent('<gt-ads>&nbsp;&nbsp;</gt-ads>')
                  }
                })
                editor.addShortcut('meta+shift+p', 'Add pagebreak', () => {
                  editor.insertContent('<p><!-- pagebreak --></p>')
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
