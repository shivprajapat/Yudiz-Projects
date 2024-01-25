import { constants } from '../type'
import { request } from '@/services/api.service'
import {
  FilterCategory,
  Filterdata,
  ProductList,
} from '@/queries/productListQueries'

const clearFilterData = () => async (dispatch) => {
  dispatch({ type: constants.CLEAR_INITIAL_DATA })
}

async function getFilterData({
  selectedFilterAtt,
  pageSize,
  currentPage,
  variables = {},
}) {
  try {
    const searchQuery = selectedFilterAtt.search || ''
    if (searchQuery) {
      delete selectedFilterAtt.search
    }
    const data = await request({
      ...ProductList,
      variables: {
        filter: {
          ...selectedFilterAtt,
        },
        pageSize,
        currentPage,
        search: searchQuery,
        ...variables,
      },
    })
    return data
  } catch (e) {
    console.log(e)
  }
}

export const addFilterData =
  ({
    selectedFilterAtt,
    selectedOption,
    pageSize,
    currentPage,
    variables: incomingVariables = null,
  }) =>
    async (dispatch) => {
      dispatch(clearFilterData())
      try {
        const data = await getFilterData({
          selectedFilterAtt,
          pageSize,
          currentPage,
          variables: incomingVariables || {
            sort: selectedOption
              ? { [selectedOption.value]: selectedOption.sortDirection }
              : {},
          },
        })
        dispatch({
          type: constants.ADD_FILTER_DATA,
          payload: data.products.items,
          total_count: data?.products?.total_count,
        })
      } catch (e) {
        console.log(e)
      }
    }

export const sortFilterData =
  ({ selectedFilterAtt, value, order, pageSize, currentPage }) =>
    async (dispatch) => {
    // dispatch(clearFilterData())
      try {
        dispatch(
          addFilterData({
            selectedFilterAtt,
            pageSize,
            currentPage,
            variables: { sort: { [value]: order } },
          })
        )
      } catch (e) {
        console.log(e)
      }
    }

export const productInitialData = (result) => async (dispatch) => {
  dispatch(clearFilterData())
  try {
    dispatch({
      type: constants.ADD_INITIAL_DATA,
      payload: result?.products?.items,
      total_count: result?.products?.total_count,
    })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const loadMoreProducts =
  (selectedFilterAtt, selectedOption, pageSize, currentPage) =>
    async (dispatch) => {
      dispatch({ type: constants.CLEAR_ADD_LOADMORE__DATA })
      try {
        const searchQuery = selectedFilterAtt.search || ''
        if (searchQuery) {
          delete selectedFilterAtt.search
        }
        const data = await request({
          ...ProductList,
          variables: {
            filter: {
              ...selectedFilterAtt,
            },
            sort: selectedOption
              ? { [selectedOption.value]: selectedOption.sortDirection }
              : {},
            search: searchQuery,
            pageSize,
            currentPage,
          },
          sort: selectedOption
            ? { [selectedOption.value]: selectedOption.sortDirection }
            : {},
          pageSize,
          currentPage,
        })
        dispatch({
          type: constants.ADD_LOADMORE_DATA,
          payload: data.products.items,
          total_count: data?.products?.total_count,
        })
      } catch (e) {
        dispatch({
          type: constants.ADD_LOADMORE_DATA,
          payload: [],
        })
      }
    }

export const getFilterPageData =
  ({ rootCatId, searchQuery }) =>
    async (dispatch) => {
      dispatch({ type: constants.CLEAR_MAIN_CAT_FILTERS })
      try {
        let obj
        let categoriesRes = null
        if (rootCatId) {
          categoriesRes = await request({
            ...FilterCategory,
            variables: {
              category_id: rootCatId,
            },
          })
          obj = {
            category_id: {
              in: [rootCatId],
            },
          }
        }
        const queryVariables = {
          filter: { ...obj },
        }
        if (searchQuery) {
        // product search query
          queryVariables['search'] = searchQuery
        }
        const filterdataRes = await request({
          ...Filterdata,
          variables: queryVariables,
        })
        const categories = categoriesRes?.categoryFilters?.data || null
        dispatch({
          type: constants.ADD_MAIN_CAT_FILTERS,
          mainCatFilters: filterdataRes,
          subCatFilters: categories,
        })
      } catch (err) {
        dispatch({
          type: constants.ADD_MAIN_CAT_FILTERS,
          mainCatFilters: null,
          subCatFilters: null,
        })
      }
    }
