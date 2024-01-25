import React, { Fragment, useEffect, useState, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import OfferManagementContent from './OfferManagementContent'
import PropTypes from 'prop-types'
import { getOfferList, updateOffer } from '../../../actions/offers'

function OfferManagement (props) {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const offerList = useSelector(state => state.offers.offerList)
  const content = useRef()

  function onExport () {
    content.current.onExport()
  }

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function getOffersList (start, limit, sort, order, search) {
    dispatch(getOfferList(start, limit, sort, order, search.trim(), token))
  }

  function updateOfferFunc (data, id) {
    dispatch(updateOffer(data, id, token))
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            info
            list={offerList}
            heading="Offers"
            buttonText="Add Offer"
            setUrl="/settings/add-offer"
            SearchPlaceholder="Search offer"
            handleSearch={onHandleSearch}
            search={searchText}
            onExport={onExport}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.OFFER === 'W')}
          />
          <OfferManagementContent
            {...props}
            ref={content}
            search={searchText}
            flag={initialFlag}
            getList={getOffersList}
            offerList={offerList}
            updateOfferFunc={updateOfferFunc}
          />
        </section>
      </main>
    </Fragment>
  )
}

OfferManagement.propTypes = {
  location: PropTypes.object
}

export default OfferManagement
