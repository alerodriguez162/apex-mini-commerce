import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="cart">
          <h1>Algo se quebró</h1>
          <p className="lede">Recarga la página o vuelve al inicio.</p>
        </main>
      )
    }
    return this.props.children
  }
}
