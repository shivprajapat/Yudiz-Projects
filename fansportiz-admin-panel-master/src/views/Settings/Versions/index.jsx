import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalBody, Row } from 'reactstrap'
import { getMaintenanceMode, getVersionList, updateMaintenanceMode } from '../../../actions/version'
import Loading from '../../../components/Loading'
import Navbar from '../../../components/Navbar'
import Heading from '../component/Heading'
import Version from './Version'

function Versions (props) {
  const token = useSelector((state) => state.auth.token)
  const versionList = useSelector((state) => state.version.versionList)
  const maintenanceMode = useSelector(state => state.version.maintenanceMode)
  const mResMessage = useSelector(state => state.version.mResMessage)
  const mResStatus = useSelector(state => state.version.mResStatus)
  const dispatch = useDispatch()
  const content = useRef()
  const [value, setValue] = useState('N')
  const [maintenanceMsg, setMaintenanceMsg] = useState('')
  const [msgErr, setMsgErr] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [loader, setLoader] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const toggleMessage = () => setModalOpen(!modalOpen)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ mResMessage, mResStatus }).current

  useEffect(() => {
    if (maintenanceMode) {
      setValue(maintenanceMode?.bIsMaintenanceMode ? 'Y' : 'N')
      setMaintenanceMsg(maintenanceMode?.sMessage)
      getList(0, 10)
      setModalOpen(true)
    }
  }, [maintenanceMode])

  useEffect(() => {
    if (previousProps.mResMessage !== mResMessage) {
      setLoader(false)
      setMessage(mResMessage)
      setModalMessage(true)
      setStatus(mResStatus)
      getList(0, 10)
    }
    return () => {
      previousProps.mResMessage = mResMessage
      previousProps.mResStatus = mResStatus
    }
  }, [mResMessage, mResStatus])

  function onExport () {
    content.current.onExport()
  }

  function getList (start, limit) {
    dispatch(getVersionList(start, limit, token))
  }

  function getMaintenanceModeFunc () {
    dispatch(getMaintenanceMode(token))
  }

  function updateMaintenanceModeFunc (e) {
    e.preventDefault()
    if (!maintenanceMsg) {
      setMsgErr('Required field')
    } else {
      dispatch(updateMaintenanceMode(value === 'Y', maintenanceMsg, token))
      setModalOpen(false)
      setLoader(true)
    }
  }

  function handleOnChange (e, type) {
    switch (type) {
      case 'value':
        setValue(e.target.value)
        break
      case 'maintenanceMsg':
        setMaintenanceMsg(e.target.value)
        break
      default:
        break
    }
  }

  return (
    <Fragment>
      {loader && <Loading />}
      <Navbar {...props} />
      <main className='main-content'>
        <section className='management-section common-box'>
          <Heading
            info
            heading='Versions'
            permission={
              (Auth && Auth === 'SUPER') ||
              (adminPermission?.VERSION !== 'R')
            }
            buttonText='Add Version'
            setUrl='/settings/add-version'
            onExport={onExport}
            list={versionList}
            getMaintenanceModeFunc={getMaintenanceModeFunc}
            maintenancePermission={(Auth && Auth === 'SUPER') || (adminPermission?.MAINTENANCE !== 'N')}
          ></Heading>
          <Version
            {...props}
            ref={content}
            token={token}
            getList={getList}
            versionList={versionList}
            editVersionLink={'/settings/version-details'}
            modalMessage={modalMessage}
            setModalMessage={setModalMessage}
            message={message}
            setMessage={setMessage}
            status={status}
            setStatus={setStatus}
          ></Version>
        </section>
      </main>

      <Modal isOpen={modalOpen} toggle={toggleMessage} className="modal-confirm-bot">
        <ModalBody className="text-center">
          <Form>
            <FormGroup>
              <Row>
                <Col md='12'>
                  <Label for="maintenanceMode">Maintenance Mode</Label>
                  <div className='d-flex inline-input mt-2'>
                  <CustomInput
                    disabled={adminPermission?.MAINTENANCE === 'R'}
                    type='radio'
                    id='value1'
                    name='value1'
                    label='On'
                    onClick={(event) => handleOnChange(event, 'value')}
                    checked={value === 'Y'}
                    value='Y'
                  />
                  <CustomInput
                    disabled={adminPermission?.MAINTENANCE === 'R'}
                    type='radio'
                    id='value2'
                    name='value2'
                    label='Off'
                    onClick={(event) => handleOnChange(event, 'value')}
                    checked={value !== 'Y'}
                    value='N'
                  />
                </div>
                </Col>
                <Col md='12' className='mt-4'>
                  <Label for="maintenanceMsg">Message</Label>
                  <Input type='textarea' value={maintenanceMsg} disabled={adminPermission?.MAINTENANCE === 'R'} onChange={event => handleOnChange(event, 'maintenanceMsg')}></Input>
                  <p className='error-text'>{msgErr}</p>
                </Col>
              </Row>
            </FormGroup>
            {((Auth && Auth === 'SUPER') || (adminPermission?.MAINTENANCE === 'W')) &&
            <Row className='buttons'>
              <Col md='12'>
                <Button type="submit" className="theme-btn success-btn full-btn" onClick={updateMaintenanceModeFunc} disabled={!maintenanceMsg}>Save Changes</Button>
              </Col>
            </Row>}
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default Versions
