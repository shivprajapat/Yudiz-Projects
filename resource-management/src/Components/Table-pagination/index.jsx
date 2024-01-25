/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { usePagination } from 'Hooks/usePagination'
import { ReactComponent as RightArrow } from 'Assets/Icons/rightArrow.svg'
import { ReactComponent as LefttArrow } from 'Assets/Icons/leftArrow.svg'
import { ReactComponent as DownArrow } from 'Assets/Icons/downArrow.svg'
import './_tablePagination.scss'
import { Dropdown } from 'react-bootstrap'

export default function TablePagination(props) {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, onLimitChange, rowsOptions } = props

  const dots = '...'
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  const CustomToggle = React.forwardRef(function toggle({ children, onClick }, ref) {
    return (
      <div
        className="cursor-pointer"
        ref={ref}
        onClick={(e) => {
          e.preventDefault()
          onClick(e)
        }}
      >
        {children}
        <DownArrow className="ms-1" />
      </div>
    )
  })

  let lastPage = paginationRange[paginationRange?.length - 1]
  return (
    <div className="d-flex justify-content-between pagination-section">
      <div className="d-flex align-items-center">
        <div className="text-muted">
          Page {currentPage + 1} Of {lastPage || 1}
        </div>
        <div className="ms-3 p-2 px-3 bg-white text-muted" style={{ borderRadius: 8 }}>
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
              Row Limit: {pageSize}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {rowsOptions?.map((i) => (
                <Dropdown.Item as="button" key={i} onClick={() => onLimitChange(i)}>
                  {i}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {totalCount > pageSize && (
        <div className="d-flex">
          <div className={'btn bg-white mx-1 ' + (currentPage === 0 && 'disabled')} onClick={onPrevious}>
            <LefttArrow />
          </div>

          {paginationRange?.map((pageNumber, i) => {
            if (pageNumber === dots) {
              return (
                <div className="btn bg-white mx-1" key={i}>
                  ...
                </div>
              )
            }

            return (
              <div
                className={'btn mx-1' + (pageNumber - 1 === currentPage ? ' active-btn' : '')}
                key={i}
                onClick={() => onPageChange(pageNumber - 1)}
              >
                {pageNumber}
              </div>
            )
          })}
          <div className={'btn bg-white mx-1 ' + ((currentPage + 1 === lastPage || !totalCount) && 'disabled')} onClick={onNext}>
            <RightArrow />
          </div>
        </div>
      )}
    </div>
  )
}
TablePagination.defaultProps = {
  rowsOptions: [5, 10, 15, 20],
}

TablePagination.propTypes = {
  onPageChange: PropTypes.func,
  onLimitChange: PropTypes.func,
  totalCount: PropTypes.number,
  siblingCount: PropTypes.number,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  rowsOptions: PropTypes.array,
}
