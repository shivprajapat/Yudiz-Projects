import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

export const usePagination = (data = [], pathname) => {
  const router = useRouter()
  const { page } = router.query
  const [currentPage, setCurrentPage] = useState(Number(page) || 1)
  const itemsPerPage = 5

  useEffect(() => {
    setCurrentPage(Number(page) || 1)
  }, [page])

  const handlePageChange = (newPage) => {
    // wishlistRef?.current?.scrollIntoView({ top: 0, behavior: 'smooth' })
    router.push({ pathname: pathname, query: { page: newPage } })
  }

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data?.slice(startIndex, endIndex)
  }, [data, currentPage])

  return {
    handlePageChange,
    itemsPerPage,
    currentPage,
    paginatedItems,
  }
}
