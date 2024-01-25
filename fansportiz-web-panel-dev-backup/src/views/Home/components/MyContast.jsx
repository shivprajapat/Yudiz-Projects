import React, { Fragment } from 'react'
import { Card } from 'reactstrap'
import { Link, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import League from './League'
// import PullToRefresh from 'react-simple-pull-to-refresh'
// import ReactPullToRefresh from 'react-pull-to-refresh'
import SkeletonLeague from '../../../component/SkeletonLeague'
import trophy from '../../../assests/images/noDataTrophy.svg'

function MyContast (props) {
  const {
    contestList, setTab,
    // myContestList,
    loading
  } = props

  const { sMatchId, sportsType } = useParams()

  // function handleRefresh () {
  //   myContestList()
  // }
  return (
  // <PullToRefresh
  //   onRefresh={handleRefresh}
  //   pullDownThreshold={15}
  //   refreshingContent={true}
  // >
    <Fragment>
      {
          loading
            ? <SkeletonLeague length={1} />
            : (
              <Fragment>
                {
                contestList && contestList.length > 0
                  ? (
                    <Fragment>
                      <Card className="leagues-card border-0 bg-transparent">
                        {
                        contestList && contestList.length !== 0 && contestList.map((data) => {
                          return (
                            <League data={data} {...props} key={data && data._id} />
                          )
                        })
                      }
                      </Card>
                    </Fragment>
                    )
                  : (
                    <Fragment>
                      <div className="no-team fixing-width3 d-flex align-items-center justify-content-center">
                        <div className="">
                          {/* <i className="icon-trophy"></i> */}
                          <img src={trophy} />
                          <h6 className="m-3"><FormattedMessage id="No_contests_joined_yet" /></h6>
                          <Link className="btn btn-primary w-100" onClick={setTab} to={`/upcoming-match/leagues/${sportsType}/${sMatchId}`}>
                            <FormattedMessage id="Join_Contest" />
                            {' '}
                          </Link>
                        </div>
                      </div>
                    </Fragment>
                    )
              }
              </Fragment>
              )
        }
    </Fragment>
  // </PullToRefresh>
  )
}

MyContast.propTypes = {
  contestList: PropTypes.object,
  setTab: PropTypes.func,
  loading: PropTypes.bool,
  myContestList: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      sportsType: PropTypes.string
    })
  })
}

export default MyContast
