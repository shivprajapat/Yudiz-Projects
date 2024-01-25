import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import {
  addFilterData,
  getFilterPageData,
  loadMoreProducts,
  sortFilterData,
} from '@/actions/filterProductsAction'
import { FILTER_TYPE, PAGE_ATTRIBUTES } from '@/helper/constant'

export default function useShop({ rootCatId }) {
  const router = useRouter()
  const { query } = router
  const productsRef = useRef(null)
  const productListRef = useRef()
  const dispatch = useDispatch()
  const productFilterState = useSelector((state) => state.productFilterReducer)
  const { mainCatFilters, subCatFilters } = productFilterState
  // const scrollContainerRef = useRef(null)

  const [selectedOption, setSelectedOption] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilterAtt, setSelectedFilterAtt] = useState({})
  const [filterBadge, setFilterbadge] = useState([])
  // const [breadcrumbs, setBreadcrumbs] = useState({})
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 1000,
    value: {
      min: 0,
      max: 1000,
    },
  })
  const [pageAttributes, setPageAttributes] = useState({
    currentPage: +query?.pageNo || 1,
    pageSize: PAGE_ATTRIBUTES.pageSize,
  })
  const [shouldFetchData, setShouldFetchData] = useState(false)
  const newObj = rootCatId
    ? {
      ...selectedFilterAtt,
      category_id: {
        in: selectedFilterAtt?.category_id?.in?.filter(
          (value) => value !== rootCatId
        ),
      },
    }
    : selectedFilterAtt
  const filterCount =
    Object.values(newObj).reduce(
      (acc, value) => acc + (value?.in?.length || 0),
      0
    ) + (query?.price ? 1 : 0)
  const handleFilterOpen = () => {
    setFilterOpen(!filterOpen)
  }

  useEffect(() => {
    if (selectedOption?.value && !query.pageNo) {
      dispatch(
        sortFilterData({
          selectedFilterAtt,
          value: selectedOption.value,
          order: selectedOption.sortDirection,
          pageSize: pageAttributes.pageSize,
          currentPage: pageAttributes.currentPage,
        })
      )
    }
  }, [selectedOption])

  useEffect(() => {
    const priceFilter = { ...priceRange }
    if (mainCatFilters) {
      const priceRanges = mainCatFilters?.products?.aggregations?.find(
        (i) => i.attribute_code === FILTER_TYPE.price.title
      )?.options
      // setFilterData(newFilterData)
      if (priceRanges) {
        const firstItem = priceRanges[0]
        const lastItem = priceRanges[priceRanges.length - 1]
        priceFilter.min = firstItem.value.split('_')[0]
        priceFilter.max = lastItem.value.split('_')[1]
        priceFilter.value.min = firstItem.value.split('_')[0]
        priceFilter.value.max = lastItem.value.split('_')[0]
      }
    }

    //query params for filter and price
    const convertedFilter = {}
    if (query?.filter) {
      const queryFilterObj = JSON.parse(query.filter)
      for (const key in queryFilterObj) {
        convertedFilter[key] = { in: queryFilterObj[key] }
      }
    } else if (rootCatId) {
      convertedFilter['category_id'] = { in: [rootCatId] }
    }
    if (query?.price) {
      const [min, max] = query.price.split(',')
      priceFilter.value.min = +min
      priceFilter.value.max = +max
      convertedFilter['price'] = { from: min.toString(), to: max.toString() }
    } else {
      priceFilter.value.min = priceFilter.min
      priceFilter.value.max = priceFilter.max
    }
    if (query?.sort) {
      const [value, sortDirection, label] = query.sort.split(',')
      // if((value !== selectedOption?.value || sortDirection !== selectedOption?.sortDirection))
      setSelectedOption({ value, sortDirection, label })
    } else {
      setSelectedOption(null)
    }
    if (query?.query) {
      // product search query
      convertedFilter['search'] = query.query
    }
    if (!query?.pageNo) {
      setPageAttributes({ ...pageAttributes, currentPage: 1 })
    }
    setSelectedFilterAtt({
      ...convertedFilter,
    })
    setPriceRange(priceFilter)
  }, [query, mainCatFilters])

  //query for filter changes
  useEffect(() => {
    if (shouldFetchData) {
      dispatch(
        addFilterData({
          selectedFilterAtt,
          selectedOption,
          pageSize: pageAttributes.pageSize,
          currentPage: 1,
        })
      )
      setShouldFetchData(false)
    }
  }, [shouldFetchData])

  //useeffect for to update filter badges
  useEffect(() => {
    const newarray = []
    Object.keys(selectedFilterAtt).forEach((key) => {
      if (key !== FILTER_TYPE.search.title) {
        if (key === FILTER_TYPE.price.title) {
          const val = selectedFilterAtt[FILTER_TYPE.price.title]
          const newObj = {
            label: `Price: ₹${val.from} to ₹${val.to}`,
            attribute_code: FILTER_TYPE.price.title,
            value: FILTER_TYPE.price.title,
          }
          newarray.push(newObj)
        } else if (key !== FILTER_TYPE.category.title) {
          const selectedRes = mainCatFilters?.products?.aggregations?.find(
            (filter) => filter.attribute_code === key
          )
          const options = selectedFilterAtt[key].in.map((filter) => {
            return selectedRes?.options?.find((opt) => opt.value === filter)
          })
          options.forEach((option) => {
            const newObj = {
              ...option,
              attribute_code: selectedRes?.attribute_code,
            }
            newarray.push(newObj)
          })
        } else {
          selectedFilterAtt[key].in.forEach((filter) => {
            if (filter !== rootCatId) {
              const desiredObject = subCatFilters?.find((obj) =>
                obj?.Child?.some((child) => child.value === filter)
              )
              let filters = subCatFilters
              if (desiredObject) {
                filters = desiredObject?.Child
              }
              const obj = filters?.find((obj) => obj.value === filter)
              newarray.push({
                ...obj,
                attribute_code: FILTER_TYPE.category.title,
              })
            }
          })
        }
      }
    })
    setFilterbadge(newarray)
  }, [selectedFilterAtt])

  // useEffect(() => {
  //   function handleScroll() {
  //     const listBottom =
  //       productListRef.current.offsetTop + productListRef.current.scrollHeight
  //     const scrollBottom = window.innerHeight + window.scrollY
  //     if (
  //       scrollBottom >= listBottom &&
  //       scrollBottom <= listBottom + 80 &&
  //       totalCount !== products.length &&
  //       !productsListLoading
  //     ) {
  //       debounce(() => {
  //         loadMore()
  //       }, 200)
  //     }
  //   }
  //   if (productListRef?.current && products && totalCount) {
  //     window.addEventListener('scroll', handleScroll)
  //   }
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [selectedFilterAtt, products?.length, totalCount, productsListLoading])

  const routerFunc = (query, scrollState) => {
    router.replace(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { scroll: scrollState || false, shallow: true }
    )
  }
  const loadMore = async () => {
    const newQueryParams = {
      pageNo: pageAttributes.currentPage + 1,
    }
    const updatedQuery = { ...router.query, ...newQueryParams }
    dispatch(
      loadMoreProducts(
        selectedFilterAtt,
        selectedOption,
        pageAttributes.pageSize,
        pageAttributes.currentPage + 1
      )
    )

    setPageAttributes({
      ...pageAttributes,
      currentPage: pageAttributes.currentPage + 1,
    })
    // add query parameters
    routerFunc(updatedQuery)
  }

  //clear all filters
  const clearFilters = () => {
    let updatedQuery = { ...router.query }
    delete updatedQuery.filter
    delete updatedQuery.price
    delete updatedQuery?.pageNo
    let obj = {}
    if (rootCatId) {
      obj = {
        category_id: {
          in: [rootCatId],
        },
      }
    }
    dispatch(
      addFilterData({
        selectedFilterAtt: obj,
        selectedOption: {},
        pageSize: pageAttributes.pageSize,
        currentPage: 1,
      })
    )
    routerFunc(updatedQuery)
  }

  //update query params function for price slider
  const updateQueryPrice = (min, max) => {
    let updatedQuery = {
      ...router.query,
      price: min + ',' + max,
    }
    if (updatedQuery.hasOwnProperty('pageNo')) {
      delete updatedQuery.pageNo
    }
    setPageAttributes({
      ...pageAttributes,
      currentPage: 1,
    })
    routerFunc(updatedQuery, true)
  }
  let debounceTimer
  const debounce = (func, delay) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(func, delay)
  }
  const handlePriceChange = ({ min, max }, isMobile) => {
    debounce(() => {
      setSelectedFilterAtt((prevState) => ({
        ...prevState,
        price: { from: min.toString(), to: max.toString() },
      }))
      if (!isMobile) {
        setShouldFetchData(true)
        updateQueryPrice(min, max)
      }
    }, 500)
  }

  const updateQueryFilterHandler = (data) => {
    const output = {}
    if (Object.keys(data).length !== 0) {
      for (const key in data) {
        if (
          data.hasOwnProperty(key) &&
          ![FILTER_TYPE.price.title, FILTER_TYPE.search.title].includes(key)
        ) {
          output[key] = Object.values(data[key].in)
        }
      }
    }
    let updatedQuery = { ...router.query }
    if (updatedQuery.hasOwnProperty('pageNo')) {
      delete updatedQuery.pageNo
    }
    if (!data.hasOwnProperty(FILTER_TYPE.price.title)) {
      delete updatedQuery.price
    } else {
      updatedQuery[FILTER_TYPE.price.title] =
        data?.price?.from + ',' + data?.price?.to
    }
    //add query params of filters
    //if filter object empty do not add in query param
    if (Object.keys(output).length > 0) {
      updatedQuery = {
        ...updatedQuery,
        filter: JSON.stringify(output),
      }
    } else {
      delete updatedQuery.filter
    }

    routerFunc(updatedQuery, true)
  }

  const onCheckHandler = async (data, isMobile) => {
    //change the format filtered attributes
    setPageAttributes({
      ...pageAttributes,
      currentPage: 1,
    })
    if (!isMobile) {
      updateQueryFilterHandler(data)
      setShouldFetchData(true)
    }
    setSelectedFilterAtt(data)
  }

  const handleFilterClick = (attributeCode, value) => {
    const updatedFilter = { ...selectedFilterAtt }

    if (updatedFilter.hasOwnProperty(attributeCode)) {
      if (attributeCode === FILTER_TYPE.price.title) {
        delete updatedFilter[FILTER_TYPE.price.title]
      } else {
        const filterValues = updatedFilter[attributeCode].in
        const valueIndex = filterValues.indexOf(value)

        if (valueIndex !== -1) {
          filterValues.splice(valueIndex, 1)

          if (filterValues.length === 0) {
            delete updatedFilter[attributeCode]
          }
        }
      }
    }
    if (rootCatId && !updatedFilter?.category_id?.in) {
      updatedFilter[FILTER_TYPE.category.title] = { in: [rootCatId] }
    }
    // Remove keys with empty "in" arrays
    for (const key in updatedFilter) {
      if (
        updatedFilter[key]?.in?.length === 0 &&
        key !== FILTER_TYPE.price.title
      ) {
        delete updatedFilter[key]
      }
    }
    setSelectedFilterAtt(updatedFilter)
    updateQueryFilterHandler(updatedFilter)
    setShouldFetchData(true)
  }

  const sortHandler = (data) => {
    let updatedQuery = {
      ...router.query,
      sort: data.value + ',' + data.sortDirection + ',' + data.label,
    }
    if (updatedQuery.hasOwnProperty('pageNo')) {
      delete updatedQuery.pageNo
    }
    setPageAttributes({
      ...pageAttributes,
      currentPage: 1,
    })
    routerFunc(updatedQuery)
  }

  /* const getbreadCrumbs = async () => {
    const result = await request({
      ...Breadcrumbs,
      variables: {
        category_id: +rootCatId,
      },
    })
    setBreadcrumbs(result?.category) 
  }*/

  //api call for breadcrumb
  useEffect(() => {
    // getbreadCrumbs()
    if (rootCatId) {
      dispatch(
        getFilterPageData({
          rootCatId,
          searchQuery: router?.query?.query || '',
        })
      )
    }
  }, [rootCatId])

  return {
    loadMore,
    pageAttributes,
    selectedOption,
    setSelectedOption,
    filterOpen,
    setFilterOpen,
    priceRange,
    selectedFilterAtt,
    setShouldFetchData,
    setPriceRange,
    clearFilters,
    handlePriceChange,
    onCheckHandler,
    handleFilterOpen,
    sortHandler,
    filterCount,
    productsRef,
    setPageAttributes,
    pageAttributes,
    productListRef,
    handleFilterClick,
    filterBadge,
    updateQueryFilterHandler,
    updateQueryPrice,
    // breadcrumbs,
    mainCatFilters,
    subCatFilters,
    // scrollContainerRef,
    // targetDivRef
  }
}
