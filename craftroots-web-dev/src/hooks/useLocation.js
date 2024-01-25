import { useEffect, useState } from 'react'
import { Countries, States } from '@/queries/homePageQueries'
import { request } from '@/services/api.service'
import { CountriesShipping, StatesShipping } from '@/queries/checkoutQueries'

export default function useLocation({ shipping }) {
  const [countryId, setCountryId] = useState()
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const getNewCountries = async () => {
    let countries
    if (shipping) {
      const result = await request(CountriesShipping)
      countries = result?.countries?.map((country) => ({
        value: country.id,
        label: country.full_name_english,
      }))
    } else {
      const result = await request(Countries)
      countries = result?.getAllCountry?.data?.map((country) => ({
        value: country.country_code,
        label: country.country_name,
      }))
    }
    setCountries(countries || [])
  }

  useEffect(() => {
    if (countryId) {
      let states
      async function getStates() {
        if (!shipping) {
          const result = await request({
            ...States,
            variables: {
              country_code: countryId,
            },
          })
          states = result?.getRegionData?.data?.map((region) => ({
            value: region.region_code,
            label: region.region_name,
          }))
        } else {
          const result = await request({
            ...StatesShipping,
            variables: {
              country_code: countryId,
            },
          })
          states = result?.country?.available_regions?.map((region) => ({
            value: region.id,
            label: region.name,
          }))
        }
        setStates(states || [])
      }
      getStates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId])

  useEffect(() => {
    getNewCountries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { countries, countryId, setCountryId, states }
}
