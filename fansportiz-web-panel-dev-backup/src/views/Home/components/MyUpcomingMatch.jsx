import React, { Fragment } from 'react'
import Match from './Match'
import { FormattedMessage } from 'react-intl'
// import ReactPullToRefresh from 'react-pull-to-refresh'
// import PullToRefresh from 'react-simple-pull-to-refresh'
import SkeletonUpcoming from '../../../component/SkeletonUpcoming'
import PropTypes from 'prop-types'
import NoDataFound from '../../../assests/images/ic_no_data_found.svg'
import SportsLeagueList from '../../../HOC/SportsLeagueList/SportsLeagueList'

function MyUpcomingMatch (props) {
  const {
    list, loading,
    // FetchingList, mainIndex,
    subIndex
  } = props
  // function handleRefresh () {
  //   FetchingList(mainIndex, subIndex)
  // }
  return (
  // <PullToRefresh
  //   onRefresh={handleRefresh}
  //   pullDownThreshold={15}
  //   refreshingContent={true}
  // >
    <div>
      {
          loading
            ? <SkeletonUpcoming numberOfColumns={5} />
            : (
              <Fragment>
                {list && list.length !== 0 && list.sort(function (a, b) {
                  return new Date(b.dStartDate) - new Date(a.dStartDate)
                }).map((data, i) => {
                  return (
                    <Match {...props} key={i} completed={subIndex === 3} data={data} live={subIndex === 2}/>
                  )
                })}
                {
                  list && !list.length && (
                  // <div className="text-center">
                  //   <h3 className='mt-5'>
                  //     <FormattedMessage id="No_Match_Found" />
                  //   </h3>
                  // </div>
                  <div className="no-team d-flex align-items-center justify-content-center fixing-width">
                    <div className="">
                      {/* <i className="icon-trophy"></i> */}
                      <img src={NoDataFound} />
                      <h6>
                        <FormattedMessage id="No_data_found_Please_check_back_after_while" />
                      </h6>
                    </div>
                  </div>
                  )
                }
              </Fragment>
              )
        }
    </div>
  //  </PullToRefresh>
  )
}

MyUpcomingMatch.propTypes = {
  list: PropTypes.array,
  points: PropTypes.string,
  teamDetails: PropTypes.object,
  mainIndex: PropTypes.number,
  subIndex: PropTypes.number,
  loading: PropTypes.bool,
  FetchingList: PropTypes.func
}

export default SportsLeagueList(MyUpcomingMatch, 'cricket', 'Upcoming')
