import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import Cancel from 'Assets/Icons/Cancel'
import { detectBrowser } from 'helpers'
import './_calendar-input.scss'
function CalendarInput({ value, onChange, timeAndDate, defaultValue, disabled, isImportant, ...props }, ref) {
  return (
    <Form.Group className="calendar-input-box">
      {props.title && <Form.Label className='m-0 calendar-input-label'>{isImportant ? <>{props.title}<span className='calendar-input-important'>*</span></> : props.title}</Form.Label>}
      <div
        className={`calendar-input ${value ? '' : detectBrowser() === 'Safari' ? 'showPlaceholder' : ''} ${props.errorMessage ? 'calendar-input-errorInput' : ''}`}
      >
        <input
          disabled={disabled}
          defaultValue={defaultValue || ''}
          ref={(r) => (ref = r)}
          value={value}
          onChange={onChange}
          {...props}
          type={timeAndDate ? 'datetime-local' : 'date'}
        />
        {value && !disabled ? (
          <div
            className="date-cancel-btn"
            onClick={() => {
              ref.value = ''
              ref.defaultValue = ''
              onChange({
                target: {
                  value: '',
                  defaultValue: '',
                },
              })
            }}
          >
            <Cancel fill="gray" />
          </div>
        ) : null}
      </div>
      {props.errorMessage && <p className="calendar-input-errorMessage">{props.errorMessage}</p>}
    </Form.Group>
  )
}
CalendarInput.propTypes = {
  title: PropTypes.string,
  defaultValue: PropTypes.string,
  disableError: PropTypes.bool,
  timeAndDate: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  isImportant: PropTypes.bool
}
export default forwardRef(CalendarInput)
