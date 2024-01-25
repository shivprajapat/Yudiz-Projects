import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useWindowSize, { SIZE_BREAKPOINTS } from './useWindowSize'
import { request } from '@/services/api.service'
import { NewCollection } from '@/queries'
import { generateSliderItemForLoop } from '@/helper'

export default function useNewCollection() {
  const router = useRouter()
  const size = useWindowSize()
  const [newCollection, setNewCollection] = useState({
    items: [],
    maxLength: 0,
  })
  const [loadingNewCollection, setLoadingNewCollection] = useState(false)

  const getNewCollection = async () => {
    try {
      const maxNewCollectionLength =
        size.width <= 598 ? 4 : size.width <= SIZE_BREAKPOINTS.lg ? 6 : 8
      setLoadingNewCollection(true)
      const newCollectionData = await request({
        ...NewCollection,
        variables: {
          limit: 16,
          current_page: 1,
        },
      })
      const collectionData = [...newCollectionData?.latestProducts?.data]
      const updatedCollectionData = generateSliderItemForLoop(
        collectionData,
        maxNewCollectionLength
      )
      setNewCollection({
        items: updatedCollectionData,
        maxLength: maxNewCollectionLength,
      })
      setLoadingNewCollection(false)
    } catch (error) {
      console.error('getNewCollection error', error)
      setLoadingNewCollection(false)
    }
  }

  const viewall = () => {
    router.push({
      pathname: '/shop',
      query: { sort: 'position,DESC,New Arrival' },
    })
  }
  useEffect(() => {
    getNewCollection()
  }, [size])
  return {
    viewall,
    newCollection,
    loadingNewCollection,
  }
}
