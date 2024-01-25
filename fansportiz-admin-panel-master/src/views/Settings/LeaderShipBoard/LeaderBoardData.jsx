import React, { useEffect, useRef, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addSeason, calculateLeaderBoard, getLeadershipBoard, getSeasonIds } from '../../../actions/leaderboard'
import { Button, CustomInput, Form, FormGroup, UncontrolledAlert } from 'reactstrap'
import Loading from '../../../components/Loading'
import { useQueryState } from 'react-router-use-location-state'
import SkeletonTable from '../../../components/SkeletonTable'
import { getUrl } from '../../../actions/url'
import { Link } from 'react-router-dom'
import refreshIcon from '../../../assets/images/refresh.svg'
import addIcon from '../../../assets/images/add-icon.svg'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
const animatedComponents = makeAnimated()

const LeaderBoardData = () => {
  const dispatch = useDispatch('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useQueryState('leaderboard', 'ALL_TIME')
  const [url, setUrl] = useState('')
  const [allTimeData, setAllTimeData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [seasonData, setSeasonData] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [close, setClose] = useState(false)
  const [seasonList, setSeasonList] = useState([])
  const [season, setSeason] = useState([])
  const [selectedSeasonOption, setSelectedSeasonOption] = useState([])
  const [seasonErr, setSeasonErr] = useState('')

  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.leaderboard.resStatus)
  const resMessage = useSelector(state => state.leaderboard.resMessage)
  const leaderBoardData = useSelector(state => state.leaderboard.leaderBoardData)
  const calculatedLeaderBoardData = useSelector(state => state.leaderboard.calculatedLeaderBoardData)
  const seasonIds = useSelector(state => state.leaderboard.seasonIds)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const previousProps = useRef({ seasonIds, leaderBoardData, calculatedLeaderBoardData, resMessage, resStatus }).current

  useEffect(() => {
    dispatch(getLeadershipBoard(token))
    setLoading(true)
    if (!getUrlLink && !url) {
      dispatch(getUrl('media'))
    }
    dispatch(getSeasonIds(token))
  }, [])

  useEffect(() => {
    !url && setUrl(getUrlLink)
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.leaderBoardData !== leaderBoardData) {
      if (leaderBoardData) {
        leaderBoardData.oAllTimeData && setAllTimeData(leaderBoardData.oAllTimeData)
        leaderBoardData.oMonthData && setMonthlyData(leaderBoardData.oMonthData)
        leaderBoardData.aSeasonData && setSeasonData(leaderBoardData.aSeasonData)
        setLoading(false)
      }
    }
    return () => {
      previousProps.leaderBoardData = leaderBoardData
    }
  }, [leaderBoardData])

  useEffect(() => {
    if (previousProps.calculatedLeaderBoardData !== calculatedLeaderBoardData) {
      if (calculatedLeaderBoardData) {
        calculatedLeaderBoardData.oAllTimeData && setAllTimeData(calculatedLeaderBoardData.oAllTimeData)
        calculatedLeaderBoardData.oMonthData && setMonthlyData(calculatedLeaderBoardData.oMonthData)
        calculatedLeaderBoardData.aSeasonData && setSeasonData(calculatedLeaderBoardData.aSeasonData)
        setLoading(false)
      }
    }
    return () => {
      previousProps.calculatedLeaderBoardData = calculatedLeaderBoardData
    }
  }, [calculatedLeaderBoardData])

  useEffect(() => {
    if (previousProps.seasonIds !== seasonIds) {
      if (seasonIds) {
        !seasonIds && setSeasonErr('')
        const arr = []
        if (seasonIds && seasonIds.length !== 0) {
          seasonIds.map((data) => {
            const obj = {
              value: data._id,
              label: data.sName + '(' + data.eCategory + ')'
            }
            arr.push(obj)
            return arr
          })
          setSeasonList(arr)
        }
      }
    }
    return () => {
      previousProps.seasonIds = seasonIds
    }
  }, [seasonIds])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to add seasons
  function onSeasonSelect (selectedOption) {
    if (selectedOption) {
      setSelectedSeasonOption(selectedOption)
      if (selectedOption.length >= 1) {
        setSeasonErr('')
      } else {
        setSeasonErr('Required field')
      }
      setSeason(selectedOption)
    } else {
      setSeason([])
      setSelectedSeasonOption([])
    }
  }

  // dispatch action to add seasons you want
  function onSubmit (e) {
    e.preventDefault()
    if ((selectedSeasonOption && selectedSeasonOption.length >= 1) && !seasonErr) {
      const selected = []
      selectedSeasonOption.map((data) => {
        const obj = {
          _id: data.value
        }
        selected.push(obj)
        return selected
      })
      dispatch(addSeason(selected, token))
      setSeason([])
      setLoading(true)
    } else if (!selectedSeasonOption.length >= 1) {
      setSeasonErr('Required field')
    }
  }

  // to change leader board data type
  function toggle (event) {
    setIsOpen(event.target.value)
  }

  // dispatch action to calculate/update leader board data
  function calculateLeaderBoardData () {
    dispatch(calculateLeaderBoard(token))
  }

  return (
    <div>
      {loading && <Loading />}
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <div className="d-flex justify-content-between mb-3 fdc-480">
        <div>
          <h2>Leadership Board</h2>
        </div>
        <div className='d-flex inline'>
          <CustomInput
            type="select"
            name="leaderboard"
            id="leaderboard"
            value={isOpen}
            className='mt-2'
            onChange={(event) => toggle(event)}
          >
            <option value="ALL_TIME">All Time</option>
            <option value="MONTH_WISE">Month Wise</option>
            <option value="SEASON_WISE">Season Wise</option>
          </CustomInput>
          <Button color="link" onClick={calculateLeaderBoardData} className='ml-4'>
            <img src={refreshIcon} alt="LeaderBoardData" height="20px" width="20px" />
          </Button>
        </div>
      </div>

      {isOpen === 'ALL_TIME' &&
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Profile Pic</th>
              <th>Name</th>
              <th>Username</th>
              <th>User Type</th>
              <th>User Rank</th>
              <th>Total Join League</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={7} />
              : (
                <Fragment>
                  {
                    allTimeData && allTimeData.length !== 0 && allTimeData.aData && allTimeData.aData.length !== 0 &&
                    allTimeData.aData.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(i + 1)}</td>
                        <td>
                            {data.oUser && data.oUser.sProPic
                              ? <img src={url + data.oUser.sProPic} className="theme-image" alt="No Image" />
                              : ' No Image '
                            }
                        </td>
                        <td>{(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                          ? <Button color="link" className="view" tag={Link} to={`${data.oUser && data.oUser.eType && data.oUser.eType === 'B' ? '/users/system-user/system-user-details' : '/users/user-management/user-details'}/${data.oUser && data.oUser._id}`}>
                          {data?.oUser?.sName || '--'}
                          </Button>
                          : data?.oUser?.sName || '--'}
                        </td>
                        <td>{data?.oUser?.sUsername || '--'}</td>
                        <td>{data.oUser && data.oUser.eType ? (data.oUser.eType === 'B' ? 'Bot' : 'Normal') : '--'}</td>
                        <td>{data?.nUserRank || 0}</td>
                        <td>{data?.nTotalJoinLeague || 0}</td>
                      </tr>
                    ))}
                </Fragment>
                )}
          </tbody>
        </table>
        {
          !loading && allTimeData.length === 0 &&
          (
            <div className="text-center">
              <h3>No Data available</h3>
            </div>
          )
        }
      </div>}

      {isOpen === 'MONTH_WISE' &&
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Profile Pic</th>
              <th>Name</th>
              <th>Username</th>
              <th>User Type</th>
              <th>User Rank</th>
              <th>Total Join League</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={7} />
              : (
                <Fragment>
                  {
                    monthlyData && monthlyData.length !== 0 && monthlyData.aData && monthlyData.aData.length !== 0 &&
                    monthlyData.aData.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(i + 1)}</td>
                        <td>
                            {data.oUser && data.oUser.sProPic
                              ? <img src={url + data.oUser.sProPic} className="theme-image" alt="No Image" />
                              : ' No Image '
                            }
                        </td>
                        <td>{(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N')) ? <Button color="link" className="view" tag={Link} to={`${data.oUser && data.oUser.eType && data.oUser.eType === 'B' ? '/users/system-user/system-user-details' : '/users/user-management/user-details'}/${data.oUser && data.oUser._id}`}>{data?.oUser?.sName || '--'}</Button> : data?.oUser?.sName || '--'}</td>
                        <td>{data?.oUser?.sUsername || '--'}</td>
                        <td>{data.oUser && data.oUser.eType ? (data.oUser.eType === 'B' ? 'Bot' : 'Normal') : '--'}</td>
                        <td>{data.nUserRank || 0}</td>
                        <td>{data.nTotalJoinLeague || 0}</td>
                      </tr>
                    ))}
                </Fragment>
                )}
          </tbody>
        </table>
        {
          !loading && monthlyData.length === 0 &&
          (
            <div className="text-center">
              <h3>No Data available</h3>
            </div>
          )
        }
      </div>}

      {isOpen === 'SEASON_WISE' &&
      <div>
        <Form className="d-flex justify-content-start">
          <FormGroup>
            <Select
              className='custom-react-select'
              menuPlacement="auto"
              menuPosition="fixed"
              captureMenuScroll={true}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti={true}
              options={seasonList}
              id="Season"
              name="Season"
              placeholder="Select Seasons"
              value={season}
              onChange={selectedOption => onSeasonSelect(selectedOption)}
              isDisabled={adminPermission?.LEADERSHIP_BOARD === 'R'}
            />
            <p className="error-text">{seasonErr}</p>
          </FormGroup>
          {((Auth && Auth === 'SUPER') || (adminPermission?.LEADERSHIP_BOARD !== 'R')) &&
          (<FormGroup>
            <img src={addIcon} alt="add" className="header-button ml-2" onClick={onSubmit} title='Add Season' style={{ cursor: 'pointer' }} hidden={season.length === 0}/>
          </FormGroup>)}
          </Form>
            {/* </Row>
          </Col>
          <Col xl={4}></Col>
            </Row> */}
        <div className="table-responsive">
            {loading
              ? <SkeletonTable numberOfColumns={7} />
              : <Fragment>
                  {
                    seasonData && seasonData.length !== 0 &&
                    seasonData.map((data, i) => {
                      return (
                        <Fragment key={i}>
                      <table className="table" key={data._id}>
                        <thead>
                          <tr>
                            <th colSpan='7' className="text-center">{data.sTitle}</th>
                          </tr>
                          <tr>
                            <th>Sr No.</th>
                            <th>Profile Pic</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>User Type</th>
                            <th>User Rank</th>
                            <th>Total Join League</th>
                          </tr>
                        </thead>
                        <tbody>
                        {data && data.aData.map((seriesData, index) =>
                        <tr key={seriesData._id}>
                        <td>{(index + 1)}</td>
                        <td>
                            {seriesData.oUser.sProPic
                              ? <img src={url + seriesData.oUser.sProPic} className="theme-image" alt="No Image" />
                              : ' No Image '
                            }
                        </td>
                        <td>{(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                          ? <Button color="link" className="view" tag={Link} to={`${seriesData.oUser && seriesData.oUser.eType && seriesData.oUser.eType === 'B' ? '/users/system-user/system-user-details' : '/users/user-management/user-details'}/${seriesData.oUser && seriesData.oUser._id}`}>
                          {seriesData?.oUser?.sName || '--'}
                          </Button>
                          : seriesData?.oUser?.sName || '--'}
                        </td>
                        <td>{seriesData?.oUser?.sUsername || '--'}</td>
                        <td>{seriesData.oUser && seriesData.oUser.eType ? (seriesData.oUser.eType === 'B' ? 'Bot' : 'Normal') : '--'}</td>
                        <td>{seriesData.nUserRank || '--'}</td>
                        <td>{seriesData.nTotalJoinLeague || '--'}</td>
                      </tr>)}
                    </tbody>
                  </table>
                  {!loading && data.length === 0 &&
                      <div className="text-center">
                        <h3>No Data available</h3>
                      </div>}
                  </Fragment>)
                    }
                    )
                  }
                </Fragment>}
        </div>
      </div>}
  </div>
  )
}

export default LeaderBoardData
