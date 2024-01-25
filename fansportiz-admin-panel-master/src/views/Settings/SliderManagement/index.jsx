import React, { Fragment, useEffect, useState, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import SliderManagementContent from './SliderManagementContent'
import PropTypes from 'prop-types'
import { getBannerList } from '../../../actions/banner'

function SliderManagement (props) {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const bannerList = useSelector(state => state.banner.bannerList)
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

  function getSliderList (start, limit, sort, order, search) {
    dispatch(getBannerList(start, limit, sort, order, search.trim(), token))
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            info
            heading="Sliders"
            buttonText="Add Slider"
            setUrl="/settings/add-slider"
            SearchPlaceholder="Search Slider"
            handleSearch={onHandleSearch}
            search={searchText}
            onExport={onExport}
            list={bannerList}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.BANNER !== 'R')}
          />
          <SliderManagementContent
            {...props}
            ref={content}
            search={searchText}
            flag={initialFlag}
            getList={getSliderList}
            bannerList={bannerList}
          />
        </section>
      </main>
    </Fragment>
  )
}

SliderManagement.propTypes = {
  location: PropTypes.object
}

export default SliderManagement
