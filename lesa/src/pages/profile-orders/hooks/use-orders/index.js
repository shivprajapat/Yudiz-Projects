import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { appendParams, parseParams } from 'shared/utils'
import { getOrders } from 'modules/orders/redux/service'
import { history } from 'App'

const useOrders = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const params = useRef(parseParams(location.search))

  const [assets, setAssets] = useState()
  const [requestParams, setRequestParams] = useState(getRequestParams())

  const userOrders = useSelector((state) => state.orders.userOrders)

  useEffect(() => {
    userOrders && setAssets(userOrders)
  }, [userOrders])

  useEffect(() => {
    requestParams && dispatch(getOrders(requestParams))
  }, [requestParams])

  useEffect(() => {
    return history.listen((e) => {
      params.current = parseParams(e.search)
      setRequestParams(getRequestParams(e.search))
    })
  }, [history])

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current
    return {
      userId: id || localStorage.getItem('userId'),
      page: data.page || 1,
      perPage: data.perPage || 12
    }
  }

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
    appendParams({ page: page })
  }

  const handleOrderChange = (data, isFilter) => {
    if (isFilter) {
      setRequestParams({ ...requestParams, status: data ? data?.value : '' })
      appendParams({ status: data ? data?.value : '' })
    } else {
      setRequestParams({ ...requestParams, name: data })
      appendParams({ orderSearch: data })
    }
  }

  const handleOrderTimeFilter = (data) => {
    setRequestParams({ ...requestParams, timeFilter: data || '' })
    appendParams({ timeFilter: data || '' })
  }
  return {
    assets,
    handleOrderChange,
    handleOrderTimeFilter,
    handlePageChange
  }
}

export default useOrders
