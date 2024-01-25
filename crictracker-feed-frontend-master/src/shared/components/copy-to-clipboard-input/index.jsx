import React, { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'

import ToolTip from 'shared/components/tooltip'

function CopyToClipBoardInput({ isHeader, textInput, inputLabel, copyToClipBoard }) {
  const [copied, setCopied] = useState(false)
  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    }
  }

  const handleCopyClick = (postLink) => {
    const textToCopy = postLink ? textInput.concat(postLink) : textInput
    copyTextToClipboard(textToCopy)
      .then(() => {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 1500)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <>
      {(copyToClipBoard && !isHeader) ? (
        <>
          <InputGroup className='mb-3'>
            <Form.Control
              className='dark-copy-input'
              placeholder='Token'
              aria-label='Generated Token'
              aria-describedby='basic-addon2'
              disabled
              readOnly
              value={textInput}
              type='text'
            />
            <ToolTip toolTipMessage='Copy'>
              <Button className='copy-button' id='button-addon2' onClick={() => handleCopyClick('?token=YOUR_TOKEN')}>
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </ToolTip>
          </InputGroup>
        </>
      ) : copyToClipBoard ? (
        <>
          <p className='input-label'>{inputLabel}</p>
          <InputGroup className='mb-3'>
            <Form.Control
              className='copy-input'
              placeholder='Token'
              aria-label='Generated Token'
              aria-describedby='basic-addon2'
              disabled
              readOnly
              value={textInput}
              type='text'
            />
            <ToolTip toolTipMessage='Copy'>
              <Button className='copy-button' id='button-addon2' onClick={() => handleCopyClick()}>
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </ToolTip>
          </InputGroup>
        </>
      ) : (
        <>
          <p className='input-label'>{inputLabel}</p>
          <InputGroup className='mb-3'>
            <Form.Control
              className='date-input'
              placeholder='Token'
              aria-label='Generated Token'
              aria-describedby='basic-addon2'
              disabled
              readOnly
              value={textInput}
              type='text'
            />
          </InputGroup>
        </>
      )}
    </>
  )
}

CopyToClipBoardInput.propTypes = {
  textInput: PropTypes.string.isRequired,
  inputLabel: PropTypes.string.isRequired,
  copyToClipBoard: PropTypes.bool.isRequired,
  isHeader: PropTypes.bool
}
export default CopyToClipBoardInput
