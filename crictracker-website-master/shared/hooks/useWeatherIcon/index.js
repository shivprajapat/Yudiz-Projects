import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'

const OneD = dynamic(() => import('@shared/components/ctIcons/weather-icons/oned'))
const OneN = dynamic(() => import('@shared/components/ctIcons/weather-icons/onen'))
const TwoD = dynamic(() => import('@shared/components/ctIcons/weather-icons/twod'))
const TwoN = dynamic(() => import('@shared/components/ctIcons/weather-icons/twon'))
const ThreeD = dynamic(() => import('@shared/components/ctIcons/weather-icons/threed'))
const FourD = dynamic(() => import('@shared/components/ctIcons/weather-icons/fourd'))
const NineD = dynamic(() => import('@shared/components/ctIcons/weather-icons/nined'))
const TenD = dynamic(() => import('@shared/components/ctIcons/weather-icons/tend'))
const TenN = dynamic(() => import('@shared/components/ctIcons/weather-icons/tenn'))
const ElevenD = dynamic(() => import('@shared/components/ctIcons/weather-icons/elevend'))
const ThirteenD = dynamic(() => import('@shared/components/ctIcons/weather-icons/thirteend'))
const FiftyD = dynamic(() => import('@shared/components/ctIcons/weather-icons/fiftyd'))

export default function useWeatherIcon() {
  const getWeatherImage = useCallback(function getWeatherImage(weatherCode) {
    const Images = {
      '01d': <OneD />,
      '01n': <OneN />,
      '02d': <TwoD />,
      '02n': <TwoN />,
      '03d': <ThreeD />,
      '03n': <ThreeD />,
      '04d': <FourD />,
      '04n': <FourD />,
      '09d': <NineD />,
      '09n': <NineD />,
      '10d': <TenD />,
      '10n': <TenN />,
      '11d': <ElevenD />,
      '11n': <ElevenD />,
      '13d': <ThirteenD />,
      '13n': <ThirteenD />,
      '50d': <FiftyD />,
      '50n': <FiftyD />
    }
    return Images[weatherCode] || <TwoD />
  }, [])

  return { getWeatherImage }
}
