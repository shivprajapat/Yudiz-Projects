import React, {
  useState, Fragment, useEffect, useRef
} from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button, UncontrolledAlert
} from 'reactstrap'
import SkeletonTable from '../../../components/SkeletonTable'
import viewIcon from '../../../assets/images/view-icon.svg'
import PropTypes from 'prop-types'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

function PlayerRole (props) {
  const {
    sportsType, getList, EditPlayerRoleLink
  } = props
  const [loading, setLoading] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)

  const playerRoleList = useSelector(state => state.playerRole.playerRoleList)
  const resStatus = useSelector(state => state.playerRole.resStatus)
  const resMessage = useSelector(state => state.playerRole.resMessage)
  const previousProps = useRef({ playerRoleList, resStatus, resMessage }).current

  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    getList()
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          getList()
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
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
    if (previousProps.playerRoleList !== playerRoleList) {
      if (playerRoleList) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.playerRoleList = playerRoleList
    }
  }, [playerRoleList])

  return (
    <Fragment>
      <div className="table-responsive">
        {
          modalMessage && message &&
          (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Role</th>
              <th>Short Name</th>
              <th>Min player</th>
              <th>Max Player</th>
              {/* <th>Position</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={6} />
              : (
                <Fragment>
                  {
                    playerRoleList && playerRoleList.length !== 0 && playerRoleList.map((data, i) => (
                      <tr key={data._id}>
                        <td>{i + 1}</td>
                        <td>{data.sFullName}</td>
                        <td>{data.sName}</td>
                        <td>{data.nMin}</td>
                        <td>{data.nMax}</td>
                        {/* <td>{data.nPosition || '--'}</td> */}
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button color="link" className="view" tag={Link} to={`${EditPlayerRoleLink}/${data._id}`}>
                                <img src={viewIcon} alt="View" />
                                View
                              </Button>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      {
        !loading && playerRoleList && playerRoleList.length === 0 &&
        (
          <div className="text-center">
            <h3>No PlayerRoleList available</h3>
          </div>
        )
      }
    </Fragment>
  )
}

PlayerRole.propTypes = {
  sportsType: PropTypes.string,
  EditPlayerRoleLink: PropTypes.string,
  getList: PropTypes.func
}

export default PlayerRole
