// src/components/common/ErrorBoundary.jsx
import React from "react";
import Error500 from "../../pages/ErrorPages/Error500";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to your error tracking service (e.g., Sentry)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
    // Optionally refresh the page or component
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <Error500 error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;