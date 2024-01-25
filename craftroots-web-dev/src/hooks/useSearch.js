import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAsync from './useAsync'
import { ProductSearch } from '@/queries/searchQueries'
import { request } from '@/services/api.service'
import { setSearchActive } from '@/actions/productSearchAction'

export default function useSearch({ onBackClick }) {
  const dispatch = useDispatch()
  const { searchActive } = useSelector((state) => state.productSearchReducer)
  const [searchQuery, setSearchQuery] = useState('')
  const searchResult = useAsync(null, null)
  const debounceRef = useRef(null)
  const searchWrapperRef = useRef(null)

  useEffect(() => {
    if (searchWrapperRef.current) {
      searchWrapperRef?.current?.addEventListener('focusout', (e) => {
        if (!searchWrapperRef?.current?.contains(e.relatedTarget)) {
          dispatch(setSearchActive(false))
        }
      })
    }
  }, [])

  const handleClearSearch = () => {
    setSearchQuery('')
    dispatch(setSearchActive(false))
  }

  const fetchProducts = useCallback(
    (queryVariables = null) => {
      searchResult.run(request, {
        ...ProductSearch,
        variables: queryVariables || {
          searchKey: searchQuery,
        },
      })
    },
    [searchQuery]
  )

  useEffect(() => {
    let getProducts
    if (searchQuery) {
      getProducts = setTimeout(() => {
        if (!debounceRef.current || searchQuery !== debounceRef.current) {
          debounceRef.current = searchQuery
          fetchProducts()
        }
      }, 500)
    } else {
      debounceRef.current = null
      searchResult.resetData()
    }
    return () => {
      if (getProducts) {
        clearTimeout(getProducts)
      }
    }
  }, [searchQuery])

  useEffect(() => {
    if (!searchResult.state.isLoading) {
      debounceRef.current = null
    }
    if (
      searchResult.state.isLoading ||
      searchResult.state.isSuccess ||
      searchResult.state.isFailed
    ) {
      dispatch(setSearchActive(true))
    }
  }, [searchResult.state.isLoading])

  const handleSearchFocus = useCallback(() => {
    if (Object.keys(searchResult.state.data).length) {
      dispatch(setSearchActive(true))
    }
  }, [searchResult.state.data])

  const handleSearchKey = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

  const resetSearch = useCallback(() => {
    handleClearSearch()
    if (onBackClick) {
      onBackClick()
    }
  }, [])

  return {
    searchWrapperRef,
    searchQuery,
    searchResultState: searchResult.state,
    searchActive,
    handleClearSearch,
    handleSearchFocus,
    handleSearchKey,
    fetchProducts,
    resetSearch,
  }
}
