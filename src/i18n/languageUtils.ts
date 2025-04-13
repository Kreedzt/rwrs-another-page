// Language utility functions for runtime language management

/**
 * Get the initial locale based on localStorage or browser language
 * @returns {string} The detected locale code ('en' or 'zh')
 */
export const getInitialLocale = (): string => {
  const savedLocale = localStorage.getItem('app-locale');
  if (savedLocale && isValidLocale(savedLocale)) {
    return savedLocale;
  }

  return getBrowserLocale();
};

/**
 * Get the browser's preferred language
 * @returns {string} The browser locale code, defaulting to 'en' if not supported
 */
export const getBrowserLocale = (): string => {
  const browserLang = navigator.language.split('-')[0];
  return isValidLocale(browserLang) ? browserLang : 'en';
};

/**
 * Check if a locale is supported by the application
 * @param {string} locale The locale code to check
 * @returns {boolean} Whether the locale is supported
 */
export const isValidLocale = (locale: string): boolean => {
  const supportedLocales = ['en', 'zh'];
  return supportedLocales.includes(locale);
};

/**
 * Set the document's language attribute
 * @param {string} locale The locale code to set
 */
export const setDocumentLanguage = (locale: string): void => {
  if (document && document.documentElement) {
    document.documentElement.lang = locale;
  }
};

/**
 * Initialize the application's language
 * This should be called before the app renders
 */
export const initializeLanguage = (): string => {
  const locale = getInitialLocale();
  setDocumentLanguage(locale);
  return locale;
};
