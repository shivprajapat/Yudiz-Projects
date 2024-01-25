import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'
import defaultImage from '../../assets/default_profile copy.jpg'

// /* Components */

/* images */
// import rating from '../../assets/images/rating.png'
// import background from '../../assets/images/brooklyn-simmons.png'
import calendericon from '.././../assets/images/calendaricon.svg'
import clockicon from '.././../assets/images/timeicon.svg'

// Action Files
import { sessionCancel, getSessionDetails } from '../../Actions/counsellor'

const validationSchema = yup.object().shape({
  reason: yup.string().required('Reason is required')
})

const CancelSession = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useSelector
  const counsellorDetails = useSelector(
    (state) => state.counsellor.sessionDetails
  )
  const isCancelSessionFlag = useSelector((state) => state.counsellor.isCancel)
  const ressMessage = useSelector((state) => state.counsellor.resMessage)

  // previousProps
  const previousProps = useRef({
    isCancelSessionFlag,
    ressMessage
  }).current

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    if (token) {
      const data = {
        id: location?.state?.id?.id
      }
      dispatch(getSessionDetails(data, token))
    }
  }, [token])

  const onSubmit = (data) => {
    const dataObject = {
      sessionId: counsellorDetails?.id,
      reason: data?.reason
    }
    dispatch(sessionCancel(dataObject, token))
  }

  // Notification for status
  useEffect(() => {
    if (previousProps?.isCancelSessionFlag !== isCancelSessionFlag) {
      if (isCancelSessionFlag) {
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/counselling/session-history/:type')
      } else if (isCancelSessionFlag === false) {
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCancelSessionFlag = isCancelSessionFlag
    }
  }, [isCancelSessionFlag])

  return (
    <>
          <Form onSubmit={handleSubmit(onSubmit)} >
            <div className='main-layout whitebox-layout no-padding reschedule-page'>
              <div className='heading-box counselling-page'>
                <h5 className='mr-1'>Cancel Session</h5>
                <div className='btn-box'>
                  <button className='theme-btn red-btn text-none' type='submit'>
                    Cancel Session
                  </button>
                </div>
              </div>
              <div className='counsellor-box'>
              <div className='row'>
                <div className='col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-7'>
                  <div className='counsellor-item'>
                    <div
                      className='counsellor-img'
                      style={{
                        backgroundImage: (counsellorDetails?.counsellors_profile ===
                          null || counsellorDetails?.counsellors_profile ===
                          'undefined')
                          ? `url('${defaultImage}')`
                          : `url('${process.env.REACT_APP_AXIOS_BASE_URL}${counsellorDetails?.counsellors_profile
                          }')`
                      }}
                    ></div>
                    <div className='counsellor-info'>
                      <h6 className='counsellor-name'>
                          {counsellorDetails?.counsellors_first_name} {counsellorDetails?.counsellors_last_name}
                          </h6>
                      {/* <div className='rating'>
                        <img src={rating} alt='rating' />
                        <p>3.5/5</p>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className='col-xxl-9 col-xl-8 '>
                  <div className='date-time-box light-blue-bgbox'>
                    <h4 className='box-title'>Date & Time</h4>
                    <div className='time-date'>
                      <div className='itemee'>
                        <div className='img-box'>
                          <img src={calendericon} alt='calendericon' />
                        </div>
                        <h4>{counsellorDetails?.date}</h4>
                      </div>
                      <div className='itemee'>
                        <div className='img-box'>
                          <img src={clockicon} alt='clockicon' />
                        </div>
                        <h4>{counsellorDetails?.from_time}</h4>
                      </div>
                    </div>
                  </div>
                    <Form.Group
                      className='form-group border-line-dark mb-0 '
                      controlId='cancelreason'
                    >
                      <Form.Control
                        as='textarea'
                        className='big-textarea cancelbox'
                        placeholder='Enter Reason for Cancellation....'
                        name={name}
                        {...register('reason', { required: true })}
                      />
                      {errors.reason?.message && (
                        <Form.Text className='error-msg'>
                          {errors.reason?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                </div>
              </div>
            </div>
          </div>
          </Form>
    </>
  )
}

export default CancelSession
