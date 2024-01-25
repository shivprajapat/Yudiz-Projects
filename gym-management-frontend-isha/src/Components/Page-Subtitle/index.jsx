import React from 'react'
import PropTypes from 'prop-types'
import './_pageSubtitle.scss'
import Button from 'Components/Button'
import { ReactComponent as Add } from 'Assets/Icons/add.svg'

export default function PageSubtitle({
  title,
  className,
  BtnText,
  handleButtonEvent,
  add,
  disabled,
  ...props
}) {

  return (
    <div className={'d-flex align-items-center justify-content-between ' + (className ? className : '')} {...props}>
      <div className=" d-flex align-items-center">
        <h6 className="page-subtitle ms-2">
          {BtnText ? <span style={{ fontSize: '18px', color: 'black' }}>{title}</span> : title}
        </h6>
      </div>

      {BtnText && (
          <Button className='mb-3 btn-sm' onClick={handleButtonEvent} startIcon={add && <Add />} disabled={disabled}>
            {BtnText}
          </Button>
        )}
    </div>
  )
}

PageSubtitle.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  BtnText: PropTypes.string,
  add: PropTypes.bool,
  handleButtonEvent: PropTypes.func,
  disabled: PropTypes.bool
}
