import React, { forwardRef } from "react"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { Form } from 'react-bootstrap'
import { IDateTimePickerProps } from "types/interfaces/DateTimePicker.types"

function DateTimePicker({title, errorMessage, ...props}: IDateTimePickerProps, ref: React.Ref<HTMLDivElement>) {  
  return (
    <Form.Group className="input">
    {title && <Form.Label>{title}</Form.Label>}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <MuiDateTimePicker timeSteps={{minutes: 1}} ref={ref} {...props}/>
      </DemoContainer>
    </LocalizationProvider>
    {errorMessage && <p className="errorMessage">{errorMessage}</p>}
    </Form.Group>
  )
}

export default forwardRef(DateTimePicker)