import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import UserNotification from '../../../HOC/User/UserNotification'
import 'react-loading-skeleton/dist/skeleton.css'
const classNames = require('classnames')

function NotificationPage (props) {
  const {
    checkNotification, nList, loading, filterSlide, setFilterSlide, ApplyFilter, Filter, filterData, setFilter, setSkip, limit, token
  } = props
  const [selectedFilter, setSelectedFilter] = useState([])
  const scrollRef = React.createRef()
  const [hasMoreMatches, setHasMoreMatches] = React.useState(true)
  const [NotificationList, setNotificationList] = React.useState([])
  const previousProps = useRef({ nList }).current

  function handleScroll () { // handle the Scrolling
    if (loading || !hasMoreMatches) {
      return
    }
    const wrappedElement = scrollRef.current
    if (wrappedElement.scrollHeight - wrappedElement.scrollTop - wrappedElement.clientHeight <= 0) {
      setSkip(skip => skip + limit)
    }
  }

  useEffect(() => { // handle the response
    checkNotification()
  }, [token])

  useEffect(() => { // handle the response
    if (previousProps.nList !== nList) {
      if (nList && nList.length > 0) {
        setNotificationList((TransactionList) => [...TransactionList, ...nList])
        if (nList.length < limit) {
          setHasMoreMatches(false)
        }
      } else if (nList && nList.length === 0) {
        setHasMoreMatches(false)
      }
    }
    return () => {
      previousProps.nList = nList
    }
  }, [nList])

  function callApplyFilter () {
    ApplyFilter(Filter)
    setNotificationList([])
  }
  return (
    <>
      <div ref={scrollRef} className="user-container no-footer" onScroll={handleScroll}>
        <div className='notification-container'
          onClick={() => {
            if (filterSlide) setFilterSlide(false)
          }}
        >
          <div className='sort-box d-flex align-items-end justify-content-between pt-0'>
            <div className='sort-i position-relative' />
            {/* <button onClick={() => { setFilterSlide(true) }} className='d-flex justify-content-between f-btn mt-3'><i className='icon-sound-mixer'></i>{selectedFilter && selectedFilter.length !== 0 ? selectedFilter && selectedFilter.join(', ') : <FormattedMessage id="Select_Filters" />}</button> */}
          </div>
        </div>
        {loading
          ? Array(5).fill().map((item, index) => (
            <div key={index} className="notification-box">
              <Skeleton height={20} width={200} />
              <Skeleton className="my-2" height={10} width={100 + '%'} />
              <Skeleton className="my-2" height={10} width={50 + '%'} />
              <div className="text-end d-flex justify-content-end">
                <Skeleton height={10} width={70} />
              </div>
            </div>
          ))
          : NotificationList && NotificationList.length !== 0
            ? NotificationList.map(data => {
              return (
                <div key={data._id} className={classNames('notification-box', { readed: data.eStatus === 1 })}>
                  <h3 className={document.dir === 'rtl' ? 'text-end' : 'text-start'}>{data.sTitle}</h3>
                  <p className={document.dir === 'rtl' ? 'text-end' : 'text-start'}>{data.sMessage}</p>
                  <span className={`time ${document.dir === 'rtl' ? 'text-start' : 'text-end'}`}>
                    {new Intl.DateTimeFormat('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }).format(new Date(data.dCreatedAt))}
                  </span>
                </div>
              )
            })
            : NotificationList && NotificationList.length === 0 && <h1 className='centerFullWidth text-center mt-3'><FormattedMessage id="Notification_not_found" /></h1>
        }
        {filterSlide
          ? (
            <>
              <div className="s-team-bg" onClick={() => setFilterSlide(false)} />
              <Card className={classNames('filter-card', { show: filterSlide }) }>
                <CardHeader className='d-flex align-items-center justify-content-between'>
                  <button onClick={() => { setFilterSlide(false) }}>
                    <i className='icon-left' />
                    <FormattedMessage id="Filter_by" />
                  </button>
                </CardHeader>
                <CardBody>
                  <ul className='m-0 d-flex align-item-center flex-wrap'>
                    {
                  filterData && filterData.length !== 0
                    ? filterData.map(data => {
                      return (
                        <li key={data.id}>
                          <input checked={Filter.includes(data.id)} className='d-none' id='FilterData' name='filter' type='checkbox' />
                          <label htmlFor='FilterData'
                            onClick={() => {
                              if (Filter.includes(data.id)) {
                                setFilter(Filter.filter(fData => fData !== data.id))
                                setSelectedFilter(selectedFilter.filter(fData => fData !== data.sHeading))
                              } else {
                                setFilter([...Filter, data.id])
                                setSelectedFilter([...selectedFilter, data.sHeading])
                              }
                            }
                          }
                          >
                            {data.sHeading}
                            <i className='icon-checked' />
                          </label>
                        </li>
                      )
                    })
                    : <h3><FormattedMessage id="Fair_play_is_not_available" /></h3>
                }
                  </ul>
                </CardBody>
                <CardFooter className='p-0 border-0 bg-trnsparent'>
                  <Button className='w-100' color='primary' onClick={callApplyFilter}><FormattedMessage id="Apply_now" /></Button>
                </CardFooter>
              </Card>
            </>
            )
          : ''
        }
        {NotificationList && NotificationList.length !== 0 && <button className='bottomRight-btn' onClick={() => { setFilterSlide(true) }}><i className='icon-sound-mixer' /></button>}
      </div>
    </>
  )
}

NotificationPage.propTypes = {
  nList: PropTypes.array,
  ApplyFilter: PropTypes.func,
  loading: PropTypes.bool,
  token: PropTypes.string,
  filterSlide: PropTypes.bool,
  limit: PropTypes.Number,
  listed: PropTypes.array,
  filterData: PropTypes.array,
  Filter: PropTypes.string,
  setFilter: PropTypes.func,
  setFilterSlide: PropTypes.func,
  setSkip: PropTypes.func,
  checkNotification: PropTypes.func,
  GetCount: PropTypes.func,
  nCount: PropTypes.array
}

export default UserNotification(NotificationPage)
