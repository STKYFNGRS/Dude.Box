import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Use this when displaying user-generated content that may contain HTML
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text by removing all HTML tags
 * Use this for content that should never contain HTML (names, titles, etc.)
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize markdown-like content with more permissive tags
 * Use this for rich text fields like product descriptions
 */
export function sanitizeMarkdown(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'b', 'i', 'em', 'strong', 'u', 's', 'code', 'pre',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Escape HTML entities in a string
 * Use this as a last resort when you can't use React's automatic escaping
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate and sanitize URL to prevent javascript: and data: URI XSS
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
    return '';
  } catch {
    // Invalid URL
    return '';
  }
}

/**
 * Sanitize user input before storing in database
 * This is a comprehensive sanitization for all user-generated text fields
 */
export function sanitizeUserInput(input: string, allowHtml: boolean = false): string {
  if (!input) return '';
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Sanitize HTML if needed
  if (allowHtml) {
    sanitized = sanitizeMarkdown(sanitized);
  } else {
    sanitized = sanitizeText(sanitized);
  }
  
  return sanitized;
}

/**
 * Usage examples:
 * 
 * // For product names, store names (no HTML allowed):
 * const safeName = sanitizeText(userInput);
 * 
 * // For descriptions, bios (some formatting allowed):
 * const safeDescription = sanitizeMarkdown(userInput);
 * 
 * // For URLs (validate protocol):
 * const safeUrl = sanitizeUrl(userInput);
 * 
 * // General user input:
 * const safeInput = sanitizeUserInput(userInput, false);
 */
