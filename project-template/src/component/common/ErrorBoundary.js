import React from 'react'
class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasError: false,
      error: ''
    }
  }

  componentDidCatch (error, info) {
    // Display fallback UI
    this.setState({ hasError: error, error: error.toString() })
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div style={{ margin: 30 }}>
        <h1>
          Something went wrong!
          <div style={{ color: 'red' }}>{this.state.error}</div></h1>
      </div>
    }
    return this.props.children
  }
}

export default ErrorBoundary
