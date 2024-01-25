import React, { useEffect, useState, useRef } from 'react'
import { Form } from 'react-bootstrap'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import DatePicker from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'
import { ref } from 'yup'

// Components
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'

// Images
import timeslotmorning from '../../../assets/images/timeslotmorning.svg'

// Action Files
import {
  getAllTimeSlotData,
  setAvailability
} from '../../../Actions/Counsellor/counsellor-availability'
// import { getSlotsDataAction } from '../../../Actions/Counsellor/dashboard'

// Validations
const validationSchema = yup.object().shape({
  start_date: yup
    .date()
    .typeError('Start date is required')
    .min(
      moment().format('YYYY-MM-DD'),
      `Min start date is ${moment().format('YYYY-MM-DD')}`
    ),
  // .max(
  //   ref('end_date'),
  //   'Invalid date or Min date must be earlier than the max date'
  // ),
  end_date: yup
    .date()
    .typeError('End date is required')
    .min(
      ref('start_date'),
      'Invalid date or Max date must be later than min date'
    )
  // .max(moment().format('YYYY-MM-DD'), `Max start date is ${moment().format('YYYY-MM-DD')}`)
  // block_date: yup.string().required('Block date is required')
})

function SetAvailability () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()

  // useState
  const [datesArray, setDatesArray] = useState({
    startdate: '',
    enddate: '',
    isMatched: false
  })
  const [selectedSlots, setselectedSlots] = useState([])
  const [timeSlots, settimeSlots] = useState([])
  const format = 'YYYY-MM-DD'
  const [values, setValues] = useState([])
  // useSelector
  const timeSlotsArray = useSelector((state) => state.counsellor.timeSlotData)
  const isAvailabilityFlag = useSelector(
    (state) => state.counsellor.isAvailability
  )
  const allSlotsDataArray = useSelector((state) => state.dashboard.allSlotsData)

  const resMessageFlag = useSelector((state) => state.counsellor.resMessage)

  useEffect(() => {
    if (timeSlotsArray) {
      settimeSlots(timeSlotsArray)
    }
  }, [timeSlotsArray])
  // previousProps
  const previousProps = useRef({
    isAvailabilityFlag,
    resMessageFlag
  }).current

  const {
    register,
    handleSubmit,
    formState: { errors },
    onChange,
    setValue,
    control
  } = useForm({
    resolver: yupResolver(validationSchema)
    // mode: 'onChange'
  })
  const { name } = register('start_date', 'end_date')

  const onSubmit = (data) => {
    if (selectedSlots.length === 0) {
      enqueueSnackbar('Please select atlest one Timeslot', {
        variant: 'error',
        hide: 2000,
        autoHide: true,
        TransitionComponent: 'Fade'
      })
      return null
    } else {
      const startDate = moment(data?.start_date)
      const endDate = moment(data?.end_date)
      const date = []
      const date2 = []

      for (
        let m = moment(startDate);
        m.isSameOrBefore(endDate);
        m.add(1, 'days')
      ) {
        date.push(m.format('YYYY-MM-DD'))
      }

      const v = values.map((date, index) => (
        <li key={index}>{date.format()}</li>
      ))
      v.map((dates, index) => date2.push(dates?.props?.children))
      if (
        selectedSlots === null ||
        selectedSlots === undefined ||
        selectedSlots.length <= 0
      ) {
        enqueueSnackbar('Please select atlest one slot', {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      } else if (data) {
        const dataObject = {
          time_slot_id: selectedSlots,
          date,
          block_date: date2,
          counsellor_status: 'available'
        }
        dispatch(setAvailability(dataObject, token))
      }
    }
  }
  useEffect(() => {
    if (token) {
      dispatch(getAllTimeSlotData(token))
    }
  }, [token])

  const handleSelectedSlots = (id) => {
    let updatedList = [...selectedSlots]

    if (!selectedSlots.includes(id)) {
      updatedList = [...selectedSlots, id]
    } else {
      updatedList.splice(selectedSlots.indexOf(id), 1)
    }
    setselectedSlots(updatedList)
    // setselectedSlots([...selectedSlots, id])
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isAvailabilityFlag !== isAvailabilityFlag) {
      if (isAvailabilityFlag) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/cousellor/availability')
      } else if (isAvailabilityFlag === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isAvailabilityFlag = isAvailabilityFlag
    }
  }, [isAvailabilityFlag])

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.allSlotsDataArray !== allSlotsDataArray) {
      if (allSlotsDataArray) {
        settimeSlots(allSlotsDataArray)
      }
    }
    return () => {
      previousProps.allSlotsDataArray = allSlotsDataArray
    }
  }, [allSlotsDataArray])

  const handleChange = (e, type) => {
    switch (type) {
      case 'startdate':
        setDatesArray({
          ...datesArray,
          startdate: e.target.value
        })
        break
      case 'enddate':
        setDatesArray({
          ...datesArray,
          enddate: e.target.value,
          isMatched: true
        })
        break
      default:
        break
    }
  }

  // useEffect(() => {
  //   const today = new Date()
  //   if (datesArray?.startdate === moment(today).format('YYYY-MM-DD') && datesArray?.enddate === moment(today).format('YYYY-MM-DD') && datesArray?.isMatched === true) {
  // dispatch(getSlotsDataAction(token))
  //   }
  // }, [datesArray?.startdate === datesArray?.enddate && datesArray?.isMatched === true])
  return (
    <>
      <Header />
      <TitleHeader name='Set Availability' title='Availability Management' />
      <div className='main-layout'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='heading-box'>
            <h5>Set Availability</h5>
            <div className='btn-box'>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='theme-btn dark-btn text-none'
              >
                Cancel
              </button>
              <button type='submit' className='theme-btn text-none'>
                Save
              </button>
            </div>
          </div>
          <div className='form-middle-layout'>
            {/* <Form className='light-bg'> */}
              <div className='row'>
                <div className='col-md-6'>
                  <Form.Group
                    className={`form-group ${
                      errors.start_date?.message ? 'error-occured' : ''
                    }`}
                    controlId='formstartdate'
                  >
                    <Form.Label>Start Date</Form.Label>
                    <Controller
                      control={control}
                      name='dob'
                      render={(props) => (
                        <Form.Control
                          type='date'
                          min={moment().format('YYYY-MM-DD')}
                          max='2999-12-31'
                          name={name}
                          onChange={(e) => {
                            onChange(e)
                            setValue('start_date', e.target.value)
                          }}
                          {...register('start_date', { required: true })}
                        />
                      )}
                    />
                    {/* <Form.Control
                                type="date"
                                name={name}
                                min={moment().format('YYYY-MM-DD')}
                                {...register('start_date', { required: true })}
                                onChange={(e) => {
                                  onChange(e)
                                  handleChange(e, 'startdate')
                                }}
                              /> */}
                    {errors.start_date?.message && (
                      <Form.Text className='error-msg'>
                        {errors.start_date?.message}{' '}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className='col-md-6'>
                  <Form.Group
                    className={`form-group ${
                      errors.end_date?.message ? 'error-occured' : ''
                    }`}
                    controlId='formenddate'
                  >
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type='date'
                      placeholder='DD/MM/YYYY'
                      name={name}
                      min={moment().format('YYYY-MM-DD')}
                      max='2999-12-31'
                      {...register('end_date', { required: true })}
                      onChange={(e) => {
                        // onChange(e)
                        handleChange(e, 'enddate')
                      }}
                    />
                    {errors.end_date?.message && (
                      <Form.Text className='error-msg'>
                        {errors.end_date?.message}{' '}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className='col-md-12'>
                  <Form.Group className='form-group'>
                    <Form.Label>Select Slots</Form.Label>
                    <div className=' light-blue-bgbox'>
                      <ul className='slot-availablity four-col'>
                        {timeSlots && timeSlots.length > 0
                          ? timeSlots.map((timeSlot, index) => {
                            return (
                                  <li key={index}>
                                    {' '}
                                    <button
                                      className={`slot-booking whitebtn ${
                                        selectedSlots.includes(timeSlot?.id) &&
                                        'active'
                                      }`}
                                      type='button'
                                      onClick={() =>
                                        handleSelectedSlots(timeSlot?.id)
                                      }
                                    >
                                      {' '}
                                      <img
                                        src={timeslotmorning}
                                        alt='timeslotmorning'
                                      />
                                      {timeSlot?.from_time}
                                    </button>{' '}
                                  </li>
                            )
                          })
                          : 'No Data Found'}
                      </ul>
                    </div>
                  </Form.Group>
                </div>
                <div className='col-md-12'>
                  <div className='form-group'>
                    <h4 className='black-font'>Set Block Date</h4>
                  </div>
                </div>
                <div className='col-md-6'>
                  <Form.Group
                    className={`form-group ${
                      errors.block_date?.message ? 'error-occured' : ''
                    }`}
                    controlId='formenddate'
                  >
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                      inputClass='form-control'
                      placeholder='YYYY/MM/DD'
                      multiple
                      value={values}
                      onChange={setValues}
                      format={format}
                      minDate={moment().toDate()}
                      plugins={[
                        // eslint-disable-next-line react/jsx-key
                        <DatePanel />
                      ]}
                    />
                  </Form.Group>
                </div>
              </div>
            {/* </Form> */}
          </div>
        </Form>
      </div>
    </>
  )
}

export default SetAvailability
