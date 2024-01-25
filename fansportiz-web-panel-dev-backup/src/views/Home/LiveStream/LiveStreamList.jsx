import React, { Fragment, useEffect, useState, useRef, createRef } from 'react'
import PropTypes from 'prop-types'
import { NavLink, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import Match from '../components/Match'
import Loading from '../../../component/Loading'
import SkeletonUpcoming from '../../../component/SkeletonUpcoming'
import NoDataFound from '../../../assests/images/ic_no_data_found.svg'
import { Nav } from 'reactstrap'
import UserLiveStream from '../../../HOC/User/UserLiveStream'

function LiveStreamList (props) {
  const { getStreamList, loading, FetchLiveStreamList } = props
  const [List, setList] = React.useState([])
  const scrollRef = createRef()
  const [hasMoreMatches, setHasMoreMatches] = React.useState(true)
  const [limit] = useState(10)
  const [skip, setSkip] = useState(0)
  const previousProps = useRef({ skip, getStreamList }).current

  const { type } = useParams()

  useEffect(() => {
    setList([])
  }, [])

  useEffect(() => {
    if (type) {
      setList([])
    }
  }, [type])

  useEffect(() => {
    if (previousProps.getStreamList !== getStreamList) {
      if (getStreamList && getStreamList.length > 0) {
        setList((list) => [...list, ...getStreamList])
        if (getStreamList.length < limit) {
          setHasMoreMatches(false)
        }
      }
    }
    return () => {
      previousProps.getStreamList = getStreamList
    }
  }, [getStreamList])

  useEffect(() => {
    if (previousProps.skip !== skip) {
      if (skip) {
        FetchLiveStreamList(skip, limit)
      }
    }
    return () => {
      previousProps.skip = skip
    }
  }, [skip])

  function handleScroll () {
    if (loading || !hasMoreMatches) {
      return
    }
    const wrappedElement = scrollRef.current
    if (wrappedElement.scrollHeight - wrappedElement.scrollTop - wrappedElement.clientHeight <= 0) {
      setSkip(skip => skip + limit)
    }
  }
  return (
    <>
      {
      loading
        ? <Loading />
        : (
          <Fragment>
            <div>
              <Nav className="d-flex live-tabs justify-content-around bg-white b-bottom">
                <li className='w50 text-center'>
                  <NavLink activeClassName='active' to="/live-stream/L" >
                    <FormattedMessage id="Live" />
                  </NavLink>
                </li>
                <li className='w50 text-center'>
                  <NavLink activeClassName='active' to="/live-stream/CMP" >
                    <FormattedMessage id="Completed" />
                  </NavLink>
                </li>
              </Nav>
            </div>
            <div ref={scrollRef} className="home-container" onScroll={handleScroll}>
              {loading
                ? <SkeletonUpcoming />
                : (
                  <Fragment>
                    {
                        List && List.length !== 0 && List.map((data, i) => {
                          return (
                            <Match {...props} key={i} completed={type === 'CMP'} data={data} liveStream loading={loading} onlyInsideFeild/>
                          )
                        })
                      }
                    {
                        List && List.length === 0 && (
                        <div className="no-team d-flex align-items-center justify-content-center fixing-width2">
                          <div className="">
                            <img src={NoDataFound} />
                            <h6>
                              <FormattedMessage id="No_Match_Found" />
                            </h6>
                          </div>
                        </div>
                        )
                      }
                  </Fragment>
                  )
                }
            </div>
          </Fragment>
          )
    }
    </>
  )
}

LiveStreamList.propTypes = {
  loading: PropTypes.bool,
  getStreamList: PropTypes.array,
  FetchLiveStreamList: PropTypes.func
}

export default UserLiveStream(LiveStreamList)
