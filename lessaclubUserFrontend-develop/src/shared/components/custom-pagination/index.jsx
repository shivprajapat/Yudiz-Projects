import React from 'react'
import { Pagination } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { usePagination, DOTS } from 'shared/hooks/use-pagination'

const CustomPagination = ({ className, currentPage, totalCount, pageSize, onPageChange, id }) => {
  const siblingCount = 1
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  })

  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const handleScroll = () => {
    id && document.getElementById(id).scrollIntoView()
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
    id && handleScroll()
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
    id && handleScroll()
  }

  const handlePageChange = (page) => {
    onPageChange(page)
    id && handleScroll()
  }

  const lastPage = paginationRange[paginationRange.length - 1]
  return (
    <Pagination className={className}>
      <Pagination.Prev onClick={onPrevious} disabled={currentPage === 1}>
        {'<'}
      </Pagination.Prev>
      {paginationRange.map((page, index) => {
        if (page === DOTS) {
          return <Pagination.Ellipsis disabled key={index} />
        }
        return (
          <Pagination.Item key={index} active={page === currentPage} onClick={() => handlePageChange(page)}>
            {page}
          </Pagination.Item>
        )
      })}
      <Pagination.Next onClick={onNext} disabled={currentPage === lastPage}>
        {'>'}
      </Pagination.Next>
    </Pagination>
  )
}
CustomPagination.propTypes = {
  className: PropTypes.string,
  currentPage: PropTypes.number,
  totalCount: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  id: PropTypes.string
}
export default CustomPagination
