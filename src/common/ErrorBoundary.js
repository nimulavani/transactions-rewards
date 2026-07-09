import PropTypes from 'prop-types'
import React from "react"

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false ,error: null, errorInfo: null}
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    this.setState({ error, errorInfo })
  }
  handleReset = () => {
    window.location.reload()
  }
  render() {
    if (this.state.hasError) {
      return <div>
        <h1>Something went wrong.</h1>
        <button onClick={this.handleReset}>
          Reload app
        </button>
        {this.state.error && (
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error.message}</pre>
            <pre>{this.state.errorInfo.componentStack}</pre>
          </details>
        )}
      </div>
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
}