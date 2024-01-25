import React, { Fragment, useEffect, useState, useRef, forwardRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {
  UncontrolledAlert, CustomInput, Modal, ModalBody, Row, Col, Button
} from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import viewIcon from '../../../assets/images/view-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import { getSportsList, updateSport } from '../../../actions/sports'
import PropTypes from 'prop-types'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const Sports = forwardRef((props, ref) => {
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [offset] = useQueryState('pageSize', 10)
  const [index] = useState(1)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const dispatch = useDispatch()
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const sportsList = useSelector(state => state.sports.sportsList)
  const resStatus = useSelector(state => state.sports.resStatus)
  const resMessage = useSelector(state => state.sports.resMessage)
  const previousProps = useRef({ sportsList, resMessage, resStatus }).current

  useEffect(() => {
    if (props?.location?.state?.message) {
      setMessage(props.location.state.message)
      setStatus(true)
      setModalMessage(true)
    }
    setLoading(true)
    dispatch(getSportsList(token))
    props.history.replace()
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.sportsList !== sportsList) {
      if (sportsList) {
        setList(sportsList)
        setLoading(false)
      }
    }
    return () => {
      previousProps.sportsList = sportsList
    }
  }, [sportsList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          dispatch(getSportsList(token))
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onCancel () {
    toggleWarning()
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updateSportsData = {
      sportName: selectedData.sName,
      key: selectedData.sKey,
      position: selectedData.nPosition,
      totalPlayers: selectedData?.oRule?.nTotalPlayers,
      maxPlayerOneTeam: selectedData?.oRule?.nMaxPlayerOneTeam,
      scoreInfoLink: selectedData.sScoreInfoLink,
      scoreInfoTabName: selectedData.sScoreInfoTabName,
      Active: statuss,
      token,
      id: selectedData._id
    }
    dispatch(updateSport(updateSportsData))
    setLoading(true)
    toggleWarning()
  }

  return (
    <Fragment>
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Sport</th>
              <th>Key</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={6} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 &&
                    list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.sName ? data.sName : '--'}</td>
                        <td>{data.sKey ? data.sKey : '--'}</td>
                        <td>{data.nPosition ? data.nPosition : '--'}</td>
                        <td>
                          <CustomInput
                            type='switch'
                            id={`${data._id}`}
                            name={`${data._id}`}
                            onClick={() =>
                              warningWithConfirmMessage(
                                data,
                                data.eStatus === 'Y' ? 'Inactivate' : 'activate'
                              )
                            }
                            checked={data.eStatus === 'Y'}
                            disabled={adminPermission?.SPORT === 'R'
                            }
                          />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink color="link" to={`/settings/sport-details/${data._id}`} className="view">
                                <img src={viewIcon} alt="View" />
                                View
                              </NavLink>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Sports available</h3>
          </div>
        )
      }

      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className='text-center'>
          <img className='info-icon' src={warningIcon} alt='check' />
          <h2>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button
                type='submit'
                className='theme-btn outline-btn full-btn'
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type='submit'
                className='theme-btn danger-btn full-btn'
                onClick={onStatusUpdate}
              >
                {`Yes, ${type} it`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

Sports.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

Sports.displayName = Sports

export default connect(null, null, null, { forwardRef: true })(Sports)
