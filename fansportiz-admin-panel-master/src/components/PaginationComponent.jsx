import React from 'react'
import PropTypes from 'prop-types'
import { CustomInput } from 'reactstrap'
import Pagination from 'rc-pagination'
import localeInfo from '../locale/en_US'

// Common component for pagination

const PaginationComponent = props => {
  const { activePageNo, startingNo, endingNo, total, listLength, setListLength, setLoading, setPageNo, setOffset, offset, setStart, paginationFlag } = props

  function onChangeLength (event) {
    let limit
    if (event.target.value.includes(5)) {
      limit = 5
    } else if (event.target.value.includes(10)) {
      limit = 10
    } else if (event.target.value.includes(20)) {
      limit = 20
    } else if (event.target.value.includes(30)) {
      limit = 30
    } else if (event.target.value.includes(40)) {
      limit = 40
    }
    paginationFlag.current = true
    setStart(0)
    setListLength(`${limit} entries`)
    setOffset(limit)
    setPageNo(1)
    setLoading(true)
  }

  // this function will called when page changes
  function onPageChange (current, pageSize) {
    if (current !== activePageNo) {
      paginationFlag.current = true
      setStart((current - 1) * offset)
      setOffset(offset)
      setLoading(true)
    }
    setPageNo(current, { method: 'push' })
  }

  return (
    <div className='d-flex justify-content-between align-items-center fdc-480 margin-top-10px-480'>
      <Pagination
        showQuickJumper
        showSizeChanger
        pageSize={offset}
        current={activePageNo}
        onShowSizeChange={onChangeLength}
        onChange={onPageChange}
        total={total}
        locale={localeInfo}
      />
      <div className='d-flex align-items-center fdc-480 margin-top-10px-480'>
        {total !== 0 && (
          <div>
            {`${startingNo}-${endingNo} of `}
            <b>{`${total} items`}</b>{' '}
          </div>
        )}
        <div className='ml-3 ml-0-480 margin-top-10px-480'>
          <CustomInput
            type='select'
            name='customSelect'
            id='customSelect'
            value={listLength}
            onChange={(e) => onChangeLength(e)}
          >
            <option>5 entries</option>
            <option>10 entries</option>
            <option>20 entries</option>
            <option>30 entries</option>
            <option>40 entries</option>
          </CustomInput>
        </div>
      </div>
    </div>
  )
}

PaginationComponent.propTypes = {
  activePageNo: PropTypes.number,
  startingNo: PropTypes.number,
  endingNo: PropTypes.number,
  total: PropTypes.number,
  listLength: PropTypes.string,
  setOffset: PropTypes.func,
  setLoading: PropTypes.func,
  setStart: PropTypes.func,
  setListLength: PropTypes.func,
  offset: PropTypes.number,
  setPageNo: PropTypes.func,
  paginationFlag: PropTypes.object
}

export default PaginationComponent
