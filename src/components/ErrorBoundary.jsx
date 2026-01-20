import React from "react";
import * as Sentry from "@sentry/react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for development
    console.log(error, errorInfo);
    
    // Capture the error with Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  handleReset = () => {
    // Clear local storage
    localStorage.clear();

    // Reset the error state
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI with a reset button
      return (
        <div>
          <h1>Something went wrong.</h1>
          <button onClick={this.handleReset}>Reset Local Storage</button>
        </div>
      );
    }

    return this.props.children;
  }
}
