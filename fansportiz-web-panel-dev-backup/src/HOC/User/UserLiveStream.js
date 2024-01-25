import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { onGetLiveStreamList } from '../../redux/actions/profile'
import { useParams } from 'react-router-dom'

export const UserLiveStream = (Component) => {
  function MyComponent (props) {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const token = useSelector((state) => state.auth.token) || localStorage.getItem('Token')
    const getUrlLink = useSelector((state) => state.url.getUrl)
    const getStreamList = useSelector((state) => state.profile.getStreamList)
    const previousProps = useRef({ getStreamList, getUrlLink }).current

    const { type } = useParams()

    useEffect(() => {
      if (token && type) {
        dispatch(onGetLiveStreamList(0, 10, type, token))
        setLoading(true)
      }
      if (getUrlLink && token) {
        setUrl(getUrlLink)
      }
    }, [token, type])

    useEffect(() => {
      if (previousProps.getUrlLink !== getUrlLink) {
        if (getUrlLink) {
          setUrl(getUrlLink)
        }
      }
      return () => {
        previousProps.getUrlLink = getUrlLink
      }
    }, [getUrlLink])

    useEffect(() => {
      if (previousProps.getStreamList !== getStreamList) {
        if (getStreamList) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.getStreamList = getStreamList
      }
    }, [getStreamList])

    function FetchLiveStreamList (start, limit) {
      if (token && type) {
        dispatch(onGetLiveStreamList(start, limit, type, token))
        setLoading(true)
      }
    }

    return (
      <Component
        {...props}
        FetchLiveStreamList={FetchLiveStreamList}
        getStreamList={getStreamList}
        getUrlLink={getUrlLink}
        loading={loading}
        url={url}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object
  }
  return MyComponent
}
export default UserLiveStream
