import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'
import { useQuery } from '@apollo/client'

import { GET_POLL_LIST } from 'graph-ql/article/query'
import { debounce } from 'shared/utils'

export default function WidgetFilter({ selectedPoll, handleChange }) {
  const isBottomReached = useRef(false)
  const totalRecords = useRef(0)
  const [poll, setPoll] = useState([])
  const [selected, setSelected] = useState(selectedPoll)
  const [payload, setPayload] = useState({
    aStatus: ['s', 'pub'],
    nLimit: 10,
    nSkip: 1,
    sSearch: ''
  })

  const { loading } = useQuery(GET_POLL_LIST, {
    variables: { input: payload },
    onCompleted: (data) => {
      totalRecords.current = data?.listPoll?.aPolls.length
      if (data?.listPoll?.aPolls.length && isBottomReached.current) {
        setPoll([...poll, ...data?.listPoll?.aPolls])
        isBottomReached.current = false
      } else if (data?.listPoll?.aPolls?.length) {
        setPoll(data?.listPoll?.aPolls)
      }
    }
  })

  function handleScroll(e) {
    if (totalRecords.current === payload.nLimit) {
      isBottomReached.current = true
      setPayload({
        ...payload,
        nSkip: payload.nSkip + 1
      })
    }
  }

  const handleSearch = debounce((txt, { action }) => {
    if (action === 'input-change') {
      setPayload({ ...payload, nSkip: 1, sSearch: txt })
    }
    if (action === 'menu-close') {
      setPayload({ ...payload, nSkip: 1, sSearch: '' })
    }
    return txt
  })

  useEffect(() => {
    setSelected(selectedPoll)
  }, [selectedPoll])

  return (
    <Form.Group className="form-group mb-2 poll-group">
      <Select
        // ref={ref}
        isLoading={loading}
        placeholder={<FormattedMessage id="selectPoll" />}
        value={selected}
        options={poll}
        getOptionLabel={(option) => option?.mValue?.sTitle || option?.sTitle}
        getOptionValue={(option) => option?.mValue?._id || option?._id}
        className="react-select"
        classNamePrefix="select"
        isSearchable
        onInputChange={handleSearch}
        onMenuScrollToBottom={handleScroll}
        // onSelectResetsInput={false}
        // isDisabled={disabled}
        isMulti
        closeMenuOnSelect={false}
        onChange={(p, a) => {
          setSelected(p)
          handleChange(p, a)
        }}
      />
    </Form.Group>
  )
}

WidgetFilter.propTypes = {
  selectedPoll: PropTypes.array,
  handleChange: PropTypes.func
}
