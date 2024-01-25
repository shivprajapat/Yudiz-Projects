import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { getMysteryBoxes } from 'modules/crates/redux/service'
import { appendParams, parseParams } from 'shared/utils'

const useMysteryBox = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const params = useRef(parseParams(location.search))
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [mysteryBoxes, setMysteryBoxes] = useState()

  const mysteryBoxesData = useSelector((state) => state.crates.mysteryBoxes)

  useEffect(() => {
    if (requestParams.name === '' || requestParams.name) dispatch(getMysteryBoxes(requestParams))
  }, [JSON.stringify(requestParams)])

  useEffect(() => {
    setRequestParams({ ...requestParams, name: searchParams.get('q') || '' })
  }, [searchParams])

  useEffect(() => {
    mysteryBoxesData && setMysteryBoxes(mysteryBoxesData)
  }, [mysteryBoxesData])

  useEffect(() => {
    if (!id && requestParams.currentNftDropId) {
      setRequestParams({ ...requestParams, currentNftDropId: '', isDropNeeded: false })
    }
  }, [id])

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current
    return {
      page: Number(data.page) || 1,
      perPage: Number(data.perPage) || 3,
      isSold: false,
      isExpired: false,
      isSaleInProgress: false
    }
  }

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
    appendParams({ page })
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
      perPage: 3
    })
    setSearchParams()
  }

  return {
    mysteryBoxes,
    handlePageChange,
    handleFilterSubmit,
    handleSort,
    handleReset,
    requestParams,
    params,
    id,
    navigate
  }
}

export default useMysteryBox
