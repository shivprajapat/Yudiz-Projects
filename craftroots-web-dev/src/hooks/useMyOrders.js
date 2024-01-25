import { useEffect, useRef, useState } from 'react'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import useAsync from './useAsync'
import { request } from '@/services/api.service'
import {
  GetOrderListDetails,
  MutationCancelOrder,
} from '@/queries/orderQueries'
import { setToastDataAction } from '@/actions/toastAction'
import { allRoutes } from '@/constants/allRoutes'

const useMyOrders = () => {
  const router = useRouter()
  const intl = useIntl()
  const orderListRef = useRef()
  const { page } = router.query

  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [id, setId] = useState()
  const [loadingOrderList, setLoadingOrderList] = useState(false)
  const [orderlistData, setOrderlistData] = useState()
  const [currentPage, setCurrentPage] = useState(Number(page) || 1)
  const itemsPerPage = 3
  const dispatch = useDispatch()

  const cancelOrderResult = useAsync(null, null)

  const getOrderListData = async (page, limitPerPage) => {
    try {
      setLoadingOrderList(true)
      const ordersData = await request({
        ...GetOrderListDetails,
        variables: {
          limit: limitPerPage,
          current_page: page,
        },
      })
      setOrderlistData(ordersData?.customerOrderList)
      setLoadingOrderList(false)
    } catch (error) {
      setOrderlistData()
    }
  }

  useEffect(() => {
    getOrderListData(currentPage, itemsPerPage)
  }, [])

  const deleteHandler = async () => {
    try {
      cancelOrderResult.run(request, {
        ...MutationCancelOrder,
        variables: { id: id },
      })
    } catch (err) {
      console.log(err)
    }
  }
  const closeConfirm = () => {
    setIsShowDeleteModal(!isShowDeleteModal)
  }
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return orderlistData?.items?.slice(startIndex, endIndex)
  }, [orderlistData?.items, currentPage, itemsPerPage])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    getOrderListData(newPage, itemsPerPage)
    router.push({ pathname: allRoutes.myOrders, query: { page: newPage } })
  }

  useEffect(() => {
    if (cancelOrderResult?.state?.isSuccess) {
      getOrderListData(currentPage, itemsPerPage)

      const cancelOrderData = cancelOrderResult.state.data
      if (Object.keys(cancelOrderData).length) {
        const message = cancelOrderData?.orderCancel?.message
        dispatch(setToastDataAction({ show: true, message }))
        closeConfirm()
      }
    }
  }, [cancelOrderResult?.state?.isSuccess])

  return {
    intl,
    loadingOrderList,
    orderlistData,
    cancelOrderResult,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    paginatedItems,
    orderListRef,
    intl,
    handlePageChange,
    deleteHandler,
    setId,
    setIsShowDeleteModal,
    isShowDeleteModal,
    closeConfirm,
  }
}

export default useMyOrders
