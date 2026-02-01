import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surface in console for debugging
    console.error('ErrorBoundary caught error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16, fontFamily: 'ui-sans-serif, system-ui' }}>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Something crashed.</h1>
          <p style={{ marginTop: 8 }}>
            Check the devtools console for details. Here’s the error message:
          </p>
          <pre
            style={{
              marginTop: 12,
              padding: 12,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 12,
              whiteSpace: 'pre-wrap',
            }}
          >
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}
