import React from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

import {
  iconArrowLeft,
  iconArrowRight,
  iconSevronLeft,
  iconSevronRight,
} from '@/assets/images'
import useWindowSize, { SIZE_BREAKPOINTS } from '@/hooks/useWindowSize'

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const paginationClass =
    'w-8 sm:w-10 h-8 sm:h-10 grid place-items-center text-grey-600 text-base font-light bg-white border border-grey-400 hover:!bg-secondary-200 hover:border-secondary-200 hover:text-white duration-300 ease-in-out'

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const maxVisiblePages = 5 // Adjust this value for normal screens
  const maxVisibleMobilePages = 3 // Adjust this value for mobile screens
  const size = useWindowSize()
  const handlePageChange = (page) => {
    if (page === 1) {
      onPageChange(1)
    } else if (page === totalPages) {
      onPageChange(totalPages)
    } else {
      onPageChange(page)
    }
  }

  const renderPageNumbers = () => {
    const pageNumbers = []

    const maxVisible =
      size.width <= SIZE_BREAKPOINTS.sm
        ? maxVisibleMobilePages
        : maxVisiblePages

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      let startPage
      if (
        currentPage > totalPages - maxVisibleMobilePages &&
        window.innerWidth <= 640
      ) {
        startPage = Math.max(1, totalPages - maxVisibleMobilePages + 1)
      } else {
        startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
      }
      const endPage = Math.min(totalPages, startPage + maxVisible - 1)

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
    }

    return pageNumbers.map((pageNumber, index) => (
      <li key={index}>
        <button
          className={`pagination ${paginationClass} ${
            pageNumber === currentPage
              ? '!bg-secondary-200 border-secondary-200 text-white'
              : ''
          }`}
          type="button"
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      </li>
    ))
  }

  return (
    <nav>
      <ul className="inline-flex items-center gap-2">
        <li>
          <button
            className={`pagination ${paginationClass} !border-0`}
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <Image
              src={iconSevronLeft}
              alt="left"
              className="w-[18px] sm:w-6 h-auto"
            />
          </button>
        </li>

        <button
          className={`pagination ${paginationClass} !border-0`}
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Image
            src={iconArrowLeft}
            alt="left"
            className="w-[6px] sm:w-2 h-auto"
          />
        </button>
        {renderPageNumbers()}

        <li>
          <button
            className={`pagination ${paginationClass} !border-0`}
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Image
              src={iconArrowRight}
              alt="right"
              className="w-[6px] sm:w-2 h-auto"
            />
          </button>
        </li>
        <button
          className={`pagination ${paginationClass} !border-0`}
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <Image
            src={iconSevronRight}
            alt="right"
            className="w-[18px] sm:w-6 h-auto"
          />
        </button>
      </ul>
    </nav>
  )
}

export default Pagination

Pagination.propTypes = {
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
}

Pagination.defaultProps = {
  totalItems: 0,
  itemsPerPage: 0,
  currentPage: 0,
}
