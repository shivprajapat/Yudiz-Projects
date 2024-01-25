import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SkeletonTable from '../../../../components/SkeletonTable'
import moment from 'moment'
import { alertClass, modalMessageFunc } from '../../../../helpers/helper'
import { Button, Col, Modal, ModalBody, ModalHeader, Row, UncontrolledAlert } from 'reactstrap'
import { useSelector } from 'react-redux'
import PaginationComponent from '../../../../components/PaginationComponent'
import viewIcon from '../../../../assets/images/view-icon.svg'
import { useQueryState } from 'react-router-use-location-state'

const SystemBotLogs = forwardRef((props, ref) => {
  const { systemBotDetails, loading, setLoading, getBotLogs } = props
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 entries')
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [errorList, setErrorList] = useState({})
  const resStatus = useSelector(state => state.matchleague.resStatus)
  const resMessage = useSelector(state => state.matchleague.resMessage)
  const previousProps = useRef({ systemBotDetails, resStatus, resMessage }).current
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (previousProps.systemBotDetails !== systemBotDetails) {
      if (systemBotDetails) {
        if (systemBotDetails.aData) {
          const userArrLength = systemBotDetails.aData.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setIndex(activePageNo)
        setList(systemBotDetails.aData || [])
        setTotal(systemBotDetails.nTotal || 0)
        setLoading(false)
      }
    }
    return () => {
      previousProps.systemBotDetails = systemBotDetails
    }
  }, [systemBotDetails])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
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

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getBotLogs(start, offset)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onRefresh () {
    const startFrom = 0
    getBotLogs(startFrom, offset)
    setPageNo(1)
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  function onCancel () {
    toggleErrorModal()
  }

  function openErrorModal (errorList) {
    const eList = {}
    const errNoRes = 'No response'

    errorList?.forEach(element => {
      if (typeof element === 'string') {
        if (element.charAt(0) === '<') {
          const div = document.createElement('div')
          div.innerHTML = element
          const innerTextOfDiv = div.children ? div.children[0].innerText : div.innerText
          eList[innerTextOfDiv] = (eList[innerTextOfDiv] || 0) + 1
        } else {
          eList[element] = (eList[element] || 0) + 1
        }
      } else if (typeof element === 'object') {
        if (element.message) {
          eList[element.message] = (eList[element.message] || 0) + 1
        }
        if (element.name) {
          eList[element.name] = (eList[element.name] || 0) + 1
        }
        if (Object.keys(element).length === 0) {
          eList[errNoRes] = (eList[errNoRes] || 0) + 1
        }
      }
    })

    setErrorModal(true)
    setErrorList(eList)
  }

  function toggleErrorModal () {
    setErrorModal(!errorModal)
  }

  return (
    <Fragment>
      <div className="table-responsive">
      {
        modalMessage && message && (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Add By</th>
              <th>Added Teams</th>
              <th>Bot Type</th>
              <th>Success</th>
              <th>Errors</th>
              <th>Instant Added?</th>
              <th>Added Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={9} />
              : <Fragment>
                {list && list.length !== 0 && list.map((data, i) => {
                  return (
                    <tr key={data._id}>
                      <td>{(((index - 1) * offset) + (i + 1))}</td>
                      <td>{data?.oAdmin?.sUsername || '--'}</td>
                      <td>{data.nTeams || 0}</td>
                      <td>{data.eType ? (data.eType === 'B' ? 'Bot' : data.eType === 'CB' ? 'Copy Bot' : data.eType === 'CMB' ? 'Combination Bot' : '--') : '--'}</td>
                      <td>{data.nSuccess || 0}</td>
                      <td>{data.nErrors || 0}</td>
                      <td>{data.bInstantAdd ? 'Yes' : 'No'}</td>
                      <td>{moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
                      <td>
                            <ul className='action-list mb-0 d-flex'>
                              <li>
                                  <Button
                                    color="link"
                                    onClick={() => openErrorModal(data.aError)}
                                    disabled={data.aError.length === 0}
                                  >
                                    <img src={viewIcon} alt='View' className={data.aError.length === 0 ? 'disabled-view-btn-img' : ''} />
                                    View
                                  </Button>
                              </li>
                            </ul>
                          </td>
                    </tr>
                  )
                })
              }
                </Fragment>
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 && (
          <div className="text-center">
            <h3>No Logs available</h3>
          </div>
        )
      }

      <PaginationComponent
        activePageNo={activePageNo}
        startingNo={startingNo}
        endingNo={endingNo}
        total={total}
        listLength={listLength}
        setOffset={setOffset}
        setStart={setStart}
        setLoading={setLoading}
        setListLength={setListLength}
        setPageNo={setPageNo}
        offset={offset}
        paginationFlag={paginationFlag}
      />

      <Modal isOpen={errorModal} toggle={toggleErrorModal} className='modal-confirm'>
        <ModalHeader toggle={toggleErrorModal}>
          System Bot Log Errors
          <Button className='close' onClick={onCancel}></Button>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Error</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                {
                  Object.keys(errorList).map(function (key) {
                    return <tr key={key}>
                      <td>{key}</td>
                      <td>{errorList[key]}</td>
                    </tr>
                  })
                }
                </tbody>
              </table>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

SystemBotLogs.propTypes = {
  systemBotDetails: PropTypes.object,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  getBotLogs: PropTypes.func
}

SystemBotLogs.displayName = SystemBotLogs

export default SystemBotLogs
