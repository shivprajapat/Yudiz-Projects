import { useEffect, useState } from 'react'
import { ArtisanStory } from '@/queries'
import { request } from '@/services/api.service'

export default function useArtisanStory() {
  const [artisanStory, setArtisanStory] = useState([])

  const getArtisanStory = async () => {
    const artisanStoryData = await request(ArtisanStory)
    setArtisanStory(artisanStoryData?.artisanStory)
  }

  useEffect(() => {
    getArtisanStory()
  }, [])

  return {
    artisanStory,
  }
}
