import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

// Components
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'

// Images
import timeslotmorning from '../../../assets/images/timeslotmorning.svg'

// Action Files
import { getAllTimeSlotData, viewAvailability } from '../../../Actions/Counsellor/counsellor-availability'

function SetAvailability () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const token = localStorage.getItem('token')

  //   useState
  const [selectedSlots, setselectedSlots] = useState([])
  const [availabilityDataArray, setAvailabilityDataArray] = useState([])

  // useSelector
  const timeSlotsArray = useSelector((state) => state.counsellor.timeSlotData)
  const availableDataArray = useSelector((state) => state.counsellor.availableData?.data)

  // previousProps
  const previousProps = useRef({ availableDataArray }).current

  useEffect(() => {
    if (previousProps?.availableDataArray !== availableDataArray) {
      if (availableDataArray) {
        setAvailabilityDataArray(availableDataArray)
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

    if (!selectedSlots.includes(id)) {
      updatedList = [...selectedSlots, id]
    } else {
      updatedList.splice(selectedSlots.indexOf(id), 1)
    }
    setselectedSlots(updatedList)
    // setselectedSlots([...selectedSlots, id])
  }
  return (
    <>
              <Header />
              <TitleHeader name='View Availability' title='Availability Management'/>
              <div className='main-layout'>
                  <div className="heading-box">
                      <h5>View Availability</h5>
                      <div className="btn-box">
                        <button onClick={() => navigate(-1)} className='theme-btn dark-btn text-none'>Cancel</button>
                      </div>
                  </div>
                    <div className="form-middle-layout">
                      <Form className='light-bg'>
                          <div className="row">
                          <div className="col-md-6">
                            <Form.Group className="form-group" controlId="formstartdate">
                              <Form.Label>Date</Form.Label>
                              <Form.Control type="text" value={availabilityDataArray[0]?.availableTimes[0]?.date} disabled />
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
                                                disabled={true}
                                                 className={`slot-booking whitebtn ${availabilityDataArray[0]?.availableTimes.some(e => e.time_slot_id === timeSlot?.id
                                               ) && 'active'}`}

                                                type='button' onClick={() => handleSelectedSlots(timeSlot?.id)} > <img src={timeslotmorning} alt="timeslotmorning" />{timeSlot?.from_time}</button> </li>
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
              </div>
    </>
  )
}

export default SetAvailability
