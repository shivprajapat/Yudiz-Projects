import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

// Components
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useSnackbar } from 'react-notistack'

// Images
import timeslotmorning from '../../../assets/images/timeslotmorning.svg'

// Action Files
import { getAllTimeSlotData, viewAvailability, editAvailability } from '../../../Actions/Counsellor/counsellor-availability'

function SetAvailability () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()

  const token = localStorage.getItem('token')

  //   useState
  const [selectedSlots, setselectedSlots] = useState([])

  // useSelector
  const timeSlotsArray = useSelector((state) => state.counsellor.timeSlotData)
  const availableDataArray = useSelector((state) => state.counsellor?.availableData?.data)
  const isAvailableEditedFlag = useSelector((state) => state.counsellor.isAvailableEdited)
  const isAvailableEditedMessage = useSelector((state) => state.counsellor.resMessage)

  // previousProps
  const previousProps = useRef({ availableDataArray, isAvailableEditedFlag, isAvailableEditedMessage }).current

  const { handleSubmit } = useForm()

  useEffect(() => {
    if (previousProps?.availableDataArray !== availableDataArray) {
      const array = []
      if (availableDataArray) {
        availableDataArray[0]?.availableTimes.map((data) => {
          return array.push({ id: data?.id, time_slot_id: data?.time_slot_id, from_time: data?.from_time, to_time: data?.to_time })
        })
        setselectedSlots(array)
      }
    }
    return () => {
      previousProps.availableDataArray = availableDataArray
    }
  }, [availableDataArray])

  useEffect(() => {
    if (token) {
      dispatch(getAllTimeSlotData(token))
    }
  }, [token])

  useEffect(() => {
    if (location?.state?.id?.date) {
      const dataObject = {
        date: location?.state?.id?.date
      }
      dispatch(viewAvailability(dataObject, token, 'counsellor'))
    }
  }, [location?.state?.id?.date])

  const handleSelectedSlots = (id) => {
    let updatedList = [...selectedSlots]
    if (selectedSlots.some(e => e.time_slot_id === id?.id)) {
      updatedList = selectedSlots.filter(function (obj) {
        return obj.time_slot_id !== id?.id
      })
    } else {
      updatedList = [...selectedSlots, { time_slot_id: id?.id, from_time: id?.from_time, to_time: id?.to_time }]
    }
    setselectedSlots(updatedList)
    // setselectedSlots([...selectedSlots, id])
  }

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
      const dataObject = {
        date: location?.state?.id?.date,
        time_slot: selectedSlots,
        // counsellor_id: ,
        counsellor_status: 'available'
      }
      dispatch(editAvailability(dataObject, token))
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isAvailableEditedFlag !== isAvailableEditedFlag) {
      if (isAvailableEditedFlag) {
        enqueueSnackbar(`${isAvailableEditedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/cousellor/availability')
      } else if (isAvailableEditedFlag === false) {
        enqueueSnackbar(`${isAvailableEditedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isAvailableEditedFlag = isAvailableEditedFlag
    }
  }, [isAvailableEditedFlag])

  return (
    <>
              <Header />
              <TitleHeader name='Edit Availability' title='Availability Management'/>
              <div className='main-layout'>
                <Form onSubmit={handleSubmit(onSubmit)} >
                  <div className="heading-box">
                      <h5>Edit Availability</h5>
                      <div className="btn-box">
                        <button onClick={() => navigate(-1)} className='theme-btn dark-btn text-none'>Cancel</button>
                        <button type='submit' className='theme-btn text-none'>Save</button>
                      </div>
                  </div>
                    <div className="form-middle-layout">
                      <Form className='light-bg'>
                          <div className="row">
                          <div className="col-md-6">
                            <Form.Group className="form-group" controlId="formstartdate">
                              <Form.Label>Date</Form.Label>
                              <Form.Control type="text" value={ location?.state?.id?.date} disabled />
                            </Form.Group>
                            </div>
                            <div className="col-md-12">
                              <Form.Group className="form-group">
                                <Form.Label>Selected Slots</Form.Label>
                                  <div className=" light-blue-bgbox">
                                    <ul className="slot-availablity four-col">
                                        {
                                          timeSlotsArray && timeSlotsArray.length > 0
                                            ? timeSlotsArray.map((timeSlot, index) => {
                                              return (
                                              <>
                                                <li> <button
                                                 className={`slot-booking whitebtn ${selectedSlots.some(e => e.time_slot_id === timeSlot?.id) && 'active'}`}
                                                type='button' onClick={() => handleSelectedSlots(timeSlot)} > <img src={timeslotmorning} alt="timeslotmorning" />{timeSlot?.from_time}</button> </li>
                                              </>
                                              )
                                            })
                                            : 'No Data Found'
                                        }
                                      </ul>
                                  </div>
                              </Form.Group>
                            </div>
                          </div>
                      </Form>
                    </div>
                </Form>
              </div>
    </>
  )
}

export default SetAvailability
