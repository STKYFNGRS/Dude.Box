"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ 
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '600px',
        }}>
          <h1 style={{ 
            fontSize: '6rem',
            margin: '0 0 1rem 0',
            color: '#6366f1',
            opacity: 0.2,
          }}>
            500
          </h1>
          <h2 style={{ 
            fontSize: '1.5rem',
            margin: '0 0 0.5rem 0',
            fontWeight: 600,
          }}>
            Critical Error
          </h2>
          <p style={{ 
            color: '#94a3b8',
            marginBottom: '2rem',
          }}>
            A critical error occurred. Please refresh the page or contact support if the problem persists.
          </p>
          {process.env.NODE_ENV === "development" && error && (
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
              overflowX: 'auto',
            }}>
              <strong style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                Development Error:
              </strong>
              <pre style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                margin: '0.5rem 0 0 0',
                whiteSpace: 'pre-wrap',
              }}>
                {error.message}
              </pre>
              {error.digest && (
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                backgroundColor: 'transparent',
                color: '#e2e8f0',
                border: '1px solid #334155',
                borderRadius: '9999px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
