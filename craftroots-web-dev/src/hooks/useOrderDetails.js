import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import useAsync from './useAsync'
import {
  GetOrderListDetailWithId,
  InvoiceDetails,
  MutationCancelOrder,
} from '@/queries/orderQueries'
import { request } from '@/services/api.service'
import { setToastDataAction } from '@/actions/toastAction'
import { isLoggedIn } from '@/helper'
import { allRoutes } from '@/constants/allRoutes'

function useOrderDetails() {
  const router = useRouter()
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [id, setId] = useState()
  const [orderData, setOrderData] = useState()
  const [loading, setLoading] = useState(true)
  const cancelOrderResult = useAsync(null, null)
  const { orderId } = router.query
  const dispatch = useDispatch()

  const fetchOrderDetails = async (orderId) => {
    const orderData = await request({
      ...GetOrderListDetailWithId,
      variables: { id: orderId },
    })
    setOrderData(orderData)
    setLoading(false)
  }

  useEffect(() => {
    if (isLoggedIn()) {
      if (orderId !== undefined) {
        fetchOrderDetails(orderId?.[0])
      }
    } else {
      router.push(allRoutes.signIn)
    }
  }, [router.query?.orderId])

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

  const invoiceHandle = () => {
    if (orderId[0]) {
      invoiceDetailsAsync.run(request, {
        ...InvoiceDetails,
        variables: {
          orderId: orderId[0],
        },
      })
    }
  }

  /*   const orderTrackHandle = () => {
    router.push(allRoutes.shiprocketUrl)
  } */

  useEffect(() => {
    if (cancelOrderResult?.state?.isSuccess) {
      fetchOrderDetails(orderId?.[0])
      const cancelOrderData = cancelOrderResult.state.data
      if (Object.keys(cancelOrderData).length) {
        const message = cancelOrderData?.orderCancel?.message
        dispatch(setToastDataAction({ show: true, message }))
        closeConfirm()
      }
    }
  }, [cancelOrderResult?.state?.isSuccess])

  return {
    orderId,
    orderData,
    loading,
    invoiceHandle,
    cancelOrderState: cancelOrderResult.state,
    setId,
    setIsShowDeleteModal,
    isShowDeleteModal,
    closeConfirm,
    deleteHandler,
  }
}

export default useOrderDetails
