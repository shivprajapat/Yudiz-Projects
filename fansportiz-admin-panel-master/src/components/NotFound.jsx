import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

// Custom error page

const NotFound = () => {
  return (
    <div className='error-page'>
      <h2>404 | This page could not be found.</h2>
      <Button tag={Link} to='/' color='link' className="view">Go back to dashboard</Button>
    </div>
  )
}

export default NotFound
