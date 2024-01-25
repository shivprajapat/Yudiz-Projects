import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import UserListHeader from '../../../Component/UsersListHeader'
import UserReferrals from './UserReferrals'
import { getReferredList } from '../../../../../actions/users'
import Navbar from '../../../../../components/Navbar'

function ReferralIndex (props) {
  const { match } = props
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useQueryState('search', '')
  const [initialFlag, setInitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const referredList = useSelector(state => state.users.referredList)
  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setInitialFlag(true)
  }

  function getReferralsListFun (start, limit, sort, order, search) {
    const data = {
      start, limit, sort, order, search, userId: match.params.id, token
    }
    dispatch(getReferredList(data))
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <UserListHeader
            heading="Referrals"
            handleSearch={onHandleSearch}
            search={searchText}
            list={referredList}
            onExport={onExport}
            hideDateBox
            userDetailsPage={`/users/user-management/user-details/${match.params.id}`}
          />
          <UserReferrals
            {...props}
            ref={content}
            search={searchText}
            flag={initialFlag}
            getList={getReferralsListFun}
            referredList={referredList}
          />
        </section>
      </main>
    </Fragment>
  )
}

ReferralIndex.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default ReferralIndex
