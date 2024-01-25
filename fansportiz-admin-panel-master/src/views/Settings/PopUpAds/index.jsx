import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPopUpAdsList } from '../../../actions/popup'
import Navbar from '../../../components/Navbar'
import Heading from '../component/Heading'
import PopupAdList from './PopUpAdList'
import qs from 'query-string'
import PropTypes from 'prop-types'

function PopupAdsManagement (props) {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const popUpAdsList = useSelector(state => state.popup.popUpAdsList)
  const content = useRef()

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

  function onExport () {
    content.current.onExport()
  }

  function getPopupAds (start, limit, type, search) {
    dispatch(getPopUpAdsList(start, limit, type, search.trim(), token))
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            info
            heading="Popup Ads Management"
            buttonText="Add Pop Up"
            setUrl="/settings/add-popup-ad"
            onExport={onExport}
            list={popUpAdsList}
            handleSearch={onHandleSearch}
            search={searchText}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.POPUP_ADS !== 'R')}
          />
          <PopupAdList
            {...props}
            ref={content}
            search={searchText}
            flag={initialFlag}
            getList={getPopupAds}
            popUpAdsList={popUpAdsList}
          />
        </section>
      </main>
    </Fragment>
  )
}

PopupAdsManagement.propTypes = {
  location: PropTypes.object
}

export default PopupAdsManagement
