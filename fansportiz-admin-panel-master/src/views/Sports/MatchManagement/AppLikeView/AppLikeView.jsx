import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Match from './Match'
import SkeletonTable from '../../../../components/SkeletonTable'
import NoDataFound from '../../../../assets/images/no_data_found.svg'
import { Col, Row } from 'reactstrap'
import { useSelector } from 'react-redux'

const AppLikeView = forwardRef((props, ref) => {
  const { getList, List, matchStatus, getMatchesTotalCountFunc, sportsType, getMediaUrlFunc } = props

  const [upcomingMatches, setUpcomingMatches] = useState([])
  const [liveMatches, setLiveMatches] = useState([])
  const [inReviewMatches, setInReviewMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const matchesTotalCount = useSelector(state => state.match.matchesTotalCount)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const previousProps = useRef({ List, matchStatus, matchesTotalCount }).current

  useEffect(() => {
    getMatchCounts()
    getMediaUrlFunc()
  }, [sportsType])

  useEffect(() => {
    if (props.location && props.location.pathname.includes('/matches-app-view')) {
      localStorage.setItem('AppView', true)
    }
  }, [props.location])

  function getMatchCounts () {
    getMatchesTotalCountFunc('U', '', '', '', '', '', '')
    getMatchesTotalCountFunc('L', '', '', '', '', '', '')
    getMatchesTotalCountFunc('I', '', '', '', '', '', '')
    setLoading(true)
  }

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if ((previousProps.matchesTotalCount !== matchesTotalCount) && matchStatus === 'U') {
      const limit = matchesTotalCount?.count
      getList(0, limit, 'dCreatedAt', 'desc', '', 'U', '', '', '', '', '')
    } else if ((previousProps.matchesTotalCount !== matchesTotalCount) && matchStatus === 'L') {
      const limit = matchesTotalCount?.count
      getList(0, limit, 'dCreatedAt', 'desc', '', 'L', '', '', '', '', '')
    } else if ((previousProps.matchesTotalCount !== matchesTotalCount) && matchStatus === 'I') {
      const limit = matchesTotalCount?.count
      getList(0, limit, 'dCreatedAt', 'desc', '', 'I', '', '', '', '', '')
    }
    return () => {
      previousProps.matchesTotalCount = matchesTotalCount
      previousProps.matchStatus = matchStatus
    }
  }, [matchesTotalCount, matchStatus])

  useEffect(() => {
    if ((previousProps.List !== List) && matchStatus === 'U') {
      const matches = List?.results.sort(function (a, b) {
        return new Date(a.dStartDate) - new Date(b.dStartDate)
      })
      let top = []
      let bottom = []
      if (matches.length !== 0) {
        top = matches.filter(match => match.bMatchOnTop)
        bottom = matches.filter(match => !match.bMatchOnTop)
      }
      setUpcomingMatches([...top, ...bottom])
      setLoading(false)
    } else if ((previousProps.List !== List) && matchStatus === 'L') {
      setLiveMatches(List?.results)
      setLoading(false)
    } else if ((previousProps.List !== List) && matchStatus === 'I') {
      setInReviewMatches(List?.results)
      setLoading(false)
    }
    return () => {
      previousProps.List = List
      previousProps.matchStatus = matchStatus
    }
  }, [List, matchStatus])

  function onRefresh () {
    getMatchCounts()
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  return (
    <Row>
      <Col lg='4'>
      <h2 className='text-center'>Upcoming</h2>
      <div className='home-container'>
      {loading
        ? <SkeletonTable numberOfColumns={5} matchView/>
        : (
            <Fragment>
              {upcomingMatches && upcomingMatches.length !== 0 && upcomingMatches.map((data, i) => {
                return (
                  <div key={i}>
                    <Match {...props} data={data} url={url} key={i}/>
                  </div>)
              }
              )
              }
              {
                upcomingMatches && !upcomingMatches.length && (
                <div className="no-team d-flex align-items-center justify-content-center">
                  <div>
                    <img src={NoDataFound}></img>
                    <h6>No match found</h6>
                  </div>
                </div>
                )
              }
            </Fragment>
          )
          }
          </div>
        </Col>
      <Col lg='4' className='custom-box'>
      <h2 className='text-center'>Live</h2>
      <div className='home-container'>
      {loading
        ? <SkeletonTable numberOfColumns={5} matchView/>
        : (
            <Fragment>
              {liveMatches && liveMatches.length !== 0 && liveMatches.sort(function (a, b) {
                return new Date(b.dStartDate) - new Date(a.dStartDate)
              }).map((data, i) => {
                return (
                  <div key={i}>
                    <Match {...props} data={data} url={url} key={i}/>
                  </div>)
              }
              )
              }
              {
                liveMatches && !liveMatches.length && (
                <div className="no-team d-flex align-items-center justify-content-center">
                  <div>
                    <img src={NoDataFound}></img>
                    <h6>No match found</h6>
                  </div>
                </div>
                )
              }
            </Fragment>
          )
          }
        </div>
      </Col>
      <Col lg='4' className='custom-box'>
      <h2 className='text-center'>In-Review</h2>
      <div className='home-container'>
      {loading
        ? <SkeletonTable numberOfColumns={5} matchView/>
        : (
            <Fragment>
              {inReviewMatches && inReviewMatches.length !== 0 && inReviewMatches.sort(function (a, b) {
                return new Date(b.dStartDate) - new Date(a.dStartDate)
              }).map((data, i) => {
                return (
                  <div key={i}>
                    <Match {...props} data={data} url={url} key={i}/>
                  </div>)
              }
              )
              }
              {
                inReviewMatches && !inReviewMatches.length && (
                <div className="no-team d-flex align-items-center justify-content-center">
                  <div>
                    <img src={NoDataFound} alt='No image found'></img>
                    <h6>No match found</h6>
                  </div>
                </div>
                )
              }
            </Fragment>
          )
          }
          </div>
        </Col>
      </Row>
  )
})

AppLikeView.propTypes = {
  getList: PropTypes.func,
  List: PropTypes.object,
  matchStatus: PropTypes.string,
  getMatchesTotalCountFunc: PropTypes.func,
  sportsType: PropTypes.string,
  location: PropTypes.object,
  getMediaUrlFunc: PropTypes.func
}

AppLikeView.displayName = AppLikeView

export default AppLikeView
