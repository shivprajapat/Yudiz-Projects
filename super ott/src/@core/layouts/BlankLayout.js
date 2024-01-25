// ** React Imports
import { useEffect, useState } from 'react'

// ** Custom Hooks

const BlankLayout = ({ children, ...rest }) => {
  // ** Hooks

  // ** States
  const [isMounted, setIsMounted] = useState(false)

  //* * ComponentDidMount
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="blank-page">
      <div className="app-content content">
        <div className="content-wrapper">
          <div className="content-body">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default BlankLayout
