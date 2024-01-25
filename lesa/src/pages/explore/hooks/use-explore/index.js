import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { getCategories } from 'modules/category/redux/service'
import { getExploreAssets } from 'modules/explore/redux/service'
import { appendParams, parseParams } from 'shared/utils'

const useExplore = () => {
  const dispatch = useDispatch()
  const params = useRef(parseParams(location.search))
  const [searchParams, setSearchParams] = useSearchParams()

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [exploreAssets, setExploreAssets] = useState()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [category, setCategory] = useState()

  const exploreAssetData = useSelector((state) => state.explore.explore)
  const categoryData = useSelector((state) => state.category.categories)

  useEffect(() => {
    if (requestParams.name === '' || requestParams.name) dispatch(getExploreAssets(requestParams))
  }, [JSON.stringify(requestParams)])

  useEffect(() => {
    setRequestParams({ ...requestParams, name: searchParams.get('q') || '' })
  }, [searchParams])

  useEffect(() => {
    exploreAssetData && setExploreAssets(exploreAssetData)
  }, [exploreAssetData])

  useEffect(() => {
    if (params.current.categoryId && category) {
      setSelectedCategory(Number(params.current.categoryId))
    }
  }, [category])

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current
    return {
      page: Number(data.page) || 1,
      perPage: Number(data.perPage) || 20,
      isSold: false,
      isExpired: false,
      categoryId: data.categoryId || null,
      minPrice: Number(data.minPrice) || null,
      maxPrice: Number(data.maxPrice) || null,
      mediaType: data.mediaType || '',
      currencyType: data.currencyType || 'ETH',
      sortColumn: data.sortColumn || '',
      sortOrder: data.sortOrder || ''
    }
  }

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
    appendParams({ page })
  }

  useEffect(() => {
    dispatch(getCategories({ page: 1, perPage: 200 }))
  }, [])

  useEffect(() => {
    categoryData && setCategory(categoryData)
  }, [categoryData])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.id)
    setRequestParams({ ...requestParams, categoryId: category.id })
    appendParams({ categoryId: category.id })
  }

  const handleFilterSubmit = (data) => {
    setRequestParams({ ...requestParams, ...data })
    appendParams({ ...data })
  }

  const handleSort = (data) => {
    setRequestParams({ ...requestParams, ...data })
    appendParams({ ...data })
  }

  const handleReset = () => {
    setRequestParams({
      ...requestParams,
      page: 1,
      perPage: 20,
      categoryId: null,
      name: '',
      minPrice: 0,
      maxPrice: 1000000,
      mediaType: '',
      currencyType: 'ETH'
    })
    setSelectedCategory(null)
    setSearchParams()
  }

  return {
    exploreAssets,
    handlePageChange,
    handleCategoryChange,
    handleFilterSubmit,
    handleSort,
    handleReset,
    selectedCategory,
    requestParams,
    category,
    params
  }
}

export default useExplore
