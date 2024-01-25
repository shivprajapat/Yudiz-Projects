import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import 'bootstrap/dist/css/bootstrap.min.css'
import PropTypes from 'prop-types'

import 'bootstrap/dist/css/bootstrap.css'

function TextEditor ({ initialHtmlData, setHtmlData }) {
  const handleEditorChange = (e) => {
    setHtmlData(e.level.content)
  }
  return (
      <Editor
        apiKey='i7nsmgyc1nzeka31wrpr5p1q4heki5xb04s71y7460y9kivq'
        initialValue={initialHtmlData}
        init={{
          menubar: 'file view insert tools format table edit',
          toolbar1:
          'blocks | quickimage | bold italic blockquote underline | bullist numlist outdent indent | undo redo ',
          plugins:
          'lists link code preview charmap image media wordcount anchor fullscreen autolink autoresize autosave bbcode codesample directionality emoticons fullpage help hr image imagetools importcss insertdatetime legacyoutput nonbreaking noneditable pagebreak paste print quickbars searchreplace spellchecker tabfocus template textpattern toc visualblocks visualchars table',
          branding: false
        }}
        onChange={(e) => handleEditorChange(e)}
      >

      </Editor>
  )
}

TextEditor.propTypes = {
  setHtmlData: PropTypes.string,
  initialHtmlData: PropTypes.string
}

export default TextEditor
