import React, { useState } from 'react'
import { DatePicker } from 'antd'
import Button from '@mui/material/Button'
import { Checkbox, FormControlLabel } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'

const { RangePicker } = DatePicker

function Navbar({ title }) {
  const initialCheckboxesState = {
    high: true,
    medium: true,
    low: true,
    log: true
  }
  const [dates, setDates] = useState([])
  const [checkboxes, setCheckboxes] = useState(initialCheckboxesState)

  function handleLive() {
    setDates([])
    setCheckboxes(initialCheckboxesState)
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked
    }))
  }

  return (
    <div className='flex h-[92px] gap-4 flex-row  justify-between items-start content-between 3xl:mb-5'>
      <div>
        <p className='text-3xl text-white 3xl:text-7xl '>{title}</p>
      </div>
      <div>
        <RangePicker
          value={dates}
          onChange={(values) => {
            setDates(values)
          }}
          className='bg-[#e2e3e6] 3xl:w-[800px] 3xl:h-[50px] 3xl:text-4xl'
        />
      </div>

      <button className='cursor-pointer    hover:text-white  px-2  border border-white rounded hover:border-red-500' onClick={handleLive}>
        <CircleIcon className='blink' style={{ color: 'red', height: '14px', marginBottom: '4px' }} />
        <span className='text-red-600 text-xl'>Live</span>
      </button>

      <div className='bg-lightBlue text-white flex items-center gap-3 '>
        <span className='px-3 3xl:text-3xl'>Severity</span>
        <FormControlLabel
          control={<Checkbox checked={checkboxes.high} onChange={handleCheckboxChange} name='high' />}
          label={<span className='3xl:text-3xl'>High</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={checkboxes.medium} onChange={handleCheckboxChange} name='medium' />}
          label={<span className='3xl:text-3xl'>Medium</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={checkboxes.low} onChange={handleCheckboxChange} name='low' />}
          label={<span className='3xl:text-3xl'>Low</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={checkboxes.log} onChange={handleCheckboxChange} name='log' />}
          label={<span className='3xl:text-3xl'>Log</span>}
        />
        <Button
          className='3xl:text-5xl'
          variant='contained'
          style={{ backgroundColor: 'black', color: 'white' }}
        >
          Show
        </Button>
      </div>
    </div>
  )
}

export default Navbar
