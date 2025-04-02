
/**
 * Utility functions for working with URLs
 */

// URL regex pattern to find links in text
export const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

/**
 * Extract URLs from text
 */
export const extractUrls = (text: string): string[] => {
  return text.match(URL_REGEX) || [];
};
