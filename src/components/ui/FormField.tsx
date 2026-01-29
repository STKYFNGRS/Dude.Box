"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  helpText?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  success,
  helpText,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-foreground"
      >
        {label}
        {required && <span className="text-error ml-1">*</span>}
        {success && <span className="text-success ml-2 text-xs">✓</span>}
      </label>
      
      <div className="relative">
        {children}
        
        {error && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-error animate-fade-in">
            <span>✗</span>
            <span>{error}</span>
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <p className="text-xs text-muted">{helpText}</p>
      )}
      
      {error && <div className="h-6" />}
    </div>
  );
}
