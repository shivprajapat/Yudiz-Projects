import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { getCategories } from 'modules/category/redux/service'
import { getExploreAssets } from 'modules/explore/redux/service'
import { appendParams, parseParams } from 'shared/utils'

const useExplore = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const params = useRef(parseParams(location.search))
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

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
    if (!id && requestParams.currentNftDropId) {
      setRequestParams({ ...requestParams, currentNftDropId: '', isDropNeeded: false })
    }
  }, [id])

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
      isSaleInProgress: false,
      isExpired: false,
      categoryId: data.categoryId || null,
      minPrice: Number(data.minPrice) || null,
      maxPrice: Number(data.maxPrice) || null,
      mediaType: data.mediaType || '',
      currencyType: data.currencyType || null,
      sortColumn: data.sortColumn || '',
      sortOrder: data.sortOrder || '',
      isDropNeeded: id ? '' : false,
      currentNftDropId: id || '',
      wishlistByLoggedInUser: true,
      isShow: true,
      isActive: true
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
    setSelectedCategory(category?.id)
    setRequestParams({ ...requestParams, categoryId: category?.id })
    appendParams({ categoryId: category?.id || '' })
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
      minPrice: '',
      maxPrice: '',
      mediaType: '',
      currencyType: ''
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
    params,
    id,
    navigate
  }
}

export default useExplore
