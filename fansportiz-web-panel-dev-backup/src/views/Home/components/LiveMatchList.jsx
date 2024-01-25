import React from 'react'
import Match from './Match'
import { FormattedMessage } from 'react-intl'
// import ReactPullToRefresh from 'react-pull-to-refresh'
// import PullToRefresh from 'react-simple-pull-to-refresh'
import PropTypes from 'prop-types'
import SkeletonUpcoming from '../../../component/SkeletonUpcoming'
import SportsLeagueList from '../../../HOC/SportsLeagueList/SportsLeagueList'

function LiveMatchList (props) {
  const {
    list, loading
    // FetchingList, mainIndex, subIndex
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
      {loading && <SkeletonUpcoming />}
      {
          list && list.length !== 0 && list.map((data, i) => {
            return (
              <Match {...props} key={i} data={data} live />
            )
          })
        }
      {
          list && !list.length && (
            <div className="text-center">
              <h3 className='mt-5'><FormattedMessage id="Live_matches_are_not_available" /></h3>
            </div>
          )
        }
    </div>
  // </PullToRefresh>
  )
}

LiveMatchList.propTypes = {
  list: PropTypes.array,
  mainIndex: PropTypes.number,
  subIndex: PropTypes.number,
  FetchingList: PropTypes.func,
  loading: PropTypes.bool
}

export default SportsLeagueList(LiveMatchList, 'cricket', 'Upcoming')
