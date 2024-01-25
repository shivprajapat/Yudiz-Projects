import React, {
  Fragment, useState, useEffect, useRef
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PointSystemManagement from './PointSystemManagement'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../../Settings/component/Heading'
import { getFormatsList, getPointSystemList } from '../../../actions/pointSystem'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'

function PointSystem (props) {
  const [format, setFormat] = useQueryState('format', '')
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const getPointSystemsList = useSelector(state => state.pointSystem.getPointSystemList)
  const FormatsList = useSelector(state => state.pointSystem.getFormatsList)
  const dispatch = useDispatch()
  const content = useRef()

  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  const previousProps = useRef({ format, sportsType }).current

  function onExport () {
    content.current.onExport()
  }

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
    if (obj.format) {
      setFormat(obj.format)
    }
    // getFormatList(sportsType)
  }, [])

  useEffect(() => {
    if (format && (previousProps.format !== format)) {
      getList(searchText)
      setLoading(true)
    }

    return () => {
      previousProps.format = format
    }
  }, [format])

  useEffect(() => {
    getFormatList(sportsType)
    if (previousProps.sportsType !== sportsType) {
      if (sportsType === 'cricket') {
        setFormat('T20')
      }
      if (sportsType === 'football') {
        setFormat('FOOTBALL')
      }
      if (sportsType === 'basketball') {
        setFormat('BASKETBALL')
      }
      if (sportsType === 'kabaddi') {
        setFormat('KABADDI')
      }

      setLoading(true)
      setSearchText('')
    }

    return () => {
      previousProps.sportsType = sportsType
    }
  }, [sportsType])

  function formatChangefun (e) {
    setFormat(e.target.value)
  }

  function getFormatList (type) {
    dispatch(getFormatsList(type, token))
  }

  function getList (search) {
    let type
    if (!format) {
      if (sportsType === 'cricket') {
        type = 'T20'
      }
      if (sportsType === 'football') {
        type = 'FOOTBALL'
      }
      if (sportsType === 'basketball') {
        type = 'BASKETBALL'
      }
      if (sportsType === 'kabaddi') {
        type = 'KABADDI'
      }
      dispatch(getPointSystemList(search.trim(), type, token))
    } else {
      dispatch(getPointSystemList(search.trim(), format, token))
    }
    // getFormatList(sportsType)
  }

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            info
            pointSystem
            heading="Point System"
            handleChange={formatChangefun}
            format={format}
            handleSearch={onHandleSearch}
            search={searchText}
            FormatsList={FormatsList}
            permission
            onExport={onExport}
          />
          <PointSystemManagement
            {...props}
            ref={content}
            search={searchText}
            flag={initialFlag}
            getList={getList}
            format={format}
            getPointSystemsList={getPointSystemsList}
            setLoading={setLoading}
            loading={loading}
            getFormatList={getFormatList}
            sportsType={sportsType}
          />
        </section>
      </main>
    </Fragment>
  )
}

PointSystem.propTypes = {
  location: PropTypes.object
}

export default PointSystem
