import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

function ReactCounter () {
  const [count, setCount] = useState(1)

  const decreaser = () => {
    if (count > 0) {
      setCount(count - 1)
    }
  }
  const increaser = () => {
    // Counter state is incremented
    const newnumber = +(count) + 1
    setCount(newnumber)
  }
  return (
    <div className="counter">
    <buttun onClick={
      decreaser
      } className="theme-btn">-</buttun>
    <Form.Group
                className='form-group'
                controlId='name'>
                <Form.Control
                  type='number'
                  onChange={e => setCount(e.target.value)}
                  value={count}
                />
               </Form.Group>
    <buttun onClick={increaser} className="theme-btn">+</buttun>
  </div>
  )
}

export default ReactCounter
