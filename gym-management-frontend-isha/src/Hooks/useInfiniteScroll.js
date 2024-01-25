import { useState } from 'react'
import { useQuery } from 'react-query'

export default function useInfiniteScroll(deps, queryFn, { onReset, requestParams, updater = () => { }, onSuccess, ...options }) {
  const [resourceDetail, setResourceDetail] = useState([])
  const [timeoutHandle, setTimeoutHandle] = useState()

  function settingScrollState(length) {
    if (length >= requestParams?.limit) {
      startScroll()
    } else {
      stopScroll()
    }
  }

  const data = useQuery([...deps, (requestParams?.page || requestParams?.search) || ''], queryFn, {
    ...options,
    select: (data) => (options.select ? options.select(data) : data),
    onSuccess: function (data) {
      const length = data?.length
      settingScrollState(length)
      if (requestParams.page > 0) {
        setResourceDetail((p) => [...(p?.length ? p : []), ...(length ? data : [])])
      } else {
        setResourceDetail(data)
        onReset ? onReset(data) : null
      }
      if (onSuccess) {
        onSuccess(data)
      }
    },
  })

  function handleScroll() {
    if (requestParams.next) {
      updater((p) => ({ ...p, page: p?.page + requestParams.limit }))
    }
  }

  function handleSearch(search) {
    if (search) {
      clearTimeout(timeoutHandle)
      const timeout = setTimeout(() => updater((p) => ({ ...p, page: 0, search, isSearching: true })), 1500)
      setTimeoutHandle(timeout)
    } else {
      updater((p) => ({ ...p, page: 0, search, isSearching: true }))
    }
  }

  function stopScroll() {
    updater((p) => ({ ...p, next: false }))
  }

  function startScroll() {
    updater((p) => ({ ...p, next: true }))
  }

  function reset() {
    setResourceDetail([])
    updater((p) => ({ ...p, next: true }))
  }

  return { ...data, data: resourceDetail, handleScroll, handleSearch, reset }
}
