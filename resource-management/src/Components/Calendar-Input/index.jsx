import React from 'react'
import './_calendar-input.scss'
import IconCalendar from '../../Assets/Icons/calendar.svg'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
export default function CalendarInput(props) {
  return (
    <Form.Group className="input">
      <Form.Label>{props.title}</Form.Label>
      <div className="calendar-input">
        <img src={IconCalendar} alt="" />
        <input {...props} type="date" />
      </div>
    </Form.Group>
  )
}
CalendarInput.propTypes = {
  title: PropTypes.string,
}
