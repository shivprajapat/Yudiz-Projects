import React, { Fragment, useEffect, lazy, Suspense } from 'react'
// import MyTeam from './MyTeam'
import PropTypes from 'prop-types'
// import ReactPullToRefresh from 'react-pull-to-refresh'
// import PullToRefresh from 'react-simple-pull-to-refresh'
import { FormattedMessage } from 'react-intl'
import SkeletonTeam from '../../../component/SkeletonTeam'
import trophy from '../../../assests/images/noDataTrophy.svg'
import Loading from '../../../component/Loading'
import { Alert, Button } from 'reactstrap'
import TeamList from '../../../HOC/SportsLeagueList/TeamList'
import qs from 'query-string'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
const MyTeam = lazy(() => import('./MyTeam'))

function MyAllTeams (props) {
  const {
    teamList, teamPlayerList,
    // noRefresh,
    setUserTeamId, UpdatedTeamList, userTeamId,
    // myTeamList,
    loading, loadingList, setLoading, UserTeamChoice,
    teamResMessage, modalOpen, setModalOpen, message, setMessage
  } = props

  const { sMatchId, sportsType } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (userTeamId) {
      setUserTeamId('')
    }
  }, [])
  useEffect(() => {
    if (UpdatedTeamList) {
      setLoading(false)
    }
  }, [UpdatedTeamList])

  const createTeamFunc = (length) => {
    if (length > 0) {
      navigate(location.pathname.includes('tournament') ? `/tournament/create-team/${(sportsType).toLowerCase()}/${sMatchId}` : `/create-team/${(sportsType).toLowerCase()}/${sMatchId}`,
        {
          search: `?${qs.stringify({
            homePage: homePage ? 'yes' : undefined
          })}`,
          state: { tournament: true, referUrl: `/upcoming-match/leagues/${sportsType}/${sMatchId}` }
        })
    } else {
      setMessage(teamResMessage)
      setModalOpen(true)
    }
  }

  // function handleRefresh () {
  //   myTeamList()
  // }
  return (
    <>
      {/* <PullToRefresh
        onRefresh={!noRefresh && handleRefresh}
        pullDownThreshold={15}
        refreshingContent={true}
      > */}
      {modalOpen
        ? (
          <Fragment>
            <Alert color="primary" isOpen={modalOpen}>{message}</Alert>
          </Fragment>
          )
        : ''}
      <Fragment>
        {
            (loading || loadingList)
              ? <SkeletonTeam length={3} />
              : teamList && teamList.length
                ? (
                  <Fragment>
                    {
                      UserTeamChoice
                        ? (
                          <Fragment>
                            {(
                            teamList && teamList.length !== 0 && teamList.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data, index) => {
                              return (
                                <Suspense key={data._id} fallback={<Loading />}>
                                  <MyTeam {...props}
                                    key={data._id}
                                    UserTeamChoice
                                    allTeams={teamList}
                                    index={index}
                                    params={sMatchId}
                                    setUserTeamId={setUserTeamId}
                                    teamDetails={data}
                                    upcoming
                                    userTeamId={userTeamId}
                                  />
                                </Suspense>
                              )
                            })
                          )
                          }
                          </Fragment>
                          )
                        : (
                          <Fragment>
                            {(
                            teamList && teamList.length !== 0 && teamList.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data, index) => {
                              return (
                                <Suspense key={data._id} fallback={<Loading />}>
                                  <MyTeam {...props} key={data._id} allTeams={teamList} index={index} params={sMatchId} teamDetails={data} upcoming />
                                </Suspense>
                              )
                            })
                          )
                          }
                          </Fragment>
                          )
                    }
                  </Fragment>
                  )
                : (
                  <Fragment>
                    <div className="no-team fixing-width3 d-flex align-items-center justify-content-center">
                      {/* <i className="icon-trophy"></i> */}
                      <div>
                        <img alt={<FormattedMessage id='Trophy' />} src={trophy} />
                        <h6 className="m-3"><FormattedMessage id="No_team_created_yet" /></h6>
                        <Button className="btn btn-primary w-100" onClick={() => createTeamFunc(teamPlayerList?.length)}><FormattedMessage id="Create_Team" /></Button>
                      </div>
                    </div>
                  </Fragment>
                  )
          }
      </Fragment>
      {/* </PullToRefresh> */}
    </>
  )
}

MyAllTeams.propTypes = {
  teamList: PropTypes.array,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      sportsType: PropTypes.string
    })
  }),
  setUserTeamId: PropTypes.func,
  userTeamId: PropTypes.string,
  myTeamList: PropTypes.func,
  loading: PropTypes.bool,
  noRefresh: PropTypes.bool,
  loadingList: PropTypes.bool,
  setLoading: PropTypes.func,
  UpdatedTeamList: PropTypes.array,
  UserTeamChoice: PropTypes.bool,
  history: PropTypes.object,
  teamResMessage: PropTypes.string,
  modalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func,
  message: PropTypes.string,
  setMessage: PropTypes.func,
  teamPlayerList: PropTypes.object,
  location: PropTypes.object
}

export default TeamList(MyAllTeams)
