import React, { useId } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import PropTypes from 'prop-types'
import CustomToolTip from 'Components/TooltipInfo'
import './_editor.scss'

const InterviewEditor = ({ defaultContent, errorMessage, ...props }) => {
  const id = useId()
  // function handleChange(e) {
  //   // setDesc(e.level?.content)
  // }
  return (
    <div>
      {props.label ?
        <div className='d-flex justify-content-between'>
          <label htmlFor={id} className='interview-form-label' title={props.label}>{props.isImportant ? <>{props.label}<span className='interview-important'>*</span></> : props.label}</label>
          <CustomToolTip tooltipContent={props.tooltipContent} position='left'>
            {({ target }) => (
              <span
                ref={target}
                className='interview-info'
              >
                {props.info}
              </span>
            )}
          </CustomToolTip>
        </div>
        : false}
      <Editor
        {...props}
        onEditorChange={props?.onChange}
        value={props?.value}
        initialValue={defaultContent}
        apiKey="0nh369xi6b22qs6hg75stsd1mjbq91wa2f1lclmkofimj1o4"
        init={{
          height: 300,
          menubar: 'file view insert tools format table',
          browser_spellcheck: true,
          toolbar1: 'undo redo | blocks | quickimage | bold italic blockquote underline | bullist numlist outdent indent ',
          plugins:
            'lists link code preview charmap image media wordcount anchor fullscreen autolink autoresize autosave bbcode codesample directionality emoticons fullpage help hr image imagetools importcss insertdatetime legacyoutput nonbreaking noneditable pagebreak paste print quickbars searchreplace spellchecker tabfocus template textpattern toc visualblocks visualchars table',
          branding: false,
          toolbar_mode: 'wrap',
        }}
      />
      {/* <input type="file" onChange={changeFiles} />
      <iframe src={previewImage || ''} width="100%" height="500px" /> */}
      {/* <img src={previewImage || ''} alt="" /> */}
      {errorMessage && <p className="interview-errorMessage">{errorMessage}</p>}
    </div>
  )
}
InterviewEditor.propTypes = {
  defaultContent: PropTypes.string,
  tooltipContent: PropTypes.string,
  info: PropTypes.any,
  label: PropTypes.string,
  isImportant: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  errorMessage: PropTypes.object
}

export default InterviewEditor
