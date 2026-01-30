"use client";

interface StoreCustomStylesProps {
  customColorsEnabled: boolean;
  primaryColor: string | null;
  secondaryColor: string | null;
  backgroundColor: string | null;
  textColor: string | null;
}

export function StoreCustomStyles({
  customColorsEnabled,
  primaryColor,
  secondaryColor,
  backgroundColor,
  textColor,
}: StoreCustomStylesProps) {
  if (!customColorsEnabled) {
    return null;
  }

  return (
    <style jsx global>{`
      :root {
        ${primaryColor ? `--color-primary: ${primaryColor};` : ''}
        ${secondaryColor ? `--color-secondary: ${secondaryColor};` : ''}
        ${backgroundColor ? `--color-background: ${backgroundColor};` : ''}
        ${textColor ? `--color-text: ${textColor};` : ''}
      }
      
      /* Apply custom colors to common elements */
      .solid-button, .outline-button:hover {
        ${primaryColor ? `background-color: ${primaryColor} !important;` : ''}
      }
      
      .outline-button {
        ${primaryColor ? `border-color: ${primaryColor} !important; color: ${primaryColor} !important;` : ''}
      }
      
      .text-primary, a.text-primary {
        ${primaryColor ? `color: ${primaryColor} !important;` : ''}
      }
      
      ${backgroundColor ? `body { background-color: ${backgroundColor} !important; }` : ''}
      ${textColor ? `.text-foreground, h1, h2, h3, h4, h5, h6, p { color: ${textColor} !important; }` : ''}
    `}</style>
  );
}
