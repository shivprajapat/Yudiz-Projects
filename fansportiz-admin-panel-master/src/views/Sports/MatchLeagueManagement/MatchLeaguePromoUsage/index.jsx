import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SportsHeader from '../../SportsHeader'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchLeagueDetails, getPromoCodeUsageList } from '../../../../actions/matchleague'
import MatchLeaguePromoUsage from './MatchLeaguePromoUsage'
import qs from 'query-string'
import { getMatchDetails } from '../../../../actions/match'
import Navbar from '../../../../components/Navbar'

const PromoUsage = props => {
  const { match } = props
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const [matchName, setMatchName] = useState('')
  const [matchLeagueName, setMatchLeagueName] = useState('')
  const token = useSelector(state => state.auth.token)
  const promoUsageList = useSelector(state => state.matchleague.promoUsageList)
  const matchDetails = useSelector(state => state.match.matchDetails)
  const matchLeagueDetails = useSelector(state => state.matchleague.matchLeagueDetails)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''
  const dispatch = useDispatch()

  useEffect(() => {
    if (match.params.id1) {
      dispatch(getMatchDetails(match.params.id1, token))
    }
    if (match.params.id2) {
      dispatch(getMatchLeagueDetails(match.params.id2, token))
    }
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  useEffect(() => {
    if (matchDetails) {
      setMatchName(matchDetails.sName)
    }
  }, [matchDetails])

  useEffect(() => {
    if (matchLeagueDetails) {
      setMatchLeagueName(matchLeagueDetails.sName)
    }
  }, [matchLeagueDetails])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setInitialFlag(true)
  }

  function getList (start, limit, search) {
    dispatch(getPromoCodeUsageList(start, limit, search, match.params.id2, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function onExport () {
    content.current.onExport()
  }

  function heading () {
    if (matchName && matchLeagueName) {
      if (window.innerWidth <= 480) {
        return <div>Promo Code Usage List <p className='mb-0'>{`(${matchName})`}</p> <p className='mb-0'>{`(${matchLeagueName})`}</p></div>
      } else {
        return <div>Promo Code Usage List {`(${matchName} - ${matchLeagueName})`}</div>
      }
    } else {
      return 'Promo Code Usage List'
    }
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            // heading={(matchName && matchLeagueName) ? `Promo Code Usage List (${matchName} - ${matchLeagueName})` : 'Promo Code Usage List'}
            heading={heading()}
            handleSearch={onHandleSearch}
            buttonText="Promo Usage List"
            SearchPlaceholder="Search"
            onRefresh={onRefreshFun}
            promoUsageList={promoUsageList}
            onExport={onExport}
            search={searchText}
            refresh
            matchLeaguePage={`/${sportsType}/match-management/match-league-management/${match.params.id1}`}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
            goBack={props?.location?.state?.goBack}
          />
          <MatchLeaguePromoUsage
            {...props}
            ref={content}
            List={promoUsageList}
            getList={getList}
            searchText={searchText}
            flag={initialFlag}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
          />
        </section>
      </main>
    </Fragment>
  )
}

PromoUsage.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default PromoUsage
