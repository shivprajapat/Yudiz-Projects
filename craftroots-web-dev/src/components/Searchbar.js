import React from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import SearchSuggestion from './SearchSuggestion'
import { Button } from './generic'
import { iconArrowLeft, iconClose, iconSearch } from '@/assets/images'
import useSearch from '@/hooks/useSearch'
import { setSearchOverlayActive } from '@/actions/productSearchAction'

function Searchbar({ className, onBackClick }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const {
    searchWrapperRef,
    searchQuery,
    searchResultState,
    searchActive,
    handleClearSearch,
    handleSearchFocus,
    handleSearchKey,
    resetSearch,
  } = useSearch({ onBackClick })

  return (
    <div
      ref={searchWrapperRef}
      className={`relative transition-all h-full md:block flex flex-col ${
        searchActive ? 'grow' : ''
      } ${className}`}
      tabIndex="-1"
    >
      <div className="relative flex pr-4 md:pr-0">
        <Button
          white
          className="!px-2 border-0 !bg-transparent shrink-0 md:hidden"
          icon={
            <Image src={iconArrowLeft} alt="Close search" className="h-3 w-3" />
          }
          onClick={() => {
            dispatch(setSearchOverlayActive(false))
          }}
        />
        <div className="absolute inset-y-0 md:right-3 right-7 flex items-center cursor-pointer">
          <button
            type="button"
            onClick={searchQuery ? handleClearSearch : null}
          >
            <Image
              src={searchQuery ? iconClose : iconSearch}
              alt="search"
              className={searchQuery ? 'w-4 h-4' : ''}
            />
          </button>
        </div>
        <input
          type="text"
          className="form-control font-normal grow "
          placeholder="Search..."
          value={searchQuery}
          onFocus={handleSearchFocus}
          onChange={handleSearchKey}
        />
      </div>
      <SearchSuggestion
        className={`md:absolute top-full inset-x-0 z-10 ${
          searchActive ? '' : '!hidden'
        }`}
        loading={searchResultState.isLoading}
        products={searchResultState.data?.products?.items}
        totalCounts={searchResultState.data?.products?.total_count}
        onViewProductsClick={() => {
          router.push(`/search?query=${searchQuery.trim()}`)
          resetSearch()
        }}
        onProductClick={resetSearch}
      />
    </div>
  )
}

export default Searchbar
Searchbar.propTypes = {
  className: PropTypes.string,
  onBackClick: PropTypes.func,
}
Searchbar.defaultProps = {
  className: '',
  onBackClick: () => {},
}
