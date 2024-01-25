import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import { parseParams } from 'shared/utils'

function Search({ size, searchEvent, className, disabled }) {
  const refEdit = useRef(null)
  const [timer, setTimer] = useState(null)
  const params = parseParams(location.search)
  function handleChange(e) {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setTimer(
      setTimeout(() => {
        searchEvent(e.target.value)
      }, 500)
    )
  }

  useEffect(() => {
    if (params?.sSearch === '' || !params?.sSearch) {
      refEdit.current.value = ''
    }
  }, [params?.sSearch])

  return (
    <Form.Group className={`form-group ${className}`}>
      <Form.Control
        type="search"
        placeholder={useIntl().formatMessage({ id: 'search' }) + '...'}
        size={size || 'sm'}
        onChange={handleChange}
        defaultValue={params.sSearch || ''}
        ref={refEdit}
        disabled={disabled}
        className="select-input"
      />
    </Form.Group>
  )
}
Search.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
  searchEvent: PropTypes.func,
  disabled: PropTypes.bool
}
export default Search
