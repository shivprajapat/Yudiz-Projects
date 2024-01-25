import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import './_pageTitle.scss'
import { ReactComponent as Add } from 'Assets/Icons/add.svg'

export default function PageTitle({ title, BtnText, handleButtonEvent, cancelText, cancelButtonEvent, loading, add }) {
  return (
    <div className=" d-flex align-items-center justify-content-between">
      <div className=" d-flex align-items-center">
        <h6 className="page-title">{title}</h6>
      </div>
      <div className=" d-flex">
        {cancelText && (
          <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={cancelButtonEvent}>
            {cancelText}
          </Button>
        )}
        {BtnText && (
          <Button loading={loading} onClick={handleButtonEvent} startIcon={add && <Add />}>
            {BtnText}
          </Button>
        )}
      </div>
    </div>
  )
}

PageTitle.propTypes = {
  title: PropTypes.string,
  BtnText: PropTypes.string,
  handleButtonEvent: PropTypes.func,
  cancelButtonEvent: PropTypes.func,
  cancelText: PropTypes.string,
  add: PropTypes.bool,
  loading: PropTypes.bool,
}
