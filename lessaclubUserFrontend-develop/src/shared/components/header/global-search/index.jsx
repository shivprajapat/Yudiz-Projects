import React, { useEffect, useState, useRef } from 'react'
import { Form, FormControl } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { searchIcon } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import { useDebounce } from 'shared/hooks/use-debounce'
import { history } from 'App'

const GlobalSearch = ({ isForMobile }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { pathname } = useLocation()

  const searchLabel = useIntl().formatMessage({ id: 'search' })

  const [searchInput, setSearchInput] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || null)

  const refEdit = useRef(null)
  const debouncedValue = useDebounce(searchValue, 500)

  useEffect(() => {
    if (debouncedValue === '' || debouncedValue) {
      navigate({
        pathname: allRoutes.explore,
        search: createSearchParams({
          q: debouncedValue
        }).toString()
      })
    }
  }, [debouncedValue])

  useEffect(() => {
    if (searchParams.get('q')) {
      setSearchInput(true)
    }
  }, [])

  useEffect(() => {
    return history.listen((e) => {
      if (refEdit?.current?.value && e.pathname !== allRoutes.explore) {
        refEdit.current.value = ''
      }
    })
  }, [history])

  useEffect(() => {
    if (pathname !== allRoutes.explore) refEdit.current.value = ''
  }, [pathname])

  const handleSearchClick = () => {
    setSearchInput(!searchInput)
  }

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
  }

  return (
    <Form.Group autoComplete="off" className={isForMobile ? 'mobile-searchbar' : 'searchbar'}>
      <FormControl
        type="search"
        ref={refEdit}
        defaultValue={searchParams.get('q') || ''}
        placeholder={!isForMobile ? searchLabel : ''}
        className={`${isForMobile && searchInput && 'search-border'}`}
        aria-label="Search"
        onFocus={isForMobile && handleSearchClick}
        onBlur={isForMobile && handleSearchClick}
        onChange={handleSearch}
      />
      <img src={searchIcon} alt="search-icon" className="img-fluid search-icon" />
    </Form.Group>
  )
}
GlobalSearch.propTypes = {
  isForMobile: PropTypes.bool
}
export default GlobalSearch
