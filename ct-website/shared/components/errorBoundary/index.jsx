import { withRouter } from 'next/router'
import React from 'react'

class ErrorBoundary extends React.Component {
  // Constructor for initializing Variables etc in a state
  // Just similar to initial line of useState if you are familiar
  // with Functional Components
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  // This method is called if any error is encountered
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and
    // re-render with error message
    // eslint-disable-next-line react/prop-types
    this.props.router.replace('/')
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error
    // reporting service here
  }

  // This will render this component wherever called
  render() {
    // Normally, just render children, i.e. in
    // case no error is Found
    // eslint-disable-next-line react/prop-types
    return this.props.children
  }
}
export default withRouter(ErrorBoundary)
