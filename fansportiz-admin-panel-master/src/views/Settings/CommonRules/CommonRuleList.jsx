import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Col, CustomInput, Modal, ModalBody, Row, UncontrolledAlert } from 'reactstrap'
import {
  ExcelExport,
  ExcelExportColumn
} from '@progress/kendo-react-excel-export'
import viewIcon from '../../../assets/images/view-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import { useQueryState } from 'react-router-use-location-state'
import PropTypes from 'prop-types'
import { updateRule } from '../../../actions/rule'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const CommonRuleList = forwardRef((props, ref) => {
  const { rulesList, getList } = props
  const dispatch = useDispatch()
  const exporter = useRef(null)
  const [list, setList] = useState([])
  const [offset] = useQueryState('pageSize', 10)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [index] = useState(1)
  const [modalMessage, setModalMessage] = useState(false)
  const [type, setType] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const resStatus = useSelector((state) => state.rule.resStatus)
  const resMessage = useSelector((state) => state.rule.resMessage)
  const previousProps = useRef({ rulesList, resStatus, resMessage }).current

  const [close, setClose] = useState(false)

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
    }
    getList()
    setLoading(true)
    props.history.replace()
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.rulesList !== rulesList) {
      if (rulesList) {
        setList(rulesList)
      }
      setLoading(false)
    }
    return () => {
      previousProps.rulesList = rulesList
    }
  }, [rulesList])

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
    const updatedPaymentData = {
      ruleShortName: selectedData.eRule,
      Type: selectedData.eType,
      amount: selectedData.nAmount,
      expiryDays: selectedData.nExpireDays,
      selectRule: selectedData.sRuleName,
      ReferActive: statuss,
      token,
      Id: selectedData._id
    }
    dispatch(updateRule(updatedPaymentData))
    setLoading(true)
    toggleWarning()
  }

  const processExcelExportData = (data) =>
    data.map((commonRuleList) => {
      let eStatus = commonRuleList.eStatus
      let eType = commonRuleList.eType
      eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
      eType = eType === 'B' ? 'Bonus' : eType === 'C' ? 'Cash' : '--'
      return {
        ...commonRuleList,
        eStatus,
        eType
      }
    })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = {
        ...exporter.current.props,
        data: processExcelExportData(list),
        fileName: 'CommonRules.xlsx'
      }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      {modalMessage && message && (
        <UncontrolledAlert
          color='primary'
          className={alertClass(status, close)}
        >
          {message}
        </UncontrolledAlert>
      )}
      <ExcelExport data={list} fileName='Commonrules.xlsx' ref={exporter}>
        <ExcelExportColumn field='sRuleName' title='Rule Name' />
        <ExcelExportColumn field='eRule' title='Rule Shortname' />
        <ExcelExportColumn field='nAmount' title='Amount' />
        <ExcelExportColumn field='eType' title='Type' />
        <ExcelExportColumn field='eStatus' title='Status' />
      </ExcelExport>
      <div className='table-responsive'>
        <table className='common-rule-table'>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Rule</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? (
              <SkeletonTable numberOfColumns={7} />
                )
              : (
              <Fragment>
                {list &&
                  list.length !== 0 &&
                  list.map((data, i) => (
                    <tr key={data._id}>
                      <td>{(index - 1) * offset + (i + 1)}</td>
                      <td>{data.sRuleName ? data.sRuleName : '--'}</td>
                      <td>{data.sDescription || '--'}</td>
                      <td>{data.nAmount}{(data.eRule === 'PLC' || data.eRule === 'LCC' || data.eRule === 'LCG') && ' %'}</td>
                      <td>{data.eRule === 'LCG' ? '--' : data.eType === 'B' ? 'Bonus' : data.eType === 'D' ? 'Deposit' : 'Cash'}</td>
                      <td>
                        <CustomInput
                          type='switch'
                          id={`switch${i + 1}`}
                          name={`switch${i + 1}`}
                          checked={data.eStatus === 'Y'}
                          onClick={() =>
                            warningWithConfirmMessage(
                              data,
                              data.eStatus === 'Y' ? 'Inactivate' : 'activate'
                            )
                          }
                          disabled={adminPermission?.RULE === 'R'}
                        />
                      </td>
                      <td>
                        <ul className='action-list mb-0 d-flex'>
                          <li>
                            <Link
                              color='link'
                              to={`/settings/common-rules-details/${data._id}`}
                            >
                              <img src={viewIcon} alt='View' />
                              View
                            </Link>
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
      {!loading && list.length === 0 && (
        <div className='text-center'>
          <h3>No Common Rules available</h3>
        </div>
      )}

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

CommonRuleList.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  rulesList: PropTypes.arrayOf(PropTypes.object),
  getList: PropTypes.func
}

CommonRuleList.displayName = CommonRuleList

export default connect(null, null, null, { forwardRef: true })(CommonRuleList)
