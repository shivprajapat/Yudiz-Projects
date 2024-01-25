import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Card, CardHeader, PopoverBody, UncontrolledPopover } from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
// import ReactPullToRefresh from 'react-pull-to-refresh'
// import PullToRefresh from 'react-simple-pull-to-refresh'
import League from './League'
import TrophyHeader from '../../../assests/images/trophy-c.svg'
import SkeletonLeague from '../../../component/SkeletonLeague'
import InfoIconGray from '../../../assests/images/info-icon-gray.svg'
import trophy from '../../../assests/images/noDataTrophy.svg'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function LeagueContest (props) {
  const [data, setData] = useState({})
  // const [loadingData, setLoadingData] = useState(true)
  const {
    list, loading, listed, sortBy, setFilterData
    // handleRefreshFun
  } = props
  const previousProps = useRef({
    list, listed
  }).current
  // const [listedNew, setListed] = useState(listed)
  const { sMediaUrl } = useGetUrl()

  useEffect(() => {
    const leagues = {}
    const filtersData = []
    if (list) {
      list?.length > 0 && list.sort((a, b) => a.oLeagueCategory?.nPosition - b.oLeagueCategory?.nPosition).map((league) => {
        if (league?.oLeagueCategory?.sTitle) {
          if (!leagues[league?.oLeagueCategory?.sTitle]) {
            leagues[league?.oLeagueCategory?.sTitle] = []
          }
          leagues[league?.oLeagueCategory?.sTitle].push(league)
        } else {
          if (!leagues['']) {
            leagues[''] = []
          }
          leagues[''].push(league)
        }
        if (league.sFilterCategory) {
          if (!filtersData.includes(league.sFilterCategory)) {
            filtersData.push(league.sFilterCategory)
          }
        }
        return leagues
      })
      setFilterData(filtersData)
      setData(leagues)
      // setLoadingData(false)
    }
    return () => {
      previousProps.list = list
    }
  }, [list])

  useEffect(() => {
    const leagues = {}
    const filtersData = []
    if (listed && sortBy === 'Popularity') {
      listed?.length > 0 && listed.sort((a, b) => a.oLeagueCategory?.nPosition - b.oLeagueCategory?.nPosition).map((league) => {
        if (league?.oLeagueCategory?.sTitle) {
          if (!leagues[league?.oLeagueCategory?.sTitle]) {
            leagues[league?.oLeagueCategory?.sTitle] = []
          }
          leagues[league?.oLeagueCategory?.sTitle].push(league)
        } else {
          if (!leagues['']) {
            leagues[''] = []
          }
          leagues[''].push(league)
        }
        if (league.sFilterCategory) {
          if (!filtersData.includes(league.sFilterCategory)) {
            filtersData.push(league.sFilterCategory)
          }
        }
        return leagues
      })
      setFilterData(filtersData)
      setData(leagues)
      // setLoadingData(false)
    }
    return () => {
      previousProps.listed = listed
    }
  }, [listed])

  // function handleRefresh () {
  //   handleRefreshFun()
  // }

  return (
  // <PullToRefresh
  //   onRefresh={handleRefresh}
  //   pullDownThreshold={15}
  //   refreshingContent={true}
  // >
    <div>
      {
          (loading)
            ? <SkeletonLeague length={1} />
            : (sortBy === 'Popularity')
                ? data && Object.keys(data).length > 0
                  ? Object.entries(data).map(([key, value], index) => {
                    const image = value?.length > 0 && value[0] && value[0].oLeagueCategory && value[0].oLeagueCategory.sImage
                    return (
                      <Fragment key={key}>
                        <Card className="leagues-card border-0 bg-transparent">
                          <CardHeader className="border-0 mt-3 d-flex justify-content-between">
                            <div>
                              <img alt="Trophy" src={image && sMediaUrl ? `${sMediaUrl}${image}` : TrophyHeader} width="24px" />
                              <span className='leagues-card-title'>{key}</span>
                            </div>
                            {
                            value && value.length > 0 && value[0] && value[0]?.oLeagueCategory?.sTitle === key && value[0].oLeagueCategory?.sRemark && (
                            <Fragment>
                              <button className="bg-transparent i-button match-i" id={`id${index}`} type="button"><img src={InfoIconGray} /></button>
                              <UncontrolledPopover placement="bottom" target={`id${index}`} trigger="legacy">
                                <PopoverBody>{value && value.length > 0 && value[0] && value[0]?.oLeagueCategory?.sTitle === key ? value[0].oLeagueCategory?.sRemark : ''}</PopoverBody>
                              </UncontrolledPopover>
                            </Fragment>
                            )}
                          </CardHeader>
                          {
                          value && value.length !== 0
                            ? value.map((data) => {
                              return (
                                <League data={data} {...props} key={data._id} />
                              )
                            })
                            : ''
                        }
                        </Card>
                      </Fragment>
                    )
                  })
                  : (
                    <Fragment>
                      <div className="no-team fixing-width d-flex align-items-center justify-content-center">
                        <div className="">
                          <img src={trophy} />
                          <h6 className="m-3"><FormattedMessage id="Contests_are_not_available_yet" /></h6>
                        </div>
                      </div>
                    </Fragment>
                    )
                : (
                  <Fragment>
                    {
                    listed && listed.length > 0
                      ? (
                        <Card className="leagues-card border-0 bg-transparent">
                          {
                            listed.map(value => {
                              return (
                                <Fragment key={value._id}>
                                  <League {...props} key={value._id} data={value} />
                                </Fragment>
                              )
                            })
                          }
                        </Card>
                        )
                      : (
                        <div className="text-center">
                          <Fragment>
                            <h3 className='mt-5'><FormattedMessage id="No_Contests_are_available" /></h3>
                          </Fragment>
                        </div>
                        )
                  }
                  </Fragment>
                  )
        }
    </div>
  // </PullToRefresh>
  )
}

LeagueContest.propTypes = {
  home: PropTypes.bool,
  list: PropTypes.shape([{
    oLeagueCategory: PropTypes.shape([{
      sTitle: PropTypes.string
    }])
  }]),
  listed: PropTypes.array,
  sortBy: PropTypes.string,
  FilterdBy: PropTypes.string,
  loading: PropTypes.string,
  setFilterData: PropTypes.func,
  Filterd: PropTypes.array,
  FilterdEntry: PropTypes.array,
  FilterdNoOfTeam: PropTypes.array,
  FilterdPrizePool: PropTypes.array,
  FilterdCategory: PropTypes.array,
  handleRefreshFun: PropTypes.func,
  setLoading: PropTypes.func
}

export default LeagueContest
