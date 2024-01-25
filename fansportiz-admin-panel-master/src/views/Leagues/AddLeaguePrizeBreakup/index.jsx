import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import AddPrizeBreakUp from './AddPrizeBreakUp'
import { addLeaguePrice, getLeagueDetails, getLeaguePriceDetails, updateLeaguePrice } from '../../../actions/league'
import PropTypes from 'prop-types'

function AddLeaguePrizeBreakup (props) {
  const { match } = props
  const token = useSelector(state => state.auth.token)
  const LeaguePriceDetails = useSelector(state => state.league.LeaguePriceDetails)
  const LeagueDetails = useSelector(state => state.league.LeagueDetails)
  const [leaguePrize, setleaguePrize] = useState('')
  const [PriceBreakupId, setPriceBreakupId] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (match.params.id1 && match.params.id2) {
      getLeaguePriceBreakupDetails()
    }
    if (match.params.id1) {
      getLeagueDetailsFunc()
    }
    setleaguePrize(match.params.id1)
  }, [])

  function AddNewLeaguePrice (price, rFrom, rTo, rType, extra, PrizeBreakupImage) {
    const addLeaguePriceData = {
      price, rFrom, rTo, rType, extra, PrizeBreakupImage, ID: leaguePrize, token
    }
    dispatch(addLeaguePrice(addLeaguePriceData))
  }
  function UpdateLeaguePricefun (price, rFrom, rTo, rType, extra, PrizeBreakupImage) {
    const updateLeaguePriceData = {
      price, rFrom, rTo, rType, extra, PrizeBreakupImage, ID1: leaguePrize, ID2: PriceBreakupId, token
    }
    dispatch(updateLeaguePrice(updateLeaguePriceData))
  }

  function getLeaguePriceBreakupDetails () {
    dispatch(getLeaguePriceDetails(match.params.id1, match.params.id2, token))
    setPriceBreakupId(match.params.id2)
  }

  function getLeagueDetailsFunc () {
    dispatch(getLeagueDetails(match.params.id1, token))
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <AddPrizeBreakUp
        {...props}
        AddNewLeaguePrice={AddNewLeaguePrice}
        UpdateLeaguePrice={UpdateLeaguePricefun}
        LeaguePriceDetails={LeaguePriceDetails}
        LeagueDetails={LeagueDetails}
        cancelLink={`/league/league-Prize/${leaguePrize}`}
        getLeaguePriceBreakupDetails={getLeaguePriceBreakupDetails}
        getLeagueDetailsFunc={getLeagueDetailsFunc}
        />
    </Fragment>
  )
}

AddLeaguePrizeBreakup.propTypes = {
  match: PropTypes.object
}

export default AddLeaguePrizeBreakup
