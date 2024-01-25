import { withRouter } from 'next/router'
import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { error: null, errorInfo: null }
    }

    componentDidCatch(error, errorInfo) {
        this.props.router.replace('/')
        this.setState({
            error: error,
            errorInfo: errorInfo
        })

    }

    render() {
        return this.props.children
    }
}
export default withRouter(ErrorBoundary)
