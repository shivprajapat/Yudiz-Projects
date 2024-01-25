import { useEffect, useState } from 'react'
import { ExhibitionBanner } from '@/queries'
import { request } from '@/services/api.service'

export default function useExhibitionBanner() {
  const [exhibitionBanner, setExhibitionBanner] = useState()

  const getExhibitionBanner = async () => {
    const exhibitionBannerData = await request(ExhibitionBanner)
    setExhibitionBanner(exhibitionBannerData?.exhibitionBanner)
  }

  useEffect(() => {
    getExhibitionBanner()
  }, [])

  return {
    exhibitionBanner,
  }
}
