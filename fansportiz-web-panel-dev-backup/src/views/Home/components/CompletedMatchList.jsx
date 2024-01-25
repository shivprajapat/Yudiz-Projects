import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Match from './Match'
// import PullToRefresh from 'react-simple-pull-to-refresh'
import SkeletonUpcoming from '../../../component/SkeletonUpcoming'
import SportsLeagueList from '../../../HOC/SportsLeagueList/SportsLeagueList'

function CompletedMatchList (props) {
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
      {
      loading
        ? <SkeletonUpcoming numberOfColumns={5} />
        : (
          <>
            {
          list && list.length !== 0 && list.map((data) => (
            <Match {...props} key={data._id} completed data={data} />
          ))
      }
            {list && !list.length && (
            <div className="text-center">
              <h3 className="mt-5"><FormattedMessage id="Completed_matches_are_not_available" /></h3>
            </div>
            )}
          </>
          )
      }
    </div>
  // </PullToRefresh>
  )
}

CompletedMatchList.propTypes = {
  mainIndex: PropTypes.number.isRequired,
  list: PropTypes.arrayOf().isRequired,
  loading: PropTypes.bool.isRequired
}
export default SportsLeagueList(CompletedMatchList, 'cricket', 'Upcoming')
