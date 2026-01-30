"use client";

import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("❌ Error Boundary caught error:", error);
    console.error("Error info:", errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg p-8 max-w-md w-full border border-error shadow-xl">
            <div className="text-center">
              <div className="text-error text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Something Went Wrong
              </h2>
              <p className="text-muted-foreground mb-2 text-sm">
                {this.state.error.message || "An unexpected error occurred"}
              </p>
              <p className="text-muted-foreground/70 mb-6 text-xs">
                If this problem persists, please contact support.
              </p>
              <button
                onClick={this.reset}
                className="solid-button rounded-full px-6 py-2 w-full"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundary for checkout flows
export function CheckoutErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg p-8 max-w-md w-full border border-error shadow-xl">
            <div className="text-center">
              <div className="text-error text-5xl mb-4">💳</div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Checkout Error
              </h2>
              <p className="text-muted-foreground mb-2">
                We encountered an issue processing your payment.
              </p>
              <p className="text-sm text-muted-foreground/80 mb-6">
                {error.message || "Please try again or contact support if the problem persists."}
              </p>
              <div className="space-y-2">
                <button
                  onClick={reset}
                  className="solid-button rounded-full px-6 py-2 w-full"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      onError={(error, errorInfo) => {
        // Log to console for debugging
        console.error("🚨 Checkout error boundary triggered:");
        console.error("Error:", error);
        console.error("Component stack:", errorInfo.componentStack);
        
        // In production, you would send this to your error tracking service
        // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
