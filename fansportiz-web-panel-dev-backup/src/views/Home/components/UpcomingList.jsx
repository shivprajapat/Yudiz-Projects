import React, { Fragment } from 'react'
import Match from './Match'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import NoDataFound from '../../../assests/images/ic_no_data_found.svg'
import SkeletonUpcoming from '../../../component/SkeletonUpcoming'
import SportsLeagueList from '../../../HOC/SportsLeagueList/SportsLeagueList'
// import ReactPullToRefresh from 'react-pull-to-refresh'
// import PullToRefresh from 'react-simple-pull-to-refresh'

function UpcomingList (props) {
  // const { FetchMatchList } = props
  const { list, loading, homePage } = props
  // function handleRefresh () {
  //   FetchMatchList()
  // }
  return (
  // <PullToRefresh
  //   onRefresh={handleRefresh}
  //   pullDownThreshold={15}
  //   refreshingContent={true}
  // >
    <div>
      {loading
        ? <SkeletonUpcoming />
        : (
          <Fragment>
            {
                list && list.length !== 0 && list.map((data, i) => {
                  return (
                    <Match {...props} key={i} data={data} homePage={homePage} loading={loading} upcoming />
                  )
                })
              }
            {
                list && list.length === 0 && (
                // <div className="text-center">
                //   <h3 className='mt-5'>
                //     <FormattedMessage id="No_Match_Found" />
                //   </h3>
                // </div>
                <div className="no-team d-flex align-items-center justify-content-center fixing-width2">
                  <div className="">
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
  // </PullToRefresh>
  )
}

UpcomingList.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool,
  mainIndex: PropTypes.number,
  FetchMatchList: PropTypes.func,
  homePage: PropTypes.bool
}

export default SportsLeagueList(UpcomingList, 'cricket', 'Upcoming')
