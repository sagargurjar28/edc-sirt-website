import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : 'Something went wrong.' };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="container section" role="alert">
            <h2>Something went wrong.</h2>
            <p>{this.state.message}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
