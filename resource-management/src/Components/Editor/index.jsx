import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import PropTypes from 'prop-types'

const InterviewEditor = ({ editorRef, defaultContent }) => {
  return (
    <div>
      <Editor
        apiKey="xhsskfone7ljgh2p85qq6zr8dx6spq42ojouxpmmur9n10qr"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={defaultContent || '<p>This is the initial content of the editor.</p>'}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </div>
  )
}
InterviewEditor.propTypes = {
  editorRef: PropTypes.any,
  defaultContent: PropTypes.string,
}

export default InterviewEditor
