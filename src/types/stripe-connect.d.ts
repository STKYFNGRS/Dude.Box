// TypeScript declarations for Stripe Connect embedded components

declare namespace JSX {
  interface IntrinsicElements {
    "stripe-connect-account-onboarding": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        stripe?: any;
        onExit?: () => void;
        onComplete?: () => void;
      },
      HTMLElement
    >;
  }
}
