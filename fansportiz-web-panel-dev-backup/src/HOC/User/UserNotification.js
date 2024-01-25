import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveSports from '../../api/activeSports/queries/useActiveSports'
import { GetNotification, GetNotificationCount, GetFilterList } from '../../redux/actions/notification'

export const UserNotification = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const token = localStorage.getItem('Token')
    const resStatus = useSelector(state => state.notification.resStatus)
    const resMessage = useSelector(state => state.notification.resMessage)
    const notificationTypeList = useSelector(state => state.notification.notificationTypeList)
    const notificationList = useSelector(state => state.notification.notificationList)
    const nCount = useSelector(state => state.notification.nCount)
    const { data: activeSports } = useActiveSports()

    const [filterSlide, setFilterSlide] = useState(false)
    const [filterData, setFilterData] = useState([])
    const [listed, setListed] = useState([])
    const [loading, setLoading] = useState(false)
    const [nList, setnList] = useState([])
    const [Filter, setFilter] = useState([])
    const [Filterd] = useState([])
    const [limit] = useState(10)
    const [skip, setSkip] = useState(0)
    const previousProps = useRef({ notificationTypeList, notificationList, resMessage, resStatus }).current

    useEffect(() => {
      if (token) {
        if (!nCount) { getCountFun() }
      }
    }, [token])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage && resStatus !== null) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    function getNListFun (Filterd, limit, skip) {
      if (token) {
        dispatch(GetNotification(Filterd, limit, skip, token))
      }
    }

    function getCountFun () {
      token && dispatch(GetNotificationCount(token))
    }

    useEffect(() => {
      if (previousProps.notificationList !== notificationList) {
        setnList(notificationList)
        token && dispatch(GetNotificationCount(token))
      }
      return () => {
        previousProps.notificationList = notificationList
      }
    }, [notificationList])

    useEffect(() => {
      if (skip > 0) {
        getNListFun(Filterd, limit, skip)
      }
    }, [skip])

    useEffect(() => {
      if (previousProps.notificationTypeList !== notificationTypeList) {
        const filtersData = []
        if (notificationTypeList && notificationTypeList.length > 0) {
          notificationTypeList.map((notification) => {
            if (notification.sHeading) {
              if (!filtersData.includes(notification.sHeading)) {
                filtersData.push({ sHeading: notification.sHeading, id: notification._id })
              }
            }
            return notification
          })
          setFilterData(filtersData)
        }
        setLoading(false)
      }
      return () => {
        previousProps.notificationTypeList = notificationTypeList
      }
    }, [notificationTypeList])

    // function onGetActiveSports () {
    //   dispatch(GetActiveSports())
    // }

    const ApplyFilter = (value) => {
      setListed([])
      setFilterSlide(false)
      setSkip(0)
      getNListFun(value, limit, 0)
    }

    function checkNotification () {
      getNListFun(Filterd, limit, skip)
      dispatch(GetFilterList(token))
      setLoading(true)
    }

    return (
      <Component
        {...props}
        ApplyFilter={ApplyFilter}
        Filter={Filter}
        GetCount={getCountFun}
        activeSports={activeSports}
        checkNotification={checkNotification}
        filterData={filterData}
        filterSlide={filterSlide}
        getNList={getNListFun}
        limit={limit}
        listed={listed}
        loading={loading}
        nCount={nCount}
        nList={nList}
        resMessage={resMessage}
        resStatus={resStatus}
        setFilter={setFilter}
        setFilterSlide={setFilterSlide}
        setSkip={setSkip}
        token={token}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}
export default UserNotification
