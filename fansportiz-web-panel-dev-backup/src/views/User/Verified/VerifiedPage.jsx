import React, { useEffect, useState, Fragment } from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
// import PropTypes from 'prop-types'
import Loading from '../../../component/Loading'
// import Verification from '../../../HOC/User/Verification'
import { useLocation, useNavigate } from 'react-router-dom'
import useGetUserProfile from '../../../api/user/queries/useGetUserProfile'

function VerifiedPage () {
  const [userData, setUserData] = useState({ sEmail: '', sMobNum: '', otp: '' })
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { data: userInfo, isLoading } = useGetUserProfile()

  useEffect(() => {
    if (userInfo) {
      setUserData({ ...userData, sEmail: userInfo.sEmail, sMobNum: userInfo.sMobNum })
    }
  }, [userInfo])

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/verify', { state: { userName: pathname === '/verify/email' ? userData.sEmail : userData.sMobNum, profile: true } })
  }

  return (
    <>
      {isLoading && <Loading />}
      {/* {modalMessage ? <Alert isOpen={modalMessage} color="primary">{resMessage}</Alert> : ''} */}
      <div className="user-container bg-white">
        <Form className="form sign-up pb-0">
          {pathname === '/verify/email'
            ? (
              <Fragment>
                <p className="m-msg text-start"><FormattedMessage id='Will_received_OTP_on_email' /></p>
                <FormGroup className="c-input">
                  <Input autoComplete='off' className={`bg-white ${userData.sEmail ? 'hash-contain' : ' '}`} defaultValue={userData.sEmail} disabled id="Email" name="sEmail" type="email" />
                  <Label className="no-change label m-0" for="Email"><FormattedMessage id="Email" /></Label>
                </FormGroup>
              </Fragment>
              )
            : (
              <Fragment>
                <FormGroup className="c-input">
                  <Input autoComplete='off' className={`bg-white hidden-border ${userData.sMobNum ? 'hash-contain' : ' '}`} defaultValue={userData.sMobNum} disabled id="MobileNumber" name="sMobNum" type="text" />
                  <Label className="no-change label m-0" for="MobileNumber"><FormattedMessage id="Mobile_Number" /></Label>
                </FormGroup>
              </Fragment>
              )
        }
          <div className="text-center">
            <Button block color="primary" onClick={handleSubmit} type="submit"><FormattedMessage id="Submit" /></Button>
          </div>
        </Form>
      </div>
    </>
  )
}

VerifiedPage.propTypes = {
}

export default VerifiedPage
