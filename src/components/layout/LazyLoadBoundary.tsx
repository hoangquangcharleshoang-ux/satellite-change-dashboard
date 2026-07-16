import { Component, type ReactNode } from 'react'

interface LazyLoadBoundaryProps {
  children: ReactNode
}

interface LazyLoadBoundaryState {
  hasError: boolean
}

export class LazyLoadBoundary extends Component<
  LazyLoadBoundaryProps,
  LazyLoadBoundaryState
> {
  state: LazyLoadBoundaryState = { hasError: false }

  static getDerivedStateFromError(): LazyLoadBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="state-wrap">
          <section className="state-card" role="alert">
            <h1>Application section could not be loaded</h1>
            <p>
              A required application file was unavailable. Reload the page to
              try again.
            </p>
            <button onClick={() => window.location.reload()} type="button">
              Reload
            </button>
          </section>
        </div>
      )
    }

    return this.props.children
  }
}
