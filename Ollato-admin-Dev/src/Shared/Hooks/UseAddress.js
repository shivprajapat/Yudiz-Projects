import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCountriesAction, getAllDistrictAction, getAllStatesAction } from '../../Actions/auth'

export const useAddress = (initialState = false) => {
  // Initialize the state
  const [countryid, setCountryid] = useState()
  const [stateid, setStateid] = useState()
  const dispatch = useDispatch()

  // useselector
  const countriesArray = useSelector((state) => state.auth.countriesData)
  const statesArray = useSelector((state) => state.auth.statesData)
  const districtArray = useSelector((state) => state.auth.districtData)

  useEffect(() => {
    dispatch(getAllCountriesAction())
  }, [])

  useEffect(() => {
    if (countryid) {
      dispatch(getAllStatesAction(countryid))
    }
  }, [countryid])

  useEffect(() => {
    if (stateid) {
      dispatch(getAllDistrictAction(stateid))
    }
  }, [stateid])

  return { countryid, setCountryid, stateid, setStateid, countriesArray, statesArray, districtArray }
}
