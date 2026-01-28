"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <Container className="py-12">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Section
          eyebrow="500 Error"
          title="Something Went Wrong"
          description="An unexpected error occurred. We've been notified and are working to fix it."
        >
          <div className="flex flex-col items-center gap-6 pt-6">
            <div className="text-9xl font-bold text-accent/20">500</div>
            {process.env.NODE_ENV === "development" && (
              <div className="card rounded-lg p-4 max-w-2xl">
                <h3 className="text-sm font-medium text-red-400 mb-2">
                  Development Error Details:
                </h3>
                <pre className="text-xs text-muted overflow-auto">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="text-xs muted mt-2">Error ID: {error.digest}</p>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={reset}
                className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em]"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Section>
      </div>
    </Container>
  );
}
