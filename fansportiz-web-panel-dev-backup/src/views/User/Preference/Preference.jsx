import React, { useState, useRef, useEffect } from 'react'
import { Form, Alert, Input } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import Loading from '../../../component/Loading'
import UserProfile from '../../../HOC/User/UserProfile'
function Preference (props) {
  const {
    resMessage,
    loading,
    setLoading,
    modalMessage,
    updatePreferenceDetails,
    preferenceDetails,
    getPreferenceInfo,
    token
  } = props

  const [preferenceInformation, setPreferenceInformation] = useState({
    bEmails: true,
    bPush: true,
    bSms: true,
    bSound: true,
    bVibration: true
  })
  const previousProps = useRef({ preferenceDetails }).current

  useEffect(() => {
    getPreferenceInfo()
  }, [token])

  useEffect(() => {
    if (previousProps.preferenceDetails !== preferenceDetails) {
      if (preferenceDetails) {
        setPreferenceInformation({
          ...preferenceInformation,
          bEmails: preferenceDetails.bEmails,
          bPush: preferenceDetails.bPush,
          bSms: preferenceDetails.bSms,
          bSound: preferenceDetails.bSound,
          bVibration: preferenceDetails.bVibration
        })
        setLoading(false)
      }
    }
    return () => {
      previousProps.preferenceDetails = preferenceDetails
    }
  }, [preferenceDetails])

  function handleChange (event, eType) { // set the value
    switch (eType) {
      case 'PreferenceEmail':
        setPreferenceInformation({ ...preferenceInformation, bEmails: !preferenceInformation.bEmails })
        break
      case 'PreferencePush':
        setPreferenceInformation({ ...preferenceInformation, bPush: event.target.value === 'Y' })
        break
      case 'PreferenceSMS':
        setPreferenceInformation({ ...preferenceInformation, bSms: !preferenceInformation.bSms })
        break
      case 'PreferenceSound':
        setPreferenceInformation({ ...preferenceInformation, bSound: !preferenceInformation.bSound })
        break
      case 'PreferenceVibration':
        setPreferenceInformation({ ...preferenceInformation, bVibration: !preferenceInformation.bVibration })
        break
      default:
        break
    }
  }

  function changePreferenceDetails (e) {
    e.preventDefault()
    if (preferenceInformation) {
      updatePreferenceDetails(preferenceInformation)
      setLoading(true)
    }
  }
  return (
    <>
      {loading && <Loading />}
      {modalMessage ? <Alert color="primary" isOpen={modalMessage}>{resMessage}</Alert> : ''}
      <div className="user-container bg-white">
        <ul className="p-links my-4">
          <li>
            <h1>
              <FormattedMessage id="Email" />
              <i className='hide'>
                <Input
                  checked={preferenceInformation.bEmails}
                  id="Email1"
                  name="Email"
                  onChange={(e) => handleChange(event, 'PreferenceEmail') }
                  type="switch"
                />
              </i>
            </h1>
          </li>
          <li>
            <h1 >
              <FormattedMessage id="SMS" />
              <i className='hide'>
                <Input
                  checked={preferenceInformation.bSms}
                  id="SMS1"
                  name="SMS"
                  onChange={(event) => handleChange(event, 'PreferenceSMS')}
                  type="switch"
                />
              </i>
            </h1>
          </li>
          <li>
            <h1 >
              <FormattedMessage id="Sound" />
              <i className='hide'>
                <Input
                  checked={preferenceInformation.bSound}
                  id="Sound1"
                  name="Sound"
                  onChange={(event) => handleChange(event, 'PreferenceSound')}
                  type="switch"
                />
              </i>
            </h1>
          </li>
          <li>
            <h1 >
              <FormattedMessage id="Vibration" />
              <i className='hide'>
                <Input
                  checked={preferenceInformation.bVibration}
                  id="Vibration1"
                  name="Vibration"
                  onChange={(event) => handleChange(event, 'PreferenceVibration')}
                  type="switch"
                />
              </i>
            </h1>
          </li>
        </ul>
        <Form className="form sign-up pb-0">
          <div className="f-bottom text-center"><button className="btn btn-primary btn-block" onClick={(e) => changePreferenceDetails(e)} type="submit"><FormattedMessage id="Submit" /></button></div>
        </Form>
      </div>
    </>
  )
}
Preference.propTypes = {
  UpdateProfile: PropTypes.func,
  resMessage: PropTypes.string,
  token: PropTypes.string,
  resStatus: PropTypes.bool,
  preferenceDetails: PropTypes.shape({
    bEmails: PropTypes.bool,
    bSound: PropTypes.bool,
    bVibration: PropTypes.bool,
    bSms: PropTypes.bool,
    bPush: PropTypes.bool
  }),
  UpdatePreferenceDetailsFun: PropTypes.func,
  loading: PropTypes.bool,
  modalMessage: PropTypes.bool,
  setLoading: PropTypes.func,
  handleChange: PropTypes.func,
  setPreferenceInformation: PropTypes.func,
  changePreferenceDetails: PropTypes.func,
  updatePreferenceDetails: PropTypes.func,
  getPreferenceInfo: PropTypes.func
}
export default UserProfile(Preference)
